import { PassportStrategy } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { KeycloakAuthzService } from '../keycloak-authz.service';

@Injectable()
export class KeycloakAuthzJwtStrategy extends PassportStrategy(
  Strategy,
  'keycloak-jwt-auth',
) {
  constructor(private readonly keycloakAuthzService: KeycloakAuthzService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: keycloakAuthzService.getRSAPublicKey,
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
