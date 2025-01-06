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

export interface ActivePubkey {
  public_key?: string;
  creator?: string;

  /** @format uint64 */
  expiry?: string;

  /** @format uint64 */
  number_of_validators?: string;
  encrypted_keyshares?: { data?: string; validator?: string }[];
}

export interface EncryptedKeyshare {
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

export interface QueryAuthorizedAddressAllResponse {
  authorized_address?: { target?: string; is_authorized?: boolean; authorized_by?: string }[];
  pagination?: { next_key?: string; total?: string };
}

export interface QueryAuthorizedAddressResponse {
  authorized_address?: { target?: string; is_authorized?: boolean; authorized_by?: string };
}

export interface QueryCommitmentsResponse {
  active_commitments?: { commitments?: string[] };
  queued_commitments?: { commitments?: string[] };
}

export interface QueryDecryptionKeyAllResponse {
  decryption_keys?: { height?: string; data?: string }[];
  pagination?: { next_key?: string; total?: string };
}

export interface QueryDecryptionKeyResponse {
  decryption_key?: { height?: string; data?: string };
}

export interface QueryGeneralKeyshareAllResponse {
  general_keyshare?: {
    validator?: string;
    id_type?: string;
    id_value?: string;
    keyshare?: string;
    keyshare_index?: string;
    received_timestamp?: string;
    received_block_height?: string;
  }[];
  pagination?: { next_key?: string; total?: string };
}

export interface QueryGeneralKeyshareResponse {
  general_keyshare?: {
    validator?: string;
    id_type?: string;
    id_value?: string;
    keyshare?: string;
    keyshare_index?: string;
    received_timestamp?: string;
    received_block_height?: string;
  };
}

export interface QueryKeyshareAllResponse {
  keyshare?: {
    validator?: string;
    block_height?: string;
    keyshare?: string;
    keyshare_index?: string;
    received_timestamp?: string;
    received_block_height?: string;
  }[];
  pagination?: { next_key?: string; total?: string };
}

export interface QueryKeyshareResponse {
  keyshare?: {
    validator?: string;
    block_height?: string;
    keyshare?: string;
    keyshare_index?: string;
    received_timestamp?: string;
    received_block_height?: string;
  };
}

export interface QueryParamsResponse {
  params?: {
    key_expiry?: string;
    minimum_bonded?: string;
    max_idled_block?: string;
    trusted_addresses?: string[];
    slash_fraction_no_keyshare?: string;
    slash_fraction_wrong_keyshare?: string;
    avg_block_time?: number;
  };
}

export interface QueryPubkeyResponse {
  active_pubkey?: {
    public_key?: string;
    creator?: string;
    expiry?: string;
    number_of_validators?: string;
    encrypted_keyshares?: { data?: string; validator?: string }[];
  };
  queued_pubkey?: {
    public_key?: string;
    creator?: string;
    expiry?: string;
    number_of_validators?: string;
    encrypted_keyshares?: { data?: string; validator?: string }[];
  };
}

export interface QueryValidatorSetAllResponse {
  validator_set?: { index?: string; validator?: string; cons_addr?: string; is_active?: boolean }[];
  pagination?: { next_key?: string; total?: string };
}

export interface QueryValidatorSetResponse {
  validator_set?: { index?: string; validator?: string; cons_addr?: string; is_active?: boolean };
}

export interface QueryVerifiableRandomnessResponse {
  randomness?: string;

  /** @format uint64 */
  round?: string;
}

export interface QueuedPubkey {
  public_key?: string;
  creator?: string;

  /** @format uint64 */
  expiry?: string;

  /** @format uint64 */
  number_of_validators?: string;
  encrypted_keyshares?: { data?: string; validator?: string }[];
}

export interface KeyshareAuthorizedAddress {
  target?: string;
  is_authorized?: boolean;
  authorized_by?: string;
}

export interface KeyshareCommitments {
  commitments?: string[];
}

export interface KeyshareDecryptionKey {
  /** @format uint64 */
  height?: string;
  data?: string;
}

export interface KeyshareGeneralKeyshare {
  validator?: string;
  id_type?: string;
  id_value?: string;
  keyshare?: string;

  /** @format uint64 */
  keyshare_index?: string;

  /** @format uint64 */
  received_timestamp?: string;

  /** @format uint64 */
  received_block_height?: string;
}

export interface KeyshareKeyshare {
  validator?: string;

  /** @format uint64 */
  block_height?: string;
  keyshare?: string;

  /** @format uint64 */
  keyshare_index?: string;

  /** @format uint64 */
  received_timestamp?: string;

  /** @format uint64 */
  received_block_height?: string;
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

