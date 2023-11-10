import { Module } from '@nestjs/common';
import { KeycloakAuthnService } from './keycloak-authn.service';

@Module({
  providers: [KeycloakAuthnService],
  exports: [KeycloakAuthnService],
})
export class KeycloakAuthnModule {}
