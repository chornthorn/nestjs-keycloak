import { Test, TestingModule } from '@nestjs/testing';
import { KeycloakAuthnService } from './keycloak-authn.service';

describe('KeycloakAuthnService', () => {
  let service: KeycloakAuthnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeycloakAuthnService],
    }).compile();

    service = module.get<KeycloakAuthnService>(KeycloakAuthnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
