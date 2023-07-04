use log::debug;
use serde_json::Value;

pub mod config;
pub mod func;

/// Param is a key-value pair.
/// The type of value is `serde_json::Value`, so we can use it to represent any type of JSON value.
pub struct Param {
    pub name: String,
    pub value: Value,
}

pub fn convert_params_to_json(params: &Vec<Param>) -> Value {
    let mut json = serde_json::Map::new();
    for param in params {
        json.insert(param.name.clone(), param.value.clone());
    }
    Value::Object(json)
}

/// Context is used to pass data between middlewares.
pub struct Context {
    pub name: String,
    pub params: Vec<Param>,
    pub response: Value,
    pub error: Option<String>,
}

impl Context {
    pub fn new(name: String) -> Self {
        Self {
            name,
            params: Vec::new(),
            response: Value::Null,
            error: None,
        }
    }

    pub fn add_param(&mut self, name: String, value: Value) {
        self.params.push(Param { name, value });
    }

    pub fn set_response(&mut self, response: Value) {
        self.response = response;
    }

    pub fn set_error(&mut self, error: String) {
        self.error = Some(error);
    }
}

#[async_trait::async_trait]
pub trait Middleware: Send + Sync {
    async fn handle(&self, ctx: &mut Context);
}

pub struct MiddlewareChain {
    pub middlewares: Vec<Box<dyn Middleware>>,
}

impl MiddlewareChain {
    pub fn new() -> Self {
        Self {
            middlewares: Vec::new(),
        }
    }

    pub fn add(&mut self, middleware: Box<dyn Middleware>) {
        self.middlewares.push(middleware);
    }
}

impl Default for MiddlewareChain {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait::async_trait]
impl Middleware for MiddlewareChain {
    async fn handle(&self, ctx: &mut Context) {
        // Handle middlewares one by one in order of addition.
        for middleware in &self.middlewares {
            middleware.handle(ctx).await;
            if ctx.error.is_some() {
                debug!(
                    "middleware chain stopped by error: {}",
                    ctx.error.as_ref().unwrap()
                );
                break;
            }
        }
    }
}
