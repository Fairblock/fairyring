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

export interface KeyshareActivePubKey {
  publicKey?: string;
  creator?: string;

  /** @format uint64 */
  expiry?: string;
}

export interface KeyshareAggregatedKeyShare {
  /** @format uint64 */
  height?: string;
  data?: string;
}

export interface KeyshareAuthorizedAddress {
  target?: string;
  isAuthorized?: boolean;
  authorizedBy?: string;
}

export interface KeyshareCommitments {
  commitments?: string[];
}

export interface KeyshareGeneralKeyShare {
  validator?: string;
  idType?: string;
  idValue?: string;
  keyShare?: string;

  /** @format uint64 */
  keyShareIndex?: string;

  /** @format uint64 */
  receivedTimestamp?: string;

  /** @format uint64 */
  receivedBlockHeight?: string;
}

export interface KeyshareKeyShare {
  validator?: string;

  /** @format uint64 */
  blockHeight?: string;
  keyShare?: string;

  /** @format uint64 */
  keyShareIndex?: string;

  /** @format uint64 */
  receivedTimestamp?: string;

  /** @format uint64 */
  receivedBlockHeight?: string;
}

export type KeyshareMsgCreateAuthorizedAddressResponse = object;

export interface KeyshareMsgCreateGeneralKeyShareResponse {
  creator?: string;
  idType?: string;
  idValue?: string;
  keyShare?: string;

  /** @format uint64 */
  keyShareIndex?: string;

  /** @format uint64 */
  receivedBlockHeight?: string;
  success?: boolean;
  errorMessage?: string;
}

export type KeyshareMsgCreateLatestPubKeyResponse = object;

export type KeyshareMsgDeleteAuthorizedAddressResponse = object;

export interface KeyshareMsgRegisterValidatorResponse {
  creator?: string;
}

export interface KeyshareMsgSendKeyshareResponse {
  creator?: string;
  keyshare?: string;

  /** @format uint64 */
  keyshareIndex?: string;

  /** @format uint64 */
  blockHeight?: string;

  /** @format uint64 */
  receivedBlockHeight?: string;
  success?: boolean;
  errorMessage?: string;
}

export type KeyshareMsgUpdateAuthorizedAddressResponse = object;

/**
 * Params defines the parameters for the module.
 */
export interface KeyshareParams {
  /** @format uint64 */
  key_expiry?: string;
  trusted_addresses?: string[];

  /** @format byte */
  slash_fraction_no_keyshare?: string;

  /** @format byte */
  slash_fraction_wrong_keyshare?: string;

  /** @format uint64 */
  minimum_bonded?: string;

  /** @format uint64 */
  max_idled_block?: string;
}

export interface KeyshareQueryAllAggregatedKeyShareResponse {
  aggregatedKeyShare?: KeyshareAggregatedKeyShare[];

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

export interface KeyshareQueryAllAuthorizedAddressResponse {
  authorizedAddress?: KeyshareAuthorizedAddress[];

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

export interface KeyshareQueryAllGeneralKeyShareResponse {
  generalKeyShare?: KeyshareGeneralKeyShare[];

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

export interface KeyshareQueryAllKeyShareResponse {
  keyShare?: KeyshareKeyShare[];

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

export interface KeyshareQueryAllValidatorSetResponse {
  validatorSet?: KeyshareValidatorSet[];

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

export interface KeyshareQueryCommitmentsResponse {
  activeCommitments?: KeyshareCommitments;
  queuedCommitments?: KeyshareCommitments;
}

export interface KeyshareQueryGetAggregatedKeyShareResponse {
  aggregatedKeyShare?: KeyshareAggregatedKeyShare;
}

export interface KeyshareQueryGetAuthorizedAddressResponse {
  authorizedAddress?: KeyshareAuthorizedAddress;
}

export interface KeyshareQueryGetGeneralKeyShareResponse {
  generalKeyShare?: KeyshareGeneralKeyShare;
}

export interface KeyshareQueryGetKeyShareResponse {
  keyShare?: KeyshareKeyShare;
}

export interface KeyshareQueryGetValidatorSetResponse {
  validatorSet?: KeyshareValidatorSet;
}

/**
 * QueryParamsResponse is response type for the Query/Params RPC method.
 */
export interface KeyshareQueryParamsResponse {
  /** params holds all the parameters of this module. */
  params?: KeyshareParams;
}

export interface KeyshareQueryPubKeyResponse {
  activePubKey?: KeyshareActivePubKey;
  queuedPubKey?: KeyshareQueuedPubKey;
}

export interface KeyshareQueuedPubKey {
  publicKey?: string;
  creator?: string;

