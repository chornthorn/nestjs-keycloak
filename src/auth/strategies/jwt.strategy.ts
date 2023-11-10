import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: readFileSync('./id_rsa.pub'),
      algorithms: ['RS256'],
      passReqToCallback: true, // pass request object to the callback below
    });
  }

  async validate(request: Request, payload: any) {
    /*
    payload {
        exp: 1699517956,
        iat: 1699517656,
        auth_time: 1699515513,
        jti: 'd3bea830-368f-42c6-9ca7-340f3390ee0c',
        iss: 'http://localhost:8080/realms/khode',
        aud: 'account',
        sub: '8a539bd5-6a7e-4593-b8e7-ed0e3d5a70b5',
        typ: 'Bearer',
        azp: 'khode-api',
        session_state: 'c4c59b7c-0e7a-4f69-8b4a-fffc3a91ebe7',
        acr: '0',
        'allowed-origins': [ 'http://localhost:3000' ],
        realm_access: {
          roles: [
            'owner',
            'default-roles-khode',
            'offline_access',
            'admin',
            'uma_authorization',
            'user'
          ]
        },
        resource_access: { account: { roles: [Array] } },
        scope: 'openid email profile',
        sid: 'c4c59b7c-0e7a-4f69-8b4a-fffc3a91ebe7',
        email_verified: false,
        preferred_username: 'bob',
        given_name: '',
        family_name: ''
    }
    * */

    // return nessusary data such as user id, email, name, roles, etc.
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
