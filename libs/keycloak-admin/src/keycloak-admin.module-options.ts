export interface KeycloakAdminModuleOptions {
  realmName: string;
  baseUrl: string;
  username: string;
  password: string;
  clientId?: string | 'admin-cli';
  grantType?: 'client_credentials' | 'password' | 'refresh_token';
}
