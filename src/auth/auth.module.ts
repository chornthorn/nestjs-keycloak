import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KeycloakClientModule } from '@app/keycloak-client';
import { KeycloakAdminModule } from '@app/keycloak-admin';

@Module({
  imports: [
    KeycloakClientModule.register({
      realm: 'khode',
      client_id: 'khode-api',
      client_secret: 'NE48hwBkfAfcqJdyUU2tXjC7HpXR5BJv',
      auth_base_url: 'http://localhost:8080',
      redirect_uris: ['http://localhost:3000/api/auth/callback'],
      response_types: ['code'],
      scope: 'openid profile email',
    }),
    KeycloakAdminModule.register({
      baseUrl: 'http://localhost:8080',
      realmName: 'khode',
      username: 'admin',
      password: 'admin',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
