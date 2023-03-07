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

export interface FairblockEncryptedTx {
  /** @format uint64 */
  targetHeight?: string;

  /** @format uint64 */
  index?: string;
  data?: string;
  creator?: string;
}

export interface FairblockEncryptedTxArray {
  encryptedTx?: FairblockEncryptedTx[];
}

export interface FairblockFairblockExecutedNonce {
  address?: string;

  /** @format uint64 */
  nonce?: string;
}

export interface FairblockFairblockNonce {
  address?: string;

  /** @format uint64 */
  nonce?: string;
}

export type FairblockMsgCreateAggregatedKeyShareResponse = object;

export type FairblockMsgSendCurrentHeightResponse = object;

export type FairblockMsgSubmitEncryptedTxResponse = object;

/**
 * Params defines the parameters for the module.
 */
export type FairblockParams = object;

export interface FairblockQueryAllEncryptedTxFromHeightResponse {
  encryptedTxArray?: FairblockEncryptedTxArray;
}

export interface FairblockQueryAllEncryptedTxResponse {
  encryptedTxArray?: FairblockEncryptedTxArray[];

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

export interface FairblockQueryAllFairblockExecutedNonceResponse {
  fairblockExecutedNonce?: FairblockFairblockExecutedNonce[];

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

export interface FairblockQueryAllFairblockNonceResponse {
  fairblockNonce?: FairblockFairblockNonce[];

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

export interface FairblockQueryGetEncryptedTxResponse {
  encryptedTx?: FairblockEncryptedTx;
}

export interface FairblockQueryGetFairblockExecutedNonceResponse {
  fairblockExecutedNonce?: FairblockFairblockExecutedNonce;
}

export interface FairblockQueryGetFairblockNonceResponse {
  fairblockNonce?: FairblockFairblockNonce;
}

export interface FairblockQueryLatestHeightResponse {
  /** @format uint64 */
  height?: string;
}

/**
 * QueryParamsResponse is response type for the Query/Params RPC method.
 */
export interface FairblockQueryParamsResponse {
  /** params holds all the parameters of this module. */
  params?: FairblockParams;
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
 * @title fairyring/fairblock/aggregated_key_share.proto
 * @version version not set
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Query
   * @name QueryEncryptedTxAll
   * @summary Queries a list of EncryptedTx items.
   * @request GET:/fairyring/fairblock/encrypted_tx
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
    this.request<FairblockQueryAllEncryptedTxResponse, RpcStatus>({
      path: `/fairyring/fairblock/encrypted_tx`,
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
   * @request GET:/fairyring/fairblock/encrypted_tx/{targetHeight}
   */
  queryEncryptedTxAllFromHeight = (targetHeight: string, params: RequestParams = {}) =>
    this.request<FairblockQueryAllEncryptedTxFromHeightResponse, RpcStatus>({
      path: `/fairyring/fairblock/encrypted_tx/${targetHeight}`,
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
   * @request GET:/fairyring/fairblock/encrypted_tx/{targetHeight}/{index}
   */
  queryEncryptedTx = (targetHeight: string, index: string, params: RequestParams = {}) =>
    this.request<FairblockQueryGetEncryptedTxResponse, RpcStatus>({
      path: `/fairyring/fairblock/encrypted_tx/${targetHeight}/${index}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryFairblockExecutedNonceAll
   * @summary Queries a list of FairblockExecutedNonce items.
   * @request GET:/fairyring/fairblock/fairblock_executed_nonce
   */
  queryFairblockExecutedNonceAll = (
    query?: {
      "pagination.key"?: string;
      "pagination.offset"?: string;
      "pagination.limit"?: string;
      "pagination.count_total"?: boolean;
      "pagination.reverse"?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<FairblockQueryAllFairblockExecutedNonceResponse, RpcStatus>({
      path: `/fairyring/fairblock/fairblock_executed_nonce`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryFairblockExecutedNonce
   * @summary Queries a FairblockExecutedNonce by index.
   * @request GET:/fairyring/fairblock/fairblock_executed_nonce/{address}
   */
  queryFairblockExecutedNonce = (address: string, params: RequestParams = {}) =>
    this.request<FairblockQueryGetFairblockExecutedNonceResponse, RpcStatus>({
      path: `/fairyring/fairblock/fairblock_executed_nonce/${address}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryFairblockNonceAll
   * @summary Queries a list of FairblockNonce items.
   * @request GET:/fairyring/fairblock/fairblock_nonce
   */
  queryFairblockNonceAll = (
    query?: {
      "pagination.key"?: string;
      "pagination.offset"?: string;
      "pagination.limit"?: string;
      "pagination.count_total"?: boolean;
      "pagination.reverse"?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<FairblockQueryAllFairblockNonceResponse, RpcStatus>({
      path: `/fairyring/fairblock/fairblock_nonce`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryFairblockNonce
   * @summary Queries a FairblockNonce by index.
   * @request GET:/fairyring/fairblock/fairblock_nonce/{address}
   */
  queryFairblockNonce = (address: string, params: RequestParams = {}) =>
    this.request<FairblockQueryGetFairblockNonceResponse, RpcStatus>({
      path: `/fairyring/fairblock/fairblock_nonce/${address}`,
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
   * @request GET:/fairyring/fairblock/latest_height
   */
  queryLatestHeight = (params: RequestParams = {}) =>
    this.request<FairblockQueryLatestHeightResponse, RpcStatus>({
      path: `/fairyring/fairblock/latest_height`,
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
   * @request GET:/fairyring/fairblock/params
   */
  queryParams = (params: RequestParams = {}) =>
    this.request<FairblockQueryParamsResponse, RpcStatus>({
      path: `/fairyring/fairblock/params`,
      method: "GET",
      format: "json",
      ...params,
    });
}
