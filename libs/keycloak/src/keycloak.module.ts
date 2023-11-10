import { Module } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';
import { ConfigurableModuleClass } from './keycloak.module-definition';

@Module({
  providers: [KeycloakService],
  exports: [KeycloakService],
})
export class KeycloakModule extends ConfigurableModuleClass {}
