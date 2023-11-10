import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class KeycloakJwtAuthStrategy extends PassportStrategy(
  Strategy,
  'keycloak-jwt-auth',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService
        .get<string>('KEYCLOAK_RSA_PUBLIC_KEY')
        .replace(/\\n/g, '\n'),
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    return {
      id: payload.sub,
      email: payload?.email || null,
      username: payload.preferred_username,
      isEmailVerified: payload.email_verified,
      givenName: payload.given_name,
      familyName: payload.family_name,
      roles: payload.realm_access.roles,
      accessToken: request.headers?.authorization.split(' ')[1],
    };
  }
}
