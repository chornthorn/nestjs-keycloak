import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from './keycloak-authn.module-definition';
import { KeycloakAuthnModuleOptions } from './keycloak-authn.module-options';
import { HttpService } from '@nestjs/axios';
import { catchError, map, Observable } from 'rxjs';

@Injectable()
export class KeycloakAuthnService {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly _options: KeycloakAuthnModuleOptions,
    private readonly httpService: HttpService,
  ) {}

  getToken(): Observable<any> {
    const baseUrl = this._options.baseUrl;
    const clientId = this._options.clientId;
    const clientSecret = this._options.clientSecret;
    const realm = this._options.realm;
    const data = {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    };
    const url = `${baseUrl}/realms/${realm}/protocol/openid-connect/token`;
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    return this.httpService.post(url, data, { headers }).pipe(
      map((response) => response),
      catchError((err) => {
        throw new UnauthorizedException('Client credentials flow failed');
      }),
    );
  }
}
