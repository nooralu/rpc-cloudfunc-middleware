use log::info;
use tonic::transport::Server;

mod ai_assistant;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    env_logger::init();

    let addr = "127.0.0.1:9090".parse()?;
    let service = ai_assistant::create_service();
    let service = tonic_web::enable(service);

    info!("Starting ai-assistant server at {}", addr);

    Server::builder()
        .accept_http1(true)
        .add_service(service)
        .serve(addr)
        .await?;

    Ok(())
}
