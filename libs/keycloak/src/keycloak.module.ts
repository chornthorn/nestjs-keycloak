import { Module } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';
import { ConfigurableModuleClass } from './types/keycloak.module-definition';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { KeycloakJwtAuthStrategy } from './strategies/keycloak-jwt-auth.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './libs/keycloak/.env',
    }),
    JwtModule.register({}),
    ScheduleModule.forRoot(),
    {
      ...HttpModule.register({}),
      global: true,
    },
  ],
  providers: [KeycloakService, KeycloakJwtAuthStrategy],
  exports: [KeycloakService],
})
export class KeycloakModule extends ConfigurableModuleClass {}
