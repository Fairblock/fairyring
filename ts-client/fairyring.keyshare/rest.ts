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

export interface Any {
  "@type"?: string;
}

export interface Status {
  /** @format int32 */
  code?: number;
  message?: string;
  details?: { "@type"?: string }[];
}

export interface ActivePubKey {
  publicKey?: string;
  creator?: string;

  /** @format uint64 */
  expiry?: string;

  /** @format uint64 */
  numberOfValidators?: string;
  encryptedKeyShares?: { data?: string; validator?: string }[];
}

export interface EncryptedKeyShare {
  data?: string;
  validator?: string;
}

export interface PageRequest {
  /** @format byte */
  key?: string;

  /** @format uint64 */
  offset?: string;

  /** @format uint64 */
  limit?: string;
  count_total?: boolean;
  reverse?: boolean;
}

export interface PageResponse {
  /** @format byte */
  next_key?: string;

  /** @format uint64 */
  total?: string;
}

export interface QueryAllAggregatedKeyShareResponse {
  aggregatedKeyShare?: { height?: string; data?: string }[];
  pagination?: { next_key?: string; total?: string };
}

export interface QueryAllAuthorizedAddressResponse {
  authorizedAddress?: { target?: string; isAuthorized?: boolean; authorizedBy?: string }[];
  pagination?: { next_key?: string; total?: string };
}

export interface QueryAllGeneralKeyShareResponse {
  generalKeyShare?: {
    validator?: string;
    idType?: string;
    idValue?: string;
    keyShare?: string;
    keyShareIndex?: string;
    receivedTimestamp?: string;
    receivedBlockHeight?: string;
  }[];
  pagination?: { next_key?: string; total?: string };
}

export interface QueryAllKeyShareResponse {
  keyShare?: {
    validator?: string;
    blockHeight?: string;
    keyShare?: string;
    keyShareIndex?: string;
    receivedTimestamp?: string;
    receivedBlockHeight?: string;
  }[];
  pagination?: { next_key?: string; total?: string };
}

export interface QueryAllValidatorSetResponse {
  validatorSet?: { index?: string; validator?: string; consAddr?: string; isActive?: boolean }[];
  pagination?: { next_key?: string; total?: string };
}

export interface QueryCommitmentsResponse {
  activeCommitments?: { commitments?: string[] };
  queuedCommitments?: { commitments?: string[] };
}

export interface QueryGetAggregatedKeyShareResponse {
  aggregatedKeyShare?: { height?: string; data?: string };
}

export interface QueryGetAuthorizedAddressResponse {
  authorizedAddress?: { target?: string; isAuthorized?: boolean; authorizedBy?: string };
}

export interface QueryGetGeneralKeyShareResponse {
  generalKeyShare?: {
    validator?: string;
    idType?: string;
    idValue?: string;
    keyShare?: string;
    keyShareIndex?: string;
    receivedTimestamp?: string;
    receivedBlockHeight?: string;
  };
}

export interface QueryGetKeyShareResponse {
  keyShare?: {
    validator?: string;
    blockHeight?: string;
    keyShare?: string;
    keyShareIndex?: string;
    receivedTimestamp?: string;
    receivedBlockHeight?: string;
  };
}

export interface QueryGetValidatorSetResponse {
  validatorSet?: { index?: string; validator?: string; consAddr?: string; isActive?: boolean };
}

export interface QueryParamsResponse {
  params?: {
    key_expiry?: string;
    minimum_bonded?: string;
    max_idled_block?: string;
    trusted_addresses?: string[];
    slash_fraction_no_keyshare?: string;
    slash_fraction_wrong_keyshare?: string;
  };
}

export interface QueryPubKeyResponse {
  activePubKey?: {
    publicKey?: string;
    creator?: string;
    expiry?: string;
    numberOfValidators?: string;
    encryptedKeyShares?: { data?: string; validator?: string }[];
  };
  queuedPubKey?: {
    publicKey?: string;
    creator?: string;
    expiry?: string;
    numberOfValidators?: string;
    encryptedKeyShares?: { data?: string; validator?: string }[];
  };
}

export interface QueryVerifiableRandomnessResponse {
  randomness?: string;

  /** @format uint64 */
  round?: string;
}

export interface QueuedPubKey {
  publicKey?: string;
  creator?: string;

  /** @format uint64 */
  expiry?: string;

  /** @format uint64 */
  numberOfValidators?: string;
  encryptedKeyShares?: { data?: string; validator?: string }[];
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

export interface KeyshareParams {
  /** @format uint64 */
  key_expiry?: string;

  /** @format uint64 */
  minimum_bonded?: string;

  /** @format uint64 */
  max_idled_block?: string;
  trusted_addresses?: string[];

  /** @format byte */
  slash_fraction_no_keyshare?: string;

  /** @format byte */
  slash_fraction_wrong_keyshare?: string;
}

export interface KeyshareValidatorSet {
  index?: string;
  validator?: string;
  consAddr?: string;
  isActive?: boolean;
}

export type MsgCreateAuthorizedAddressResponse = object;

export interface MsgCreateGeneralKeyShareResponse {
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

export type MsgCreateLatestPubKeyResponse = object;

export interface MsgDeRegisterValidatorResponse {
  creator?: string;
}

export type MsgDeleteAuthorizedAddressResponse = object;

export type MsgOverrideLatestPubKeyResponse = object;

export interface MsgRegisterValidatorResponse {
  creator?: string;
}

export interface MsgSendKeyshareResponse {
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

export type MsgUpdateAuthorizedAddressResponse = object;

export type MsgUpdateParamsResponse = object;

export interface Params {
  /** @format uint64 */
  key_expiry?: string;

