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

export interface ActivePublicKey {
  public_key?: string;
  creator?: string;

  /** @format uint64 */
  expiry?: string;
}

export interface Coin {
  denom?: string;
  amount?: string;
}

export interface EncryptedTxArray {
  encrypted_txs?: {
    target_height?: string;
    index?: string;
    data?: string;
    creator?: string;
    charged_gas?: { denom?: string; amount?: string };
    processed_at_chain_height?: string;
    expired?: boolean;
  }[];
}

export interface GeneralEncryptedTx {
  identity?: string;

  /** @format uint64 */
  index?: string;
  data?: string;
  creator?: string;
  charged_gas?: { denom?: string; amount?: string };
}

export interface GeneralEncryptedTxArray {
  encrypted_txs?: {
    identity?: string;
    index?: string;
    data?: string;
    creator?: string;
    charged_gas?: { denom?: string; amount?: string };
  }[];
}

export interface IdentityExecutionEntry {
  creator?: string;
  identity?: string;
  pubkey?: string;
  tx_list?: {
    encrypted_txs?: {
      identity?: string;
      index?: string;
      data?: string;
      creator?: string;
      charged_gas?: { denom?: string; amount?: string };
    }[];
  };
  decryption_key?: string;
}

export interface IndexedEncryptedKeyshare {
  encrypted_keyshare_value?: string;

  /** @format uint64 */
  encrypted_keyshare_index?: string;
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

export interface PrivateDecryptionKey {
  requester?: string;
  private_keyshares?: { encrypted_keyshare_value?: string; encrypted_keyshare_index?: string }[];
}

export interface QueryDecryptDataResponse {
  decrypted_data?: string;
}

export interface QueryEncryptedTxAllFromHeightResponse {
  encrypted_tx_array?: {
    encrypted_txs?: {
      target_height?: string;
      index?: string;
      data?: string;
      creator?: string;
      charged_gas?: { denom?: string; amount?: string };
      processed_at_chain_height?: string;
      expired?: boolean;
    }[];
  };
}

export interface QueryEncryptedTxAllResponse {
  encrypted_tx_array?: {
    encrypted_txs?: {
      target_height?: string;
      index?: string;
      data?: string;
      creator?: string;
      charged_gas?: { denom?: string; amount?: string };
      processed_at_chain_height?: string;
      expired?: boolean;
    }[];
  }[];
  pagination?: { next_key?: string; total?: string };
}

export interface QueryEncryptedTxResponse {
  encrypted_tx?: {
    target_height?: string;
    index?: string;
    data?: string;
    creator?: string;
    charged_gas?: { denom?: string; amount?: string };
    processed_at_chain_height?: string;
    expired?: boolean;
  };
}

export interface QueryGeneralIdentityAllResponse {
  request_details_list?: {
    creator?: string;
    identity?: string;
    pubkey?: string;
    tx_list?: {
      encrypted_txs?: {
        identity?: string;
        index?: string;
        data?: string;
        creator?: string;
        charged_gas?: { denom?: string; amount?: string };
      }[];
    };
    decryption_key?: string;
  }[];
  pagination?: { next_key?: string; total?: string };
}

export interface QueryGeneralIdentityResponse {
  request_details?: {
    creator?: string;
    identity?: string;
    pubkey?: string;
    tx_list?: {
      encrypted_txs?: {
        identity?: string;
        index?: string;
        data?: string;
        creator?: string;
        charged_gas?: { denom?: string; amount?: string };
      }[];
    };
    decryption_key?: string;
  };
}

export interface QueryLatestHeightResponse {
  /** @format uint64 */
  height?: string;
}

export interface QueryParamsResponse {
  params?: {
    keyshare_channel_id?: string;
    is_source_chain?: boolean;
    trusted_counter_parties?: { client_id?: string; connection_id?: string; channel_id?: string }[];
    trusted_addresses?: string[];
    min_gas_price?: { denom?: string; amount?: string };
    private_decryption_key_price?: { denom?: string; amount?: string };
    max_contract_gas?: string;
  };
}

export interface QueryPepNonceAllResponse {
  pep_nonce?: { address?: string; nonce?: string }[];
  pagination?: { next_key?: string; total?: string };
}

export interface QueryPepNonceResponse {
  pep_nonce?: { address?: string; nonce?: string };
}

export interface QueryPrivateIdentityResponse {
  creator?: string;
  identity?: string;
  pubkey?: string;
  private_decryption_keys?: {
    requester?: string;
    private_keyshares?: { encrypted_keyshare_value?: string; encrypted_keyshare_index?: string }[];
  }[];
}

export interface QueryPubkeyResponse {
  active_pubkey?: { public_key?: string; creator?: string; expiry?: string };
  queued_pubkey?: { public_key?: string; creator?: string; expiry?: string };
}

export interface QueuedPublicKey {
  public_key?: string;
  creator?: string;

  /** @format uint64 */
  expiry?: string;
}

export interface TrustedCounterParty {
  client_id?: string;
  connection_id?: string;
  channel_id?: string;
}

export interface PepEncryptedTx {
  /** @format uint64 */
  target_height?: string;

  /** @format uint64 */
  index?: string;
  data?: string;
  creator?: string;
  charged_gas?: { denom?: string; amount?: string };

  /** @format uint64 */
  processed_at_chain_height?: string;
  expired?: boolean;
}

export interface PepParams {
  keyshare_channel_id?: string;
  is_source_chain?: boolean;
  trusted_counter_parties?: { client_id?: string; connection_id?: string; channel_id?: string }[];
  trusted_addresses?: string[];
  min_gas_price?: { denom?: string; amount?: string };
  private_decryption_key_price?: { denom?: string; amount?: string };

