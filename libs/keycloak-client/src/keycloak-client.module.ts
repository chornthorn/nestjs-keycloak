import { Module } from '@nestjs/common';
import { KeycloakClientService } from './keycloak-client.service';
import { ConfigurableModuleClass } from './keycloak-client.module-definition';

@Module({
  providers: [KeycloakClientService],
  exports: [KeycloakClientService],
})
export class KeycloakClientModule extends ConfigurableModuleClass {}
