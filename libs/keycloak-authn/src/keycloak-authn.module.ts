import { Module } from '@nestjs/common';
import { KeycloakAuthnService } from './keycloak-authn.service';
import { ConfigurableModuleClass } from './keycloak-authn.module-definition';
import { KeycloakAuthnInterceptor } from './keycloak-authn.interceptor';

@Module({
  providers: [KeycloakAuthnService, KeycloakAuthnInterceptor],
  exports: [KeycloakAuthnService, KeycloakAuthnInterceptor],
})
export class KeycloakAuthnModule extends ConfigurableModuleClass {}
