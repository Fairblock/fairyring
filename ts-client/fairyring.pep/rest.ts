/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface PepActivePubKey {
  publicKey?: string;
  creator?: string;

  /** @format uint64 */
  expiry?: string;
}

export interface PepEncryptedTx {
  /** @format uint64 */
  targetHeight?: string;

  /** @format uint64 */
  index?: string;
  data?: string;
  creator?: string;

  /**
   * Coin defines a token with a denomination and an amount.
   *
   * NOTE: The amount field is an Int which implements the custom method
   * signatures required by gogoproto.
   */
  chargedGas?: V1Beta1Coin;
}

export interface PepEncryptedTxArray {
  encryptedTx?: PepEncryptedTx[];
}

export type PepMsgCreateAggregatedKeyShareResponse = object;

export type PepMsgSubmitEncryptedTxResponse = object;

/**
 * Params defines the parameters for the module.
 */
export interface PepParams {
  trusted_counter_parties?: PepTrustedCounterParty[];
  trusted_addresses?: string[];
  channel_id?: string;

  /**
   * Coin defines a token with a denomination and an amount.
   *
   * NOTE: The amount field is an Int which implements the custom method
   * signatures required by gogoproto.
   */
  minGasPrice?: V1Beta1Coin;
}

export interface PepPepNonce {
  address?: string;

  /** @format uint64 */
  nonce?: string;
}

export interface PepQueryAllEncryptedTxFromHeightResponse {
  encryptedTxArray?: PepEncryptedTxArray;
}

export interface PepQueryAllEncryptedTxResponse {
  encryptedTxArray?: PepEncryptedTxArray[];

  /**
   * PageResponse is to be embedded in gRPC response messages where the
   * corresponding request message has used PageRequest.
   *
   *  message SomeResponse {
   *          repeated Bar results = 1;
   *          PageResponse page = 2;
   *  }
   */
  pagination?: V1Beta1PageResponse;
}

export interface PepQueryAllPepNonceResponse {
  pepNonce?: PepPepNonce[];

  /**
   * PageResponse is to be embedded in gRPC response messages where the
   * corresponding request message has used PageRequest.
   *
   *  message SomeResponse {
   *          repeated Bar results = 1;
   *          PageResponse page = 2;
   *  }
   */
  pagination?: V1Beta1PageResponse;
}

export interface PepQueryGetEncryptedTxResponse {
  encryptedTx?: PepEncryptedTx;
}

export interface PepQueryGetPepNonceResponse {
  pepNonce?: PepPepNonce;
}

export interface PepQueryLatestHeightResponse {
  /** @format uint64 */
  height?: string;
}

/**
 * QueryParamsResponse is response type for the Query/Params RPC method.
 */
export interface PepQueryParamsResponse {
  /** params holds all the parameters of this module. */
  params?: PepParams;
}

export interface PepQueryPubKeyResponse {
  activePubKey?: PepActivePubKey;
  queuedPubKey?: PepQueuedPubKey;
}

export interface PepQueuedPubKey {
  publicKey?: string;
  creator?: string;

  /** @format uint64 */
  expiry?: string;
}

export interface PepTrustedCounterParty {
  client_id?: string;
  connection_id?: string;
  channel_id?: string;
}

export interface ProtobufAny {
  "@type"?: string;
}

export interface RpcStatus {
  /** @format int32 */
  code?: number;
  message?: string;
  details?: ProtobufAny[];
}

/**
* Coin defines a token with a denomination and an amount.

NOTE: The amount field is an Int which implements the custom method
signatures required by gogoproto.
*/
export interface V1Beta1Coin {
  denom?: string;
  amount?: string;
}

/**
* message SomeRequest {
         Foo some_parameter = 1;
         PageRequest pagination = 2;
 }
*/
export interface V1Beta1PageRequest {
  /**
   * key is a value returned in PageResponse.next_key to begin
   * querying the next page most efficiently. Only one of offset or key
   * should be set.
   * @format byte
   */
  key?: string;

  /**
   * offset is a numeric offset that can be used when key is unavailable.
   * It is less efficient than using key. Only one of offset or key should
   * be set.
   * @format uint64
   */
  offset?: string;

  /**
   * limit is the total number of results to be returned in the result page.
   * If left empty it will default to a value to be set by each app.
   * @format uint64
   */
  limit?: string;

  /**
   * count_total is set to true  to indicate that the result set should include
   * a count of the total number of items available for pagination in UIs.
   * count_total is only respected when offset is used. It is ignored when key
   * is set.
   */
  count_total?: boolean;

