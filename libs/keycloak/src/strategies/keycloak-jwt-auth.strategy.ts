import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
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
      secretOrKey: readFileSync('./id_rsa.pub'),
      algorithms: ['RS256'],
      passReqToCallback: true, // pass request object to the callback below for providing access token to the object
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
