import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { KeycloakAuthnService } from './keycloak-authn.service';
import { MODULE_OPTIONS_TOKEN } from './keycloak-authn.module-definition';
import { KeycloakAuthnModuleOptions } from './keycloak-authn.module-options';
import { firstValueFrom, of, throwError } from 'rxjs';
import { UnauthorizedException } from '@nestjs/common';

describe('KeycloakAuthnService', () => {
  let service: KeycloakAuthnService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeycloakAuthnService,
        {
          provide: MODULE_OPTIONS_TOKEN,
          useValue: {
            baseUrl: 'http://localhost',
            clientId: 'testClientId',
            clientSecret: 'testClientSecret',
            realm: 'testRealm',
          } as KeycloakAuthnModuleOptions,
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<KeycloakAuthnService>(KeycloakAuthnService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should throw an UnauthorizedException when the client credentials are invalid', async () => {
    const error: { response: { status: number } } = {
      response: { status: 401 },
    };
    jest
      .spyOn(httpService, 'post')
      .mockImplementationOnce(() => throwError(() => error));

    await expect(firstValueFrom(service.getToken())).rejects.toThrow(
      UnauthorizedException,
    );
  });

  // should return a token when the client credentials are valid
  it('should return a token when the client credentials are valid', async () => {
    const mockTokenResponse = {
      access_token: 'mockAccessToken',
      expires_in: 300,
      refresh_expires_in: 1800,
      refresh_token: 'mockRefreshToken',
      token_type: 'bearer',
      not_before_policy: 0,
      session_state: 'mockSessionState',
      scope: 'email profile',
    };

    jest
      .spyOn(httpService, 'post')
      .mockImplementationOnce(() => of<any>({ data: mockTokenResponse }));

    const token = await firstValueFrom(service.getToken());

    expect(token.data).toEqual(mockTokenResponse);
  });

  it('should throw an UnauthorizedException when the server is unreachable', async () => {
    const error: { response: { status: number } } = {
      response: { status: 500 },
    };
    jest
      .spyOn(httpService, 'post')
      .mockImplementationOnce(() => throwError(() => error));

    await expect(firstValueFrom(service.getToken())).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
