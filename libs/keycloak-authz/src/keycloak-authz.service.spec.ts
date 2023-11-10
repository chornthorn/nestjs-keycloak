import { Test, TestingModule } from '@nestjs/testing';
import { KeycloakAuthzService } from './keycloak-authz.service';
import { MODULE_OPTIONS_TOKEN } from './types/keycloak-authz.module-definition';

describe('KeycloakAuthzService', () => {
  let service: KeycloakAuthzService;
  let options;

  beforeEach(async () => {
    options = {
      rsaPublicKey: 'test\\nkey',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeycloakAuthzService,
        {
          provide: MODULE_OPTIONS_TOKEN,
          useValue: options,
        },
      ],
    }).compile();

    service = module.get<KeycloakAuthzService>(KeycloakAuthzService);
  });

  it('should return options when get options', () => {
    expect(service.options).toBe(options);
  });

  it('should return RSA Public Key with correct format', () => {
    expect(service.getRSAPublicKey).toBe('test\nkey');
  });
});