  /**
   * reverse is set to true if results are to be returned in the descending order.
   *
   * Since: cosmos-sdk 0.43
   */
  reverse?: boolean;
}

/**
* PageResponse is to be embedded in gRPC response messages where the
corresponding request message has used PageRequest.

 message SomeResponse {
         repeated Bar results = 1;
         PageResponse page = 2;
 }
*/
export interface V1Beta1PageResponse {
  /**
   * next_key is the key to be passed to PageRequest.key to
   * query the next page most efficiently. It will be empty if
   * there are no more results.
   * @format byte
   */
  next_key?: string;

  /**
   * total is total number of results available if PageRequest.count_total
   * was set, its value is undefined otherwise
   * @format uint64
   */
  total?: string;
}

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, ResponseType } from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  private mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.instance.defaults.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  private createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      formData.append(
        key,
        property instanceof Blob
          ? property
          : typeof property === "object" && property !== null
          ? JSON.stringify(property)
          : `${property}`,
      );
      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = (format && this.format) || void 0;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      requestParams.headers.common = { Accept: "*/*" };
      requestParams.headers.post = {};
      requestParams.headers.put = {};

      body = this.createFormData(body as Record<string, unknown>);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        ...(requestParams.headers || {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title fairyring/pep/aggregated_key_share.proto
 * @version version not set
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Query
   * @name QueryEncryptedTxAll
   * @summary Queries a list of EncryptedTx items.
   * @request GET:/fairyring/pep/encrypted_tx
   */
  queryEncryptedTxAll = (
    query?: {
      "pagination.key"?: string;
      "pagination.offset"?: string;
      "pagination.limit"?: string;
      "pagination.count_total"?: boolean;
      "pagination.reverse"?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<PepQueryAllEncryptedTxResponse, RpcStatus>({
      path: `/fairyring/pep/encrypted_tx`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryEncryptedTxAllFromHeight
   * @summary Queries a list of EncryptedTx items.
   * @request GET:/fairyring/pep/encrypted_tx/{targetHeight}
   */
  queryEncryptedTxAllFromHeight = (targetHeight: string, params: RequestParams = {}) =>
    this.request<PepQueryAllEncryptedTxFromHeightResponse, RpcStatus>({
      path: `/fairyring/pep/encrypted_tx/${targetHeight}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryEncryptedTx
   * @summary Queries a EncryptedTx by index.
   * @request GET:/fairyring/pep/encrypted_tx/{targetHeight}/{index}
   */
  queryEncryptedTx = (targetHeight: string, index: string, params: RequestParams = {}) =>
    this.request<PepQueryGetEncryptedTxResponse, RpcStatus>({
      path: `/fairyring/pep/encrypted_tx/${targetHeight}/${index}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryLatestHeight
   * @summary Queries a list of LatestHeight items.
   * @request GET:/fairyring/pep/latest_height
   */
  queryLatestHeight = (params: RequestParams = {}) =>
    this.request<PepQueryLatestHeightResponse, RpcStatus>({
      path: `/fairyring/pep/latest_height`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryParams
   * @summary Parameters queries the parameters of the module.
   * @request GET:/fairyring/pep/params
   */
  queryParams = (params: RequestParams = {}) =>
    this.request<PepQueryParamsResponse, RpcStatus>({
      path: `/fairyring/pep/params`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryPepNonceAll
   * @summary Queries a list of PepNonce items.
   * @request GET:/fairyring/pep/pep_nonce
   */
  queryPepNonceAll = (
    query?: {
      "pagination.key"?: string;
      "pagination.offset"?: string;
      "pagination.limit"?: string;
      "pagination.count_total"?: boolean;
      "pagination.reverse"?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<PepQueryAllPepNonceResponse, RpcStatus>({
      path: `/fairyring/pep/pep_nonce`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryPepNonce
   * @summary Queries a PepNonce by index.
   * @request GET:/fairyring/pep/pep_nonce/{address}
   */
  queryPepNonce = (address: string, params: RequestParams = {}) =>
    this.request<PepQueryGetPepNonceResponse, RpcStatus>({
      path: `/fairyring/pep/pep_nonce/${address}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryPubKey
   * @summary Queries the public keys
   * @request GET:/fairyring/pep/pub_key
   */
  queryPubKey = (params: RequestParams = {}) =>
    this.request<PepQueryPubKeyResponse, RpcStatus>({
      path: `/fairyring/pep/pub_key`,
      method: "GET",
      format: "json",
      ...params,
    });
}
