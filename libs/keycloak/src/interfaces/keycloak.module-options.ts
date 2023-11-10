export type ResponseType =
  | 'code'
  | 'id_token'
  | 'code id_token'
  | 'none'
  | string;

export interface KeycloakModuleOptions {
  auth_base_url?: string;
  realm?: string;
  client_id?: string;
  client_secret?: string;
  redirect_uris?: string[];
  response_types?: ResponseType[];
  scope?: string;
}
