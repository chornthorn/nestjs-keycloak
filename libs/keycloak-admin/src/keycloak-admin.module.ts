import { Module } from '@nestjs/common';
import { KeycloakAdminService } from './keycloak-admin.service';
import { ConfigurableModuleClass } from './keycloak-admin.module-definition';

@Module({
  providers: [KeycloakAdminService],
  exports: [KeycloakAdminService],
})
export class KeycloakAdminModule extends ConfigurableModuleClass {}
