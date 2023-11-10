import { Inject, Injectable } from '@nestjs/common';
import { KeycloakModuleOptions } from './keycloak.module-options';
import { MODULE_OPTIONS_TOKEN } from './keycloak.module-definition';
import { Client, Issuer } from 'openid-client';

@Injectable()
export class KeycloakService {
  client: Client;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: KeycloakModuleOptions,
  ) {
    const issuerUrl = `${options.auth_base_url}/realms/${options.realm}`;
    const issuer = `${issuerUrl}/.well-known/openid-configuration`;
    Issuer.discover(issuer).then((issuer) => {
      this.client = new issuer.Client({
        client_id: options.client_id,
        client_secret: options.client_secret,
        redirect_uris: options.redirect_uris,
        response_types: options.response_types,
        scope: options.scope,
        default_max_age: options.default_max_age,
      });
    });
  }

  async getAuthorizationUrl() {
    return this.client.authorizationUrl({
      scope: this.options.scope,
    });
  }

  async getProfile(token: string) {
    return await this.client.userinfo(token);
  }

  async callback(code: string, grant_type: string = 'authorization_code') {
    const redirect_uri = this.options.redirect_uris[0];
    return await this.client.callback(redirect_uri, {
      code: code,
      grant_type: grant_type,
    });
  }

  async getClient(): Promise<Client> {
    return this.client;
  }

  async getRealmBaseUrl(): Promise<string> {
    return this.options.auth_base_url;
  }

  async getClientId(): Promise<string> {
    return this.options.client_id;
  }

  async getClientSecret(): Promise<string> {
    return this.options.client_secret;
  }

  async getRedirectUris(): Promise<string[]> {
    return this.options.redirect_uris;
  }

  async getResponseTypes(): Promise<string[]> {
    return this.options.response_types;
  }

  async getScope(): Promise<string> {
    return this.options.scope;
  }

  async getDefaultMaxAge(): Promise<number> {
    return this.options.default_max_age;
  }

  async getRealm(): Promise<string> {
    return this.options.realm;
  }
}
