use cloudrpc::ai_assitant_client::AiAssitantClient;
use cloudrpc::ServiceRequest;

pub mod cloudrpc {
    tonic::include_proto!("cloudrpc");
}

type Client = AiAssitantClient<tonic::transport::Channel>;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut client = AiAssitantClient::connect("http://127.0.0.1:9090").await?;
    get_service_list(&mut client).await;
    translate(&mut client, "gRPC is a modern open source high performance Remote Procedure Call (RPC) framework that can run in any environment. It can efficiently connect services in and across data centers with pluggable support for load balancing, tracing, health checking and authentication. It is also applicable in last mile of distributed computing to connect devices, mobile applications and browsers to backend services.").await;
    Ok(())
}

async fn translate(client: &mut Client, prompt: &str) {
    let request = tonic::Request::new(ServiceRequest {
        name: "translate".into(),
        prompt: prompt.into(),
    });
    let response = client.serve(request).await.unwrap();
    println!("resp: {:#?}", response.into_inner().result);
}

async fn get_service_list(client: &mut Client) {
    let response = client
        .get_service_list(tonic::Request::new(()))
        .await
        .unwrap();
    println!("resp: {:#?}", response.into_inner().services);
}
