import { Module } from '@nestjs/common';
import { KeycloakModule } from '@app/keycloak';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { KeycloakAdminModule } from '@app/keycloak-admin';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    KeycloakModule.register({
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
    JwtModule.register({}),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
