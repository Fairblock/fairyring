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
}

export interface Coin {
  denom?: string;
  amount?: string;
}

export interface EncryptedTx {
  /** @format uint64 */
  targetHeight?: string;

  /** @format uint64 */
  index?: string;
  data?: string;
  creator?: string;
  chargedGas?: { denom?: string; amount?: string };

  /** @format uint64 */
  processedAtChainHeight?: string;
  expired?: boolean;
}

export interface EncryptedTxArray {
  encryptedTx?: {
    targetHeight?: string;
    index?: string;
    data?: string;
    creator?: string;
    chargedGas?: { denom?: string; amount?: string };
    processedAtChainHeight?: string;
    expired?: boolean;
  }[];
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

export interface Params {
  trusted_counter_parties?: { client_id?: string; connection_id?: string; channel_id?: string }[];
  trusted_addresses?: string[];
  pep_channel_id?: string;
  keyshare_channel_id?: string;
  min_gas_price?: { denom?: string; amount?: string };
  is_source_chain?: boolean;
}

export interface PepNonce {
  address?: string;

  /** @format uint64 */
  nonce?: string;
}

export interface QueryAllEncryptedTxFromHeightResponse {
  encryptedTxArray?: {
    encryptedTx?: {
      targetHeight?: string;
      index?: string;
      data?: string;
      creator?: string;
      chargedGas?: { denom?: string; amount?: string };
      processedAtChainHeight?: string;
      expired?: boolean;
    }[];
  };
}

export interface QueryAllEncryptedTxResponse {
  encryptedTxArray?: {
    encryptedTx?: {
      targetHeight?: string;
      index?: string;
      data?: string;
      creator?: string;
      chargedGas?: { denom?: string; amount?: string };
      processedAtChainHeight?: string;
      expired?: boolean;
    }[];
  }[];
  pagination?: { next_key?: string; total?: string };
}

export interface QueryAllPepNonceResponse {
  pepNonce?: { address?: string; nonce?: string }[];
  pagination?: { next_key?: string; total?: string };
}

export interface QueryGetEncryptedTxResponse {
  encryptedTx?: {
    targetHeight?: string;
    index?: string;
    data?: string;
    creator?: string;
    chargedGas?: { denom?: string; amount?: string };
    processedAtChainHeight?: string;
    expired?: boolean;
  };
}

export interface QueryGetPepNonceResponse {
  pepNonce?: { address?: string; nonce?: string };
}

export interface QueryLatestHeightResponse {
  /** @format uint64 */
  height?: string;
}

export interface QueryParamsResponse {
  params?: {
    trusted_counter_parties?: { client_id?: string; connection_id?: string; channel_id?: string }[];
    trusted_addresses?: string[];
    pep_channel_id?: string;
    keyshare_channel_id?: string;
    min_gas_price?: { denom?: string; amount?: string };
    is_source_chain?: boolean;
  };
}

export interface QueryPubKeyResponse {
  activePubKey?: { publicKey?: string; creator?: string; expiry?: string };
  queuedPubKey?: { publicKey?: string; creator?: string; expiry?: string };
}

export interface QueuedPubKey {
  publicKey?: string;
  creator?: string;

  /** @format uint64 */
  expiry?: string;
}

export interface TrustedCounterParty {
  client_id?: string;
  connection_id?: string;
  channel_id?: string;
}

export type MsgCreateAggregatedKeyShareResponse = object;

export type MsgGetGeneralKeyshareResponse = object;

export interface MsgRequestGeneralKeyshareResponse {
  identity?: string;
  pubkey?: string;
}

export type MsgSubmitEncryptedTxResponse = object;

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
 * @title HTTP API Console fairyring.pep
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Query
   * @name QueryEncryptedTxAll
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
    this.request<
      {
        encryptedTxArray?: {
          encryptedTx?: {
            targetHeight?: string;
            index?: string;
            data?: string;
            creator?: string;
            chargedGas?: { denom?: string; amount?: string };
            processedAtChainHeight?: string;
            expired?: boolean;
          }[];
        }[];
        pagination?: { next_key?: string; total?: string };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/pep/encrypted_tx`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryEncryptedTxAllFromHeight
   * @request GET:/fairyring/pep/encrypted_tx/{targetHeight}
   */
  queryEncryptedTxAllFromHeight = (targetHeight: string, params: RequestParams = {}) =>
    this.request<
      {
        encryptedTxArray?: {
          encryptedTx?: {
            targetHeight?: string;
            index?: string;
            data?: string;
            creator?: string;
            chargedGas?: { denom?: string; amount?: string };
            processedAtChainHeight?: string;
            expired?: boolean;
          }[];
        };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/pep/encrypted_tx/${targetHeight}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryEncryptedTx
   * @request GET:/fairyring/pep/encrypted_tx/{targetHeight}/{index}
   */
  queryEncryptedTx = (targetHeight: string, index: string, params: RequestParams = {}) =>
    this.request<
      {
        encryptedTx?: {
          targetHeight?: string;
          index?: string;
          data?: string;
          creator?: string;
          chargedGas?: { denom?: string; amount?: string };
          processedAtChainHeight?: string;
          expired?: boolean;
        };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/pep/encrypted_tx/${targetHeight}/${index}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryLatestHeight
   * @request GET:/fairyring/pep/latest_height
   */
  queryLatestHeight = (params: RequestParams = {}) =>
    this.request<{ height?: string }, { code?: number; message?: string; details?: { "@type"?: string }[] }>({
      path: `/fairyring/pep/latest_height`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryParams
   * @request GET:/fairyring/pep/params
   */
  queryParams = (params: RequestParams = {}) =>
    this.request<
      {
        params?: {
          trusted_counter_parties?: { client_id?: string; connection_id?: string; channel_id?: string }[];
          trusted_addresses?: string[];
          pep_channel_id?: string;
          keyshare_channel_id?: string;
          min_gas_price?: { denom?: string; amount?: string };
          is_source_chain?: boolean;
        };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/pep/params`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryPepNonceAll
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
    this.request<
      { pepNonce?: { address?: string; nonce?: string }[]; pagination?: { next_key?: string; total?: string } },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/pep/pep_nonce`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryPepNonce
   * @request GET:/fairyring/pep/pep_nonce/{address}
   */
  queryPepNonce = (address: string, params: RequestParams = {}) =>
    this.request<
      { pepNonce?: { address?: string; nonce?: string } },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/pep/pep_nonce/${address}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryPubKey
   * @request GET:/fairyring/pep/pub_key
   */
  queryPubKey = (params: RequestParams = {}) =>
    this.request<
      {
        activePubKey?: { publicKey?: string; creator?: string; expiry?: string };
        queuedPubKey?: { publicKey?: string; creator?: string; expiry?: string };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/pep/pub_key`,
      method: "GET",
      ...params,
    });
}
