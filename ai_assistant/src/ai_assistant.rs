use self::cloudrpc::{Service, ServiceList, ServiceRequest, ServiceResponse};
use cloudrpc::ai_assitant_server::{AiAssitant, AiAssitantServer};
use log::info;
use reqwest::Client;
use rpc_cloudfunc_middleware::{
    config, func::FuncInvokeMiddleware, Context, Middleware, MiddlewareChain,
};
use serde_json::Value;
use std::sync::Arc;
use tonic::{Request, Response, Status};

pub mod cloudrpc {
    tonic::include_proto!("cloudrpc");
}

pub struct MyAiAssitant {
    middlewares: Box<dyn Middleware>,
    config: config::ConfigWrapper,
}

impl MyAiAssitant {
    fn create_context(reuqest: Request<ServiceRequest>) -> Context {
        let ServiceRequest { name, prompt } = reuqest.into_inner();
        let mut ctx = Context::new(name);
        ctx.add_param("prompt".to_string(), Value::String(prompt));
        ctx
    }
}

#[tonic::async_trait]
impl AiAssitant for MyAiAssitant {
    async fn serve(
        &self,
        request: Request<ServiceRequest>,
    ) -> Result<Response<ServiceResponse>, Status> {
        info!("serve");
        let mut ctx = MyAiAssitant::create_context(request);
        self.middlewares.handle(&mut ctx).await;

        let reply = match ctx.error {
            Some(error) => ServiceResponse {
                status: 400,
                result: error,
            },
            None => ServiceResponse {
                status: 200,
                result: ctx.response["message"].to_string(),
            },
        };

        Ok(Response::new(reply))
    }

    async fn get_service_list(&self, _: Request<()>) -> Result<Response<ServiceList>, Status> {
        info!("get service list");
        let services = self.config.get_func_list(|func| Service {
            name: func.get_info().name.clone(),
            description: func.get_info().description.clone(),
        });
        // TODO: cache the result ?
        let reply = ServiceList { services };
        Ok(Response::new(reply))
    }
}

pub fn create_service() -> AiAssitantServer<MyAiAssitant> {
    // TODO: Dynamic reload config ?
    let config = config::Config::load_from_json_file("functions.json");
    let config = Arc::new(config);

    let mut middlewares = MiddlewareChain::new();

    middlewares.add(Box::new(FuncInvokeMiddleware::new(
        Client::new(),
        config.clone(),
    )));

    let middlewares = Box::new(middlewares);
    let ai_assistant = MyAiAssitant {
        middlewares,
        config,
    };
    AiAssitantServer::new(ai_assistant)

    // TODO: The following code are two possible ways to check auth
    // 1. add interceptor to check auth
    //   AiAssitantServer::with_interceptor(ai_assistant, interceptor)
    // 2. add middleware to check auth
}

// fn interceptor(req: Request<()>) -> Result<Request<()>, Status> {
//     info!("Got a request: {:?}", req);
//     // check auth here
//     Ok(req)
// }
