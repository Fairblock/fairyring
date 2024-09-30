// @generated
/// Generated client implementations.
pub mod query_client {
    #![allow(unused_variables, dead_code, missing_docs, clippy::let_unit_value)]
    use tonic::codegen::*;
    use tonic::codegen::http::Uri;
    #[derive(Debug, Clone)]
    pub struct QueryClient<T> {
        inner: tonic::client::Grpc<T>,
    }
    impl QueryClient<tonic::transport::Channel> {
        /// Attempt to create a new client by connecting to a given endpoint.
        pub async fn connect<D>(dst: D) -> Result<Self, tonic::transport::Error>
        where
            D: TryInto<tonic::transport::Endpoint>,
            D::Error: Into<StdError>,
        {
            let conn = tonic::transport::Endpoint::new(dst)?.connect().await?;
            Ok(Self::new(conn))
        }
    }
    impl<T> QueryClient<T>
    where
        T: tonic::client::GrpcService<tonic::body::BoxBody>,
        T::Error: Into<StdError>,
        T::ResponseBody: Body<Data = Bytes> + Send + 'static,
        <T::ResponseBody as Body>::Error: Into<StdError> + Send,
    {
        pub fn new(inner: T) -> Self {
            let inner = tonic::client::Grpc::new(inner);
            Self { inner }
        }
        pub fn with_origin(inner: T, origin: Uri) -> Self {
            let inner = tonic::client::Grpc::with_origin(inner, origin);
            Self { inner }
        }
        pub fn with_interceptor<F>(
            inner: T,
            interceptor: F,
        ) -> QueryClient<InterceptedService<T, F>>
        where
            F: tonic::service::Interceptor,
            T::ResponseBody: Default,
            T: tonic::codegen::Service<
                http::Request<tonic::body::BoxBody>,
                Response = http::Response<
                    <T as tonic::client::GrpcService<tonic::body::BoxBody>>::ResponseBody,
                >,
            >,
            <T as tonic::codegen::Service<
                http::Request<tonic::body::BoxBody>,
            >>::Error: Into<StdError> + Send + Sync,
        {
            QueryClient::new(InterceptedService::new(inner, interceptor))
        }
        /// Compress requests with the given encoding.
        ///
        /// This requires the server to support it otherwise it might respond with an
        /// error.
        #[must_use]
        pub fn send_compressed(mut self, encoding: CompressionEncoding) -> Self {
            self.inner = self.inner.send_compressed(encoding);
            self
        }
        /// Enable decompressing responses.
        #[must_use]
        pub fn accept_compressed(mut self, encoding: CompressionEncoding) -> Self {
            self.inner = self.inner.accept_compressed(encoding);
            self
        }
        /// Limits the maximum size of a decoded message.
        ///
        /// Default: `4MB`
        #[must_use]
        pub fn max_decoding_message_size(mut self, limit: usize) -> Self {
            self.inner = self.inner.max_decoding_message_size(limit);
            self
        }
        /// Limits the maximum size of an encoded message.
        ///
        /// Default: `usize::MAX`
        #[must_use]
        pub fn max_encoding_message_size(mut self, limit: usize) -> Self {
            self.inner = self.inner.max_encoding_message_size(limit);
            self
        }
        pub async fn params(
            &mut self,
            request: impl tonic::IntoRequest<super::QueryParamsRequest>,
        ) -> std::result::Result<
            tonic::Response<super::QueryParamsResponse>,
            tonic::Status,
        > {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/fairyring.pep.Query/Params",
            );
            let mut req = request.into_request();
            req.extensions_mut()
                .insert(GrpcMethod::new("fairyring.pep.Query", "Params"));
            self.inner.unary(req, path, codec).await
        }
        pub async fn encrypted_tx(
            &mut self,
            request: impl tonic::IntoRequest<super::QueryGetEncryptedTxRequest>,
        ) -> std::result::Result<
            tonic::Response<super::QueryGetEncryptedTxResponse>,
            tonic::Status,
        > {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/fairyring.pep.Query/EncryptedTx",
            );
            let mut req = request.into_request();
            req.extensions_mut()
                .insert(GrpcMethod::new("fairyring.pep.Query", "EncryptedTx"));
            self.inner.unary(req, path, codec).await
        }
        pub async fn encrypted_tx_all(
            &mut self,
            request: impl tonic::IntoRequest<super::QueryAllEncryptedTxRequest>,
        ) -> std::result::Result<
            tonic::Response<super::QueryAllEncryptedTxResponse>,
            tonic::Status,
        > {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/fairyring.pep.Query/EncryptedTxAll",
            );
            let mut req = request.into_request();
            req.extensions_mut()
                .insert(GrpcMethod::new("fairyring.pep.Query", "EncryptedTxAll"));
            self.inner.unary(req, path, codec).await
        }
        pub async fn encrypted_tx_all_from_height(
            &mut self,
            request: impl tonic::IntoRequest<super::QueryAllEncryptedTxFromHeightRequest>,
        ) -> std::result::Result<
            tonic::Response<super::QueryAllEncryptedTxFromHeightResponse>,
            tonic::Status,
        > {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/fairyring.pep.Query/EncryptedTxAllFromHeight",
            );
            let mut req = request.into_request();
            req.extensions_mut()
                .insert(
                    GrpcMethod::new("fairyring.pep.Query", "EncryptedTxAllFromHeight"),
                );
            self.inner.unary(req, path, codec).await
        }
        pub async fn latest_height(
            &mut self,
            request: impl tonic::IntoRequest<super::QueryLatestHeightRequest>,
        ) -> std::result::Result<
            tonic::Response<super::QueryLatestHeightResponse>,
            tonic::Status,
        > {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/fairyring.pep.Query/LatestHeight",
            );
            let mut req = request.into_request();
            req.extensions_mut()
                .insert(GrpcMethod::new("fairyring.pep.Query", "LatestHeight"));
            self.inner.unary(req, path, codec).await
        }
        pub async fn pep_nonce(
            &mut self,
            request: impl tonic::IntoRequest<super::QueryGetPepNonceRequest>,
        ) -> std::result::Result<
            tonic::Response<super::QueryGetPepNonceResponse>,
            tonic::Status,
        > {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/fairyring.pep.Query/PepNonce",
            );
            let mut req = request.into_request();
            req.extensions_mut()
                .insert(GrpcMethod::new("fairyring.pep.Query", "PepNonce"));
            self.inner.unary(req, path, codec).await
        }
        pub async fn pep_nonce_all(
            &mut self,
            request: impl tonic::IntoRequest<super::QueryAllPepNonceRequest>,
        ) -> std::result::Result<
            tonic::Response<super::QueryAllPepNonceResponse>,
            tonic::Status,
        > {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/fairyring.pep.Query/PepNonceAll",
            );
            let mut req = request.into_request();
            req.extensions_mut()
                .insert(GrpcMethod::new("fairyring.pep.Query", "PepNonceAll"));
            self.inner.unary(req, path, codec).await
        }
        pub async fn pub_key(
            &mut self,
            request: impl tonic::IntoRequest<super::QueryPubKeyRequest>,
        ) -> std::result::Result<
            tonic::Response<super::QueryPubKeyResponse>,
            tonic::Status,
        > {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/fairyring.pep.Query/PubKey",
            );
            let mut req = request.into_request();
            req.extensions_mut()
                .insert(GrpcMethod::new("fairyring.pep.Query", "PubKey"));
            self.inner.unary(req, path, codec).await
        }
        pub async fn keyshare_req(
            &mut self,
            request: impl tonic::IntoRequest<super::QueryKeyshareRequest>,
        ) -> std::result::Result<
            tonic::Response<super::QueryKeyshareResponse>,
            tonic::Status,
        > {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/fairyring.pep.Query/KeyshareReq",
            );
            let mut req = request.into_request();
            req.extensions_mut()
                .insert(GrpcMethod::new("fairyring.pep.Query", "KeyshareReq"));
            self.inner.unary(req, path, codec).await
        }
        pub async fn keyshare_req_all(
            &mut self,
            request: impl tonic::IntoRequest<super::QueryAllKeyshareRequest>,
        ) -> std::result::Result<
            tonic::Response<super::QueryAllKeyshareResponse>,
            tonic::Status,
        > {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/fairyring.pep.Query/KeyshareReqAll",
            );
            let mut req = request.into_request();
            req.extensions_mut()
                .insert(GrpcMethod::new("fairyring.pep.Query", "KeyshareReqAll"));
            self.inner.unary(req, path, codec).await
        }
    }
}
/// Generated client implementations.
pub mod msg_client {
    #![allow(unused_variables, dead_code, missing_docs, clippy::let_unit_value)]
    use tonic::codegen::*;
    use tonic::codegen::http::Uri;
    #[derive(Debug, Clone)]
    pub struct MsgClient<T> {
        inner: tonic::client::Grpc<T>,
    }
    impl MsgClient<tonic::transport::Channel> {
        /// Attempt to create a new client by connecting to a given endpoint.
        pub async fn connect<D>(dst: D) -> Result<Self, tonic::transport::Error>
        where
            D: TryInto<tonic::transport::Endpoint>,
            D::Error: Into<StdError>,
        {
            let conn = tonic::transport::Endpoint::new(dst)?.connect().await?;
            Ok(Self::new(conn))
        }
    }
    impl<T> MsgClient<T>
    where
        T: tonic::client::GrpcService<tonic::body::BoxBody>,
        T::Error: Into<StdError>,
        T::ResponseBody: Body<Data = Bytes> + Send + 'static,
        <T::ResponseBody as Body>::Error: Into<StdError> + Send,
    {
        pub fn new(inner: T) -> Self {
            let inner = tonic::client::Grpc::new(inner);
            Self { inner }
        }
        pub fn with_origin(inner: T, origin: Uri) -> Self {
            let inner = tonic::client::Grpc::with_origin(inner, origin);
            Self { inner }
        }
        pub fn with_interceptor<F>(
            inner: T,
            interceptor: F,
        ) -> MsgClient<InterceptedService<T, F>>
        where
            F: tonic::service::Interceptor,
            T::ResponseBody: Default,
            T: tonic::codegen::Service<
                http::Request<tonic::body::BoxBody>,
                Response = http::Response<
                    <T as tonic::client::GrpcService<tonic::body::BoxBody>>::ResponseBody,
                >,
            >,
            <T as tonic::codegen::Service<
                http::Request<tonic::body::BoxBody>,
            >>::Error: Into<StdError> + Send + Sync,
        {
            MsgClient::new(InterceptedService::new(inner, interceptor))
        }
        /// Compress requests with the given encoding.
        ///
        /// This requires the server to support it otherwise it might respond with an
        /// error.
        #[must_use]
        pub fn send_compressed(mut self, encoding: CompressionEncoding) -> Self {
            self.inner = self.inner.send_compressed(encoding);
            self
        }
        /// Enable decompressing responses.
        #[must_use]
        pub fn accept_compressed(mut self, encoding: CompressionEncoding) -> Self {
            self.inner = self.inner.accept_compressed(encoding);
            self
        }
        /// Limits the maximum size of a decoded message.
        ///
        /// Default: `4MB`
        #[must_use]
        pub fn max_decoding_message_size(mut self, limit: usize) -> Self {
            self.inner = self.inner.max_decoding_message_size(limit);
            self
        }
        /// Limits the maximum size of an encoded message.
        ///
        /// Default: `usize::MAX`
        #[must_use]
        pub fn max_encoding_message_size(mut self, limit: usize) -> Self {
            self.inner = self.inner.max_encoding_message_size(limit);
            self
        }
        pub async fn update_params(
            &mut self,
            request: impl tonic::IntoRequest<super::MsgUpdateParams>,
        ) -> std::result::Result<
            tonic::Response<super::MsgUpdateParamsResponse>,
            tonic::Status,
        > {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/fairyring.pep.Msg/UpdateParams",
            );
            let mut req = request.into_request();
            req.extensions_mut()
                .insert(GrpcMethod::new("fairyring.pep.Msg", "UpdateParams"));
            self.inner.unary(req, path, codec).await
        }
        pub async fn submit_encrypted_tx(
            &mut self,
            request: impl tonic::IntoRequest<super::MsgSubmitEncryptedTx>,
        ) -> std::result::Result<
            tonic::Response<super::MsgSubmitEncryptedTxResponse>,
            tonic::Status,
        > {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/fairyring.pep.Msg/SubmitEncryptedTx",
            );
            let mut req = request.into_request();
            req.extensions_mut()
                .insert(GrpcMethod::new("fairyring.pep.Msg", "SubmitEncryptedTx"));
            self.inner.unary(req, path, codec).await
        }
        pub async fn submit_general_encrypted_tx(
            &mut self,
            request: impl tonic::IntoRequest<super::MsgSubmitGeneralEncryptedTx>,
        ) -> std::result::Result<
            tonic::Response<super::MsgSubmitEncryptedTxResponse>,
            tonic::Status,
        > {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/fairyring.pep.Msg/SubmitGeneralEncryptedTx",
            );
            let mut req = request.into_request();
            req.extensions_mut()
                .insert(
                    GrpcMethod::new("fairyring.pep.Msg", "SubmitGeneralEncryptedTx"),
                );
            self.inner.unary(req, path, codec).await
        }
        pub async fn create_aggregated_key_share(
            &mut self,
            request: impl tonic::IntoRequest<super::MsgCreateAggregatedKeyShare>,
        ) -> std::result::Result<
            tonic::Response<super::MsgCreateAggregatedKeyShareResponse>,
            tonic::Status,
        > {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/fairyring.pep.Msg/CreateAggregatedKeyShare",
            );
            let mut req = request.into_request();
            req.extensions_mut()
                .insert(
                    GrpcMethod::new("fairyring.pep.Msg", "CreateAggregatedKeyShare"),
                );
            self.inner.unary(req, path, codec).await
        }
        pub async fn request_general_keyshare(
            &mut self,
            request: impl tonic::IntoRequest<super::MsgRequestGeneralKeyshare>,
        ) -> std::result::Result<
            tonic::Response<super::MsgRequestGeneralKeyshareResponse>,
            tonic::Status,
        > {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/fairyring.pep.Msg/RequestGeneralKeyshare",
            );
            let mut req = request.into_request();
            req.extensions_mut()
                .insert(GrpcMethod::new("fairyring.pep.Msg", "RequestGeneralKeyshare"));
            self.inner.unary(req, path, codec).await
        }
        pub async fn get_general_keyshare(
            &mut self,
            request: impl tonic::IntoRequest<super::MsgGetGeneralKeyshare>,
        ) -> std::result::Result<
            tonic::Response<super::MsgGetGeneralKeyshareResponse>,
            tonic::Status,
        > {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/fairyring.pep.Msg/GetGeneralKeyshare",
            );
            let mut req = request.into_request();
            req.extensions_mut()
                .insert(GrpcMethod::new("fairyring.pep.Msg", "GetGeneralKeyshare"));
            self.inner.unary(req, path, codec).await
        }
    }
}
