# Desc: Generate web client code from proto file
protoc -I=./proto cloudrpc.proto \
    --js_out=import_style=commonjs:./extension/ai-assistant/src/rpc \
    --grpc-web_out=import_style=typescript,mode=grpcwebtext:./extension/ai-assistant/src/rpc 
