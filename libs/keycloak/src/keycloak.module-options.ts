export type ResponseType =
  | 'code'
  | 'id_token'
  | 'code id_token'
  | 'none'
  | string;

export type ClientAuthMethod =
  | 'client_secret_basic'
  | 'client_secret_post'
  | 'client_secret_jwt'
  | 'private_key_jwt'
  | 'tls_client_auth'
  | 'self_signed_tls_client_auth'
  | 'none';

export interface KeycloakModuleOptions {
  auth_base_url: string;
  realm: string;
  client_id: string;
  client_secret: string;
  redirect_uris: string[];
  response_types: ResponseType[];
  scope?: string;
  post_logout_redirect_uris?: string[];
  default_max_age?: number;
  require_auth_time?: boolean;
  tls_client_certificate_bound_access_tokens?: boolean;
  request_object_signing_alg?: string;
  id_token_signed_response_alg?: string;
  token_endpoint_auth_method?: ClientAuthMethod;

  [key: string]: unknown;
}
