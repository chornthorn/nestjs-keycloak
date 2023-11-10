import { Inject, Injectable } from '@nestjs/common';
import { KeycloakModuleOptions } from './interfaces/keycloak.module-options';
import { MODULE_OPTIONS_TOKEN } from './types/keycloak.module-definition';

@Injectable()
export class KeycloakService {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: KeycloakModuleOptions,
  ) {}
}
