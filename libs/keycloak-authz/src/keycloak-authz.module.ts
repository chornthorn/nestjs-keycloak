import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { KeycloakAuthzService } from './keycloak-authz.service';
import { ConfigurableModuleClass } from './types/keycloak-authz.module-definition';
import { KeycloakAuthzJwtStrategy } from './strategies/keycloak-jwt-auth.strategy';

@Module({
  imports: [
    JwtModule.register({}),
    {
      ...HttpModule.register({}),
      global: true,
    },
  ],
  providers: [KeycloakAuthzService, KeycloakAuthzJwtStrategy],
  exports: [KeycloakAuthzService],
})
export class KeycloakAuthzModule extends ConfigurableModuleClass {}
