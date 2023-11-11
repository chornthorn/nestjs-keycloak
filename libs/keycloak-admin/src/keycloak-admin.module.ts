import { Module } from '@nestjs/common';
import { KeycloakAdminService } from './keycloak-admin.service';
import { ConfigurableModuleClass } from './keycloak-admin.module-definition';
import { KeycloakClientModule } from '@app/keycloak-client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from 'joi';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './libs/keycloak-admin/.env',
      validationSchema: Joi.object({
        KEYCLOAK_BASE_URL: Joi.string().required(),
        KEYCLOAK_ADMIN_USERNAME: Joi.string().required(),
        KEYCLOAK_ADMIN_PASSWORD: Joi.string().required(),
      }),
    }),
    KeycloakClientModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        realm: 'master',
        client_id: 'admin-cli',
        grant_type: 'password',
        token_endpoint_auth_method: 'none',
        auth_base_url: configService.get<string>('KEYCLOAK_BASE_URL'),
        username: configService.get<string>('KEYCLOAK_ADMIN_USERNAME'),
        password: configService.get<string>('KEYCLOAK_ADMIN_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [KeycloakAdminService],
  exports: [KeycloakAdminService],
})
export class KeycloakAdminModule extends ConfigurableModuleClass {}