  /** @format float */
  avg_block_time?: number;
}

export interface KeyshareValidatorSet {
  index?: string;
  validator?: string;
  cons_addr?: string;
  is_active?: boolean;
}

export type MsgCreateAuthorizedAddressResponse = object;

export type MsgCreateLatestPubkeyResponse = object;

export interface MsgDeRegisterValidatorResponse {
  creator?: string;
}

export type MsgDeleteAuthorizedAddressResponse = object;

export type MsgOverrideLatestPubkeyResponse = object;

export interface MsgRegisterValidatorResponse {
  creator?: string;
}

export interface MsgSendKeyshareResponse {
  creator?: string;
  keyshare?: string;

  /** @format uint64 */
  keyshare_index?: string;

  /** @format uint64 */
  block_height?: string;

  /** @format uint64 */
  received_block_height?: string;
  success?: boolean;
  error_message?: string;
}

export type MsgSubmitEncryptedKeyshareResponse = object;

export interface MsgSubmitGeneralKeyshareResponse {
  creator?: string;
  id_type?: string;
  id_value?: string;
  keyshare?: string;

  /** @format uint64 */
  keyshare_index?: string;

  /** @format uint64 */
  received_block_height?: string;
  success?: boolean;
  error_message?: string;
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

  /** @format float */
  avg_block_time?: number;
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
        authorized_address?: { target?: string; is_authorized?: boolean; authorized_by?: string }[];
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
      { authorized_address?: { target?: string; is_authorized?: boolean; authorized_by?: string } },
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
      { active_commitments?: { commitments?: string[] }; queued_commitments?: { commitments?: string[] } },
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
   * @name QueryDecryptionKeyAll
   * @request GET:/fairyring/keyshare/decryption_key
   */
  queryDecryptionKeyAll = (
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
      { decryption_keys?: { height?: string; data?: string }[]; pagination?: { next_key?: string; total?: string } },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/decryption_key`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryDecryptionKey
   * @request GET:/fairyring/keyshare/decryption_key/{height}
   */
  queryDecryptionKey = (height: string, params: RequestParams = {}) =>
    this.request<
      { decryption_key?: { height?: string; data?: string } },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/decryption_key/${height}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryGeneralKeyshareAll
   * @request GET:/fairyring/keyshare/general_keyshare
   */
  queryGeneralKeyshareAll = (
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
        general_keyshare?: {
          validator?: string;
          id_type?: string;
          id_value?: string;
          keyshare?: string;
          keyshare_index?: string;
          received_timestamp?: string;
          received_block_height?: string;
        }[];
        pagination?: { next_key?: string; total?: string };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/general_keyshare`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryGeneralKeyshare
   * @request GET:/fairyring/keyshare/general_keyshare/{validator}/{id_type}/{id_value}
   */
  queryGeneralKeyshare = (validator: string, idType: string, idValue: string, params: RequestParams = {}) =>
    this.request<
      {
        general_keyshare?: {
          validator?: string;
          id_type?: string;
          id_value?: string;
          keyshare?: string;
          keyshare_index?: string;
          received_timestamp?: string;
          received_block_height?: string;
        };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/general_keyshare/${validator}/${idType}/${idValue}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryKeyshareAll
   * @request GET:/fairyring/keyshare/keyshare
   */
  queryKeyshareAll = (
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
        keyshare?: {
          validator?: string;
          block_height?: string;
          keyshare?: string;
          keyshare_index?: string;
          received_timestamp?: string;
          received_block_height?: string;
        }[];
        pagination?: { next_key?: string; total?: string };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/keyshare`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryKeyshare
   * @request GET:/fairyring/keyshare/keyshare/{validator}/{block_height}
   */
  queryKeyshare = (validator: string, blockHeight: string, params: RequestParams = {}) =>
    this.request<
      {
        keyshare?: {
          validator?: string;
          block_height?: string;
          keyshare?: string;
          keyshare_index?: string;
          received_timestamp?: string;
          received_block_height?: string;
        };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/keyshare/${validator}/${blockHeight}`,
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
          avg_block_time?: number;
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
   * @name QueryPubkey
   * @request GET:/fairyring/keyshare/pubkey
   */
  queryPubkey = (params: RequestParams = {}) =>
    this.request<
      {
        active_pubkey?: {
          public_key?: string;
          creator?: string;
          expiry?: string;
          number_of_validators?: string;
          encrypted_keyshares?: { data?: string; validator?: string }[];
        };
        queued_pubkey?: {
          public_key?: string;
          creator?: string;
          expiry?: string;
          number_of_validators?: string;
          encrypted_keyshares?: { data?: string; validator?: string }[];
        };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/keyshare/pubkey`,
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
        validator_set?: { index?: string; validator?: string; cons_addr?: string; is_active?: boolean }[];
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
      { validator_set?: { index?: string; validator?: string; cons_addr?: string; is_active?: boolean } },
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