  /** @format uint64 */
  max_contract_gas?: string;
}

export interface PepPepNonce {
  address?: string;

  /** @format uint64 */
  nonce?: string;
}

export type MsgRegisterContractResponse = object;

export type MsgRequestGeneralDecryptionKeyResponse = object;

export interface MsgRequestGeneralIdentityResponse {
  identity?: string;
}

export type MsgRequestPrivateDecryptionKeyResponse = object;

export interface MsgRequestPrivateIdentityResponse {
  identity?: string;
}

export type MsgSubmitDecryptionKeyResponse = object;

export type MsgSubmitEncryptedTxResponse = object;

export type MsgSubmitGeneralEncryptedTxResponse = object;

export type MsgUnregisterContractResponse = object;

export type MsgUpdateParamsResponse = object;

export interface Params {
  keyshare_channel_id?: string;
  is_source_chain?: boolean;
  trusted_counter_parties?: { client_id?: string; connection_id?: string; channel_id?: string }[];
  trusted_addresses?: string[];
  min_gas_price?: { denom?: string; amount?: string };
  private_decryption_key_price?: { denom?: string; amount?: string };

  /** @format uint64 */
  max_contract_gas?: string;
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
 * @title HTTP API Console fairyring.pep
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Query
   * @name QueryDecryptData
   * @request GET:/Fairblock/fairyring/pep/decrypt_data/{pubkey}/{decryption_key}/{encrypted_data}
   */
  queryDecryptData = (pubkey: string, decryptionKey: string, encryptedData: string, params: RequestParams = {}) =>
    this.request<{ decrypted_data?: string }, { code?: number; message?: string; details?: { "@type"?: string }[] }>({
      path: `/Fairblock/fairyring/pep/decrypt_data/${pubkey}/${decryptionKey}/${encryptedData}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryPrivateIdentity
   * @request GET:/Fairblock/fairyring/pep/private_identity/{identity}
   */
  queryPrivateIdentity = (identity: string, params: RequestParams = {}) =>
    this.request<
      {
        creator?: string;
        identity?: string;
        pubkey?: string;
        private_decryption_keys?: {
          requester?: string;
          private_keyshares?: { encrypted_keyshare_value?: string; encrypted_keyshare_index?: string }[];
        }[];
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/Fairblock/fairyring/pep/private_identity/${identity}`,
      method: "GET",
      ...params,
    });

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
        encrypted_tx_array?: {
          encrypted_txs?: {
            target_height?: string;
            index?: string;
            data?: string;
            creator?: string;
            charged_gas?: { denom?: string; amount?: string };
            processed_at_chain_height?: string;
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
   * @request GET:/fairyring/pep/encrypted_tx/{target_height}
   */
  queryEncryptedTxAllFromHeight = (targetHeight: string, params: RequestParams = {}) =>
    this.request<
      {
        encrypted_tx_array?: {
          encrypted_txs?: {
            target_height?: string;
            index?: string;
            data?: string;
            creator?: string;
            charged_gas?: { denom?: string; amount?: string };
            processed_at_chain_height?: string;
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
   * @request GET:/fairyring/pep/encrypted_tx/{target_height}/{index}
   */
  queryEncryptedTx = (targetHeight: string, index: string, params: RequestParams = {}) =>
    this.request<
      {
        encrypted_tx?: {
          target_height?: string;
          index?: string;
          data?: string;
          creator?: string;
          charged_gas?: { denom?: string; amount?: string };
          processed_at_chain_height?: string;
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
   * @name QueryGeneralIdentityAll
   * @request GET:/fairyring/pep/general_identity
   */
  queryGeneralIdentityAll = (
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
        request_details_list?: {
          creator?: string;
          identity?: string;
          pubkey?: string;
          tx_list?: {
            encrypted_txs?: {
              identity?: string;
              index?: string;
              data?: string;
              creator?: string;
              charged_gas?: { denom?: string; amount?: string };
            }[];
          };
          decryption_key?: string;
        }[];
        pagination?: { next_key?: string; total?: string };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/pep/general_identity`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryGeneralIdentity
   * @request GET:/fairyring/pep/general_identity/{identity}
   */
  queryGeneralIdentity = (identity: string, params: RequestParams = {}) =>
    this.request<
      {
        request_details?: {
          creator?: string;
          identity?: string;
          pubkey?: string;
          tx_list?: {
            encrypted_txs?: {
              identity?: string;
              index?: string;
              data?: string;
              creator?: string;
              charged_gas?: { denom?: string; amount?: string };
            }[];
          };
          decryption_key?: string;
        };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/pep/general_identity/${identity}`,
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
          keyshare_channel_id?: string;
          is_source_chain?: boolean;
          trusted_counter_parties?: { client_id?: string; connection_id?: string; channel_id?: string }[];
          trusted_addresses?: string[];
          min_gas_price?: { denom?: string; amount?: string };
          private_decryption_key_price?: { denom?: string; amount?: string };
          max_contract_gas?: string;
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
      { pep_nonce?: { address?: string; nonce?: string }[]; pagination?: { next_key?: string; total?: string } },
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
      { pep_nonce?: { address?: string; nonce?: string } },
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
   * @name QueryPubkey
   * @request GET:/fairyring/pep/pubkey
   */
  queryPubkey = (params: RequestParams = {}) =>
    this.request<
      {
        active_pubkey?: { public_key?: string; creator?: string; expiry?: string };
        queued_pubkey?: { public_key?: string; creator?: string; expiry?: string };
      },
      { code?: number; message?: string; details?: { "@type"?: string }[] }
    >({
      path: `/fairyring/pep/pubkey`,
      method: "GET",
      ...params,
    });
}
