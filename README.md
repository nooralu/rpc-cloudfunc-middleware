本项目为使用 [gRPC](https://grpc.io/) 调用 Serverless 函数提供了一个简单实现。并且基于 [tonic](https://crates.io/crates/tonic) 实现了一个简单的 gRPC 服务端，以及一个 Chrome 扩展，使得可以在 Web 环境中使用 gRPC。

# 前提条件

- 安装 Rust 环境，参考 [Rust 安装指南](https://www.rust-lang.org/tools/install)。

- 安装 [Node.js](https://nodejs.org/en/) 环境。

- 有一个可用的 [阿里云函数](https://fcnext.console.aliyun.com/)。

    仓库中有一个封装有道翻译的 [demo 函数代码](/ai_assistant/cloudfunc_demo/aliyun_translation.py)，你也可以将其他的 API 封装成函数，然后使用该项目调用。

# 使用方法

1. 配置

    你需要修改 [functions.json](/functions.json)，添加或修改云函数配置。注意，仓库中只有阿里云函数调用[实现](/middleware/src/func/spec_func.rs)。

2. 编译/运行 [server](/ai_assistant/src/server.rs)

    ```bash
    $ cargo build --release 
    $ RUST_LOG=debug ./target/release/server
    ```

    或者

    ```bash
    $ RUST_LOG=debug cargo run --bin server
    ```

    其中，`RUST_LOG` 环境变量用于设置日志级别，可选值为 `debug`、`info`、`warn`、`error`。

3. 打包 [Chrome 扩展](/ai_assistant/extension/ai-assistant/)

    ```bash
    $ npm install
    $ npm run build
    ```
4. 加载 Chrome 扩展

    打开 Chrome 浏览器，进入扩展程序管理页面，勾选开发者模式，点击加载已解压的扩展程序，选择 dist 目录。

# 使用效果



# 注意事项

- 根据 gPRC 官网[介绍](https://grpc.io/docs/platforms/web/)，gPRC 使用了 HTTP/2 作为传输协议，但是 Web 环境对 HTTP/2 的支持并不完善，所以需要使用使用代理。

    本项目基于 Rust 实现的 gRPC 框架 tonic，它提供能够接收 HTTP/1.1 请求的服务端，所以可以直接在 Web 环境中使用。

    ```rust
    Server::builder()
        .accept_http1(true)
        .add_service(service)
        .serve(addr)
        .await?;
    ```

- 如果你需要修改[接口](/ai_assistant/proto/cloudrpc.proto)，可以使用 [gen-we-client.sh](/gen-web-client.sh) 生成为 JavaScript 客户端代码。

    需要根据 [gprc-web](https://github.com/grpc/grpc-web) 安装依赖。
    