  /** @format uint64 */
  minimum_bonded?: string;

  /** @format uint64 */
  max_idled_block?: string;
  trusted_addresses?: string[];

  /** @format byte */
  slash_fraction_no_keyshare?: string;

  /** @format byte */
  slash_fraction_wrong_keyshare?: string;
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
 * @title HTTP API Console fairyring.keyshare
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
    this.request<
      { aggregatedKeyShare?: { height?: string; data?: string }[]; pagination?: { next_key?: string; total?: string } },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/aggregated_key_share`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryAggregatedKeyShare
   * @request GET:/fairyring/keyshare/aggregated_key_share/{height}
   */
  queryAggregatedKeyShare = (height: string, params: RequestParams = {}) =>
    this.request<
      { aggregatedKeyShare?: { height?: string; data?: string } },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/aggregated_key_share/${height}`,
      method: "GET",
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
    this.request<
      {
        authorizedAddress?: { target?: string; isAuthorized?: boolean; authorizedBy?: string }[];
        pagination?: { next_key?: string; total?: string };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/authorized_address`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryAuthorizedAddress
   * @request GET:/fairyring/keyshare/authorized_address/{target}
   */
  queryAuthorizedAddress = (target: string, params: RequestParams = {}) =>
    this.request<
      { authorizedAddress?: { target?: string; isAuthorized?: boolean; authorizedBy?: string } },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/authorized_address/${target}`,
      method: "GET",
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
    this.request<
      { activeCommitments?: { commitments?: string[] }; queuedCommitments?: { commitments?: string[] } },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/commitments`,
      method: "GET",
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
    this.request<
      {
        generalKeyShare?: {
          validator?: string;
          idType?: string;
          idValue?: string;
          keyShare?: string;
          keyShareIndex?: string;
          receivedTimestamp?: string;
          receivedBlockHeight?: string;
        }[];
        pagination?: { next_key?: string; total?: string };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/general_key_share`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryGeneralKeyShare
   * @request GET:/fairyring/keyshare/general_key_share/{validator}/{idType}/{idValue}
   */
  queryGeneralKeyShare = (validator: string, idType: string, idValue: string, params: RequestParams = {}) =>
    this.request<
      {
        generalKeyShare?: {
          validator?: string;
          idType?: string;
          idValue?: string;
          keyShare?: string;
          keyShareIndex?: string;
          receivedTimestamp?: string;
          receivedBlockHeight?: string;
        };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/general_key_share/${validator}/${idType}/${idValue}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryKeyShareAll
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
    this.request<
      {
        keyShare?: {
          validator?: string;
          blockHeight?: string;
          keyShare?: string;
          keyShareIndex?: string;
          receivedTimestamp?: string;
          receivedBlockHeight?: string;
        }[];
        pagination?: { next_key?: string; total?: string };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/key_share`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryKeyShare
   * @request GET:/fairyring/keyshare/key_share/{validator}/{blockHeight}
   */
  queryKeyShare = (validator: string, blockHeight: string, params: RequestParams = {}) =>
    this.request<
      {
        keyShare?: {
          validator?: string;
          blockHeight?: string;
          keyShare?: string;
          keyShareIndex?: string;
          receivedTimestamp?: string;
          receivedBlockHeight?: string;
        };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/key_share/${validator}/${blockHeight}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryParams
   * @request GET:/fairyring/keyshare/params
   */
  queryParams = (params: RequestParams = {}) =>
    this.request<
      {
        params?: {
          key_expiry?: string;
          minimum_bonded?: string;
          max_idled_block?: string;
          trusted_addresses?: string[];
          slash_fraction_no_keyshare?: string;
          slash_fraction_wrong_keyshare?: string;
        };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/params`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryPubKey
   * @request GET:/fairyring/keyshare/pub_key
   */
  queryPubKey = (params: RequestParams = {}) =>
    this.request<
      {
        activePubKey?: {
          publicKey?: string;
          creator?: string;
          expiry?: string;
          numberOfValidators?: string;
          encryptedKeyShares?: { data?: string; validator?: string }[];
        };
        queuedPubKey?: {
          publicKey?: string;
          creator?: string;
          expiry?: string;
          numberOfValidators?: string;
          encryptedKeyShares?: { data?: string; validator?: string }[];
        };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/pub_key`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryValidatorSetAll
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
    this.request<
      {
        validatorSet?: { index?: string; validator?: string; consAddr?: string; isActive?: boolean }[];
        pagination?: { next_key?: string; total?: string };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/validator_set`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryValidatorSet
   * @request GET:/fairyring/keyshare/validator_set/{index}
   */
  queryValidatorSet = (index: string, params: RequestParams = {}) =>
    this.request<
      { validatorSet?: { index?: string; validator?: string; consAddr?: string; isActive?: boolean } },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/validator_set/${index}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryVerifiableRandomness
   * @request GET:/fairyring/keyshare/verifiable_randomness
   */
  queryVerifiableRandomness = (params: RequestParams = {}) =>
    this.request<
      { randomness?: string; round?: string },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/verifiable_randomness`,
      method: "GET",
      ...params,
    });
}
