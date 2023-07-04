import { AIAssitantClient } from "./CloudrpcServiceClientPb";
import { ServiceRequest } from "./cloudrpc_pb";


class Rpc {
  #client: AIAssitantClient;

  constructor(host: string) {
    this.#client = new AIAssitantClient(host, null, null);
  }

  async serve(name: string, prompt: string) {
    console.log("call", name, prompt);
    const request = new ServiceRequest();
    request.setName(name);
    request.setPrompt(prompt);
    const response = await this.#client.serve(request, null);
    return {
      status: response.getStatus(),
      result: response.getResult(),
    };
  }

  async getServiceList() {
    const request = new ServiceRequest();
    const response = await this.#client.getServiceList(request, null);
    return response.getServicesList().map((service) => ({
      name: service.getName(),
      description: service.getDescription(),
    }));
  }
}

const instance = new Rpc("http://127.0.0.1:9090");

export default instance;