  /** @format uint64 */
  expiry?: string;
}

export interface KeyshareValidatorSet {
  index?: string;
  validator?: string;
  consAddr?: string;
  isActive?: boolean;
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
 * @title fairyring/keyshare/aggregated_key_share.proto
 * @version version not set
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Query
   * @name QueryAggregatedKeyShareAll
   * @request GET:/fairyring/keyshare/aggregated_key_share
   */
  queryAggregatedKeyShareAll = (
    query?: {
      "pagination.key"?: string;
      "pagination.offset"?: string;
      "pagination.limit"?: string;
      "pagination.count_total"?: boolean;
      "pagination.reverse"?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<KeyshareQueryAllAggregatedKeyShareResponse, RpcStatus>({
      path: `/fairyring/keyshare/aggregated_key_share`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryAggregatedKeyShare
   * @summary Queries a list of AggregatedKeyShare items.
   * @request GET:/fairyring/keyshare/aggregated_key_share/{height}
   */
  queryAggregatedKeyShare = (height: string, params: RequestParams = {}) =>
    this.request<KeyshareQueryGetAggregatedKeyShareResponse, RpcStatus>({
      path: `/fairyring/keyshare/aggregated_key_share/${height}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryAuthorizedAddressAll
   * @request GET:/fairyring/keyshare/authorized_address
   */
  queryAuthorizedAddressAll = (
    query?: {
      "pagination.key"?: string;
      "pagination.offset"?: string;
      "pagination.limit"?: string;
      "pagination.count_total"?: boolean;
      "pagination.reverse"?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<KeyshareQueryAllAuthorizedAddressResponse, RpcStatus>({
      path: `/fairyring/keyshare/authorized_address`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryAuthorizedAddress
   * @summary Queries a list of AuthorizedAddress items.
   * @request GET:/fairyring/keyshare/authorized_address/{target}
   */
  queryAuthorizedAddress = (target: string, params: RequestParams = {}) =>
    this.request<KeyshareQueryGetAuthorizedAddressResponse, RpcStatus>({
      path: `/fairyring/keyshare/authorized_address/${target}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryCommitments
   * @request GET:/fairyring/keyshare/commitments
   */
  queryCommitments = (params: RequestParams = {}) =>
    this.request<KeyshareQueryCommitmentsResponse, RpcStatus>({
      path: `/fairyring/keyshare/commitments`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryGeneralKeyShareAll
   * @request GET:/fairyring/keyshare/general_key_share
   */
  queryGeneralKeyShareAll = (
    query?: {
      "pagination.key"?: string;
      "pagination.offset"?: string;
      "pagination.limit"?: string;
      "pagination.count_total"?: boolean;
      "pagination.reverse"?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<KeyshareQueryAllGeneralKeyShareResponse, RpcStatus>({
      path: `/fairyring/keyshare/general_key_share`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryGeneralKeyShare
   * @summary Queries a list of GeneralKeyShare items.
   * @request GET:/fairyring/keyshare/general_key_share/{validator}/{idType}/{idValue}
   */
  queryGeneralKeyShare = (validator: string, idType: string, idValue: string, params: RequestParams = {}) =>
    this.request<KeyshareQueryGetGeneralKeyShareResponse, RpcStatus>({
      path: `/fairyring/keyshare/general_key_share/${validator}/${idType}/${idValue}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryKeyShareAll
   * @summary Queries a list of KeyShare items.
   * @request GET:/fairyring/keyshare/key_share
   */
  queryKeyShareAll = (
    query?: {
      "pagination.key"?: string;
      "pagination.offset"?: string;
      "pagination.limit"?: string;
      "pagination.count_total"?: boolean;
      "pagination.reverse"?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<KeyshareQueryAllKeyShareResponse, RpcStatus>({
      path: `/fairyring/keyshare/key_share`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryKeyShare
   * @summary Queries a KeyShare by index.
   * @request GET:/fairyring/keyshare/key_share/{validator}/{blockHeight}
   */
  queryKeyShare = (validator: string, blockHeight: string, params: RequestParams = {}) =>
    this.request<KeyshareQueryGetKeyShareResponse, RpcStatus>({
      path: `/fairyring/keyshare/key_share/${validator}/${blockHeight}`,
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
   * @request GET:/fairyring/keyshare/params
   */
  queryParams = (params: RequestParams = {}) =>
    this.request<KeyshareQueryParamsResponse, RpcStatus>({
      path: `/fairyring/keyshare/params`,
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
   * @request GET:/fairyring/keyshare/pub_key
   */
  queryPubKey = (params: RequestParams = {}) =>
    this.request<KeyshareQueryPubKeyResponse, RpcStatus>({
      path: `/fairyring/keyshare/pub_key`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryValidatorSetAll
   * @summary Queries a list of ValidatorSet items.
   * @request GET:/fairyring/keyshare/validator_set
   */
  queryValidatorSetAll = (
    query?: {
      "pagination.key"?: string;
      "pagination.offset"?: string;
      "pagination.limit"?: string;
      "pagination.count_total"?: boolean;
      "pagination.reverse"?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<KeyshareQueryAllValidatorSetResponse, RpcStatus>({
      path: `/fairyring/keyshare/validator_set`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryValidatorSet
   * @summary Queries a ValidatorSet by index.
   * @request GET:/fairyring/keyshare/validator_set/{index}
   */
  queryValidatorSet = (index: string, params: RequestParams = {}) =>
    this.request<KeyshareQueryGetValidatorSetResponse, RpcStatus>({
      path: `/fairyring/keyshare/validator_set/${index}`,
      method: "GET",
      format: "json",
      ...params,
    });
}
