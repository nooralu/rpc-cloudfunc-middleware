use super::FuncInfo;
use crate::{convert_params_to_json, Param};
use log::debug;
use serde::{Deserialize, Serialize};

/// `AliyunSpec` is used to build request for aliyun function.
#[derive(Serialize, Deserialize)]
pub struct AliyunSpec {
    method: String,
}

impl AliyunSpec {
    pub fn build_request(
        &self,
        client: &reqwest::Client,
        func: &FuncInfo,
        params: &Vec<Param>,
    ) -> Result<reqwest::RequestBuilder, String> {
        let params = convert_params_to_json(params);
        debug!("params: {}", params);
        match self.method.as_str() {
            "GET" => Ok(client.get(&func.url).json(&params)),
            "POST" => Ok(client.post(&func.url).json(&params)),
            _ => Err(format!("unsupported method {}", self.method)),
        }
    }
}
