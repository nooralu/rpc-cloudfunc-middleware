import * as jspb from 'google-protobuf'

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';


export class ServiceRequest extends jspb.Message {
  getName(): string;
  setName(value: string): ServiceRequest;

  getPrompt(): string;
  setPrompt(value: string): ServiceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceRequest): ServiceRequest.AsObject;
  static serializeBinaryToWriter(message: ServiceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceRequest;
  static deserializeBinaryFromReader(message: ServiceRequest, reader: jspb.BinaryReader): ServiceRequest;
}

export namespace ServiceRequest {
  export type AsObject = {
    name: string,
    prompt: string,
  }
}

export class ServiceResponse extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): ServiceResponse;

  getResult(): string;
  setResult(value: string): ServiceResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceResponse): ServiceResponse.AsObject;
  static serializeBinaryToWriter(message: ServiceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceResponse;
  static deserializeBinaryFromReader(message: ServiceResponse, reader: jspb.BinaryReader): ServiceResponse;
}

export namespace ServiceResponse {
  export type AsObject = {
    status: number,
    result: string,
  }
}

export class Service extends jspb.Message {
  getName(): string;
  setName(value: string): Service;

  getDescription(): string;
  setDescription(value: string): Service;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Service.AsObject;
  static toObject(includeInstance: boolean, msg: Service): Service.AsObject;
  static serializeBinaryToWriter(message: Service, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Service;
  static deserializeBinaryFromReader(message: Service, reader: jspb.BinaryReader): Service;
}

export namespace Service {
  export type AsObject = {
    name: string,
    description: string,
  }
}

export class ServiceList extends jspb.Message {
  getServicesList(): Array<Service>;
  setServicesList(value: Array<Service>): ServiceList;
  clearServicesList(): ServiceList;
  addServices(value?: Service, index?: number): Service;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceList.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceList): ServiceList.AsObject;
  static serializeBinaryToWriter(message: ServiceList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceList;
  static deserializeBinaryFromReader(message: ServiceList, reader: jspb.BinaryReader): ServiceList;
}

export namespace ServiceList {
  export type AsObject = {
    servicesList: Array<Service.AsObject>,
  }
}

