import { Inject, Injectable } from '@nestjs/common';
import { KeycloakClientModuleOptions } from './keycloak-client.module-options';
import { MODULE_OPTIONS_TOKEN } from './keycloak-client.module-definition';
import { Client, Issuer } from 'openid-client';

@Injectable()
export class KeycloakClientService {
  private _client: Client;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: KeycloakClientModuleOptions,
  ) {
    const issuerUrl = `${options.auth_base_url}/realms/${options.realm}`;
    const issuer = `${issuerUrl}/.well-known/openid-configuration`;
    Issuer.discover(issuer).then((issuer) => {
      this._client = new issuer.Client({
        client_id: options.client_id,
        client_secret: options.client_secret,
        redirect_uris: options.redirect_uris,
        response_types: options.response_types,
        scope: options.scope,
        default_max_age: options.default_max_age,
      });
    });
  }

  get client(): Client {
    return this._client;
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
}
