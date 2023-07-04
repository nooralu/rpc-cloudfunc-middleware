/**
 * @fileoverview gRPC-Web generated client stub for cloudrpc
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.4.2
// 	protoc              v3.21.12
// source: cloudrpc.proto


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as cloudrpc_pb from './cloudrpc_pb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';


export class AIAssitantClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname.replace(/\/+$/, '');
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodDescriptorServe = new grpcWeb.MethodDescriptor(
    '/cloudrpc.AIAssitant/Serve',
    grpcWeb.MethodType.UNARY,
    cloudrpc_pb.ServiceRequest,
    cloudrpc_pb.ServiceResponse,
    (request: cloudrpc_pb.ServiceRequest) => {
      return request.serializeBinary();
    },
    cloudrpc_pb.ServiceResponse.deserializeBinary
  );

  serve(
    request: cloudrpc_pb.ServiceRequest,
    metadata: grpcWeb.Metadata | null): Promise<cloudrpc_pb.ServiceResponse>;

  serve(
    request: cloudrpc_pb.ServiceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: cloudrpc_pb.ServiceResponse) => void): grpcWeb.ClientReadableStream<cloudrpc_pb.ServiceResponse>;

  serve(
    request: cloudrpc_pb.ServiceRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: cloudrpc_pb.ServiceResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/cloudrpc.AIAssitant/Serve',
        request,
        metadata || {},
        this.methodDescriptorServe,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/cloudrpc.AIAssitant/Serve',
    request,
    metadata || {},
    this.methodDescriptorServe);
  }

  methodDescriptorGetServiceList = new grpcWeb.MethodDescriptor(
    '/cloudrpc.AIAssitant/GetServiceList',
    grpcWeb.MethodType.UNARY,
    google_protobuf_empty_pb.Empty,
    cloudrpc_pb.ServiceList,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    cloudrpc_pb.ServiceList.deserializeBinary
  );

  getServiceList(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<cloudrpc_pb.ServiceList>;

  getServiceList(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: cloudrpc_pb.ServiceList) => void): grpcWeb.ClientReadableStream<cloudrpc_pb.ServiceList>;

  getServiceList(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: cloudrpc_pb.ServiceList) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/cloudrpc.AIAssitant/GetServiceList',
        request,
        metadata || {},
        this.methodDescriptorGetServiceList,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/cloudrpc.AIAssitant/GetServiceList',
    request,
    metadata || {},
    this.methodDescriptorGetServiceList);
  }

}
