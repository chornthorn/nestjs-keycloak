import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KeycloakClientModule } from '@app/keycloak-client';
import { KeycloakAdminModule } from '@app/keycloak-admin';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    KeycloakClientModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        realm: configService.get<string>('KEYCLOAK_REALM'),
        client_id: configService.get<string>('KEYCLOAK_CLIENT_ID'),
        client_secret: configService.get<string>('KEYCLOAK_CLIENT_SECRET'),
        auth_base_url: configService.get<string>('KEYCLOAK_BASE_URL'),
        redirect_uris: [
          ...configService.get<string>('KEYCLOAK_REDIRECT_URIS').split(','),
        ],
        response_types: [
          ...configService.get<string>('KEYCLOAK_RESPONSE_TYPES').split(','),
        ],
        scope: configService.get<string>('KEYCLOAK_CLIENT_SCOPE'),
      }),
      inject: [ConfigService],
    }),
    KeycloakAdminModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        baseUrl: configService.get<string>('KEYCLOAK_BASE_URL'),
        realmName: configService.get<string>('KEYCLOAK_REALM'),
        username: configService.get<string>('KEYCLOAK_ADMIN_USERNAME'),
        password: configService.get<string>('KEYCLOAK_ADMIN_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
