use self::spec_func::AliyunSpec;
use super::{config, Context, Middleware, Param};
use log::{debug, info};
use serde::{Deserialize, Serialize};
use serde_json::Value;

pub mod spec_func;

/// Each function has a `FuncInfo` and a `SpecFunc`.
/// `FuncInfo` is used to describe the function, and `SpecFunc` is used to build request.
#[derive(Serialize, Deserialize)]
pub enum Func {
    Aliyun { info: FuncInfo, spec: AliyunSpec },
}

impl Func {
    pub fn get_info(&self) -> &FuncInfo {
        match self {
            Func::Aliyun { info, .. } => info,
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct FuncInfo {
    pub name: String,
    pub url: String,
    pub description: String,
}

fn build_request(
    client: &reqwest::Client,
    func: &Func,
    params: &Vec<Param>,
) -> Result<reqwest::RequestBuilder, String> {
    match func {
        Func::Aliyun { info, spec } => spec.build_request(client, info, params),
    }
}

/// FuncInvokeMiddleware is used to invoke function.
pub struct FuncInvokeMiddleware {
    client: reqwest::Client,
    config: config::ConfigWrapper,
}

impl FuncInvokeMiddleware {
    pub fn new(client: reqwest::Client, config: config::ConfigWrapper) -> Self {
        FuncInvokeMiddleware { client, config }
    }
}

#[async_trait::async_trait]
impl Middleware for FuncInvokeMiddleware {
    async fn handle(&self, ctx: &mut Context) {
        info!("invoke function {}", ctx.name);
        // get function from config
        match self.config.get_func(&ctx.name) {
            Some(func) => {
                // build request
                let request = build_request(&self.client, func, &ctx.params);
                if let Err(err) = request {
                    debug!("build request error: {}", err);
                    ctx.set_error("Internal Server Error".to_string());
                    return;
                }
                // send request
                match request.unwrap().send().await {
                    // parse response to type `serde_json::Value`,
                    // so that it can be converted to any possible type depending on the service.
                    Ok(response) => match response.json::<Value>().await {
                        Ok(json_value) => {
                            debug!("parse response success, value: {}", json_value);
                            ctx.set_response(json_value);
                        }
                        Err(err) => {
                            debug!("parse response error: {}", err);
                            ctx.set_error("Internal Server Error".to_string());
                        }
                    },
                    Err(err) => {
                        debug!("send request error: {}", err);
                        ctx.set_error("Internal Server Error".to_string());
                    }
                }
            }
            None => {
                debug!("function {} not found", ctx.name);
                ctx.set_error(format!("function {} not found", ctx.name));
            }
        }
    }
}

#[derive(serde::Deserialize)]
#[allow(dead_code)]
pub struct FuncConfig {
    pub version: String,
    pub functions: Vec<Func>,
}
