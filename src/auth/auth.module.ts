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
        realm: configService.getOrThrow<string>('REALM'),
        client_id: configService.getOrThrow<string>('CLIENT_ID'),
        client_secret: configService.getOrThrow<string>('CLIENT_SECRET'),
        auth_base_url: configService.getOrThrow<string>('AUTH_BASE_URL'),
        redirect_uris: configService.getOrThrow<string[]>('REDIRECT_URI'),
        response_types: configService.getOrThrow<string[]>('RESPONSE_TYPE'),
        scope: configService.getOrThrow<string>('SCOPE'),
      }),
      inject: [ConfigService],
    }),
    KeycloakAdminModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        baseUrl: configService.getOrThrow<string>('ADMIN_AUTH_BASE_URL'),
        realmName: configService.getOrThrow<string>('ADMIN_REALM'),
        username: configService.getOrThrow<string>('ADMIN_USER'),
        password: configService.getOrThrow<string>('ADMIN_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
