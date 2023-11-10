import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { KeycloakService } from '@app/keycloak';
import { KeycloakAdminService } from '@app/keycloak-admin';
import { Cron } from '@nestjs/schedule';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly keycloakService: KeycloakService,
    private readonly keycloakAdminService: KeycloakAdminService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const token = await this.keycloakService.client.grant({
      scope: 'openid email profile',
      grant_type: 'password',
      username,
      password,
    });

    const profile: any = await this.keycloakService.client.userinfo(
      token.access_token,
    );

    return {
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      expires_in: token.expires_in,
      token_type: token.token_type,
      profile,
    };
  }

  // register
  async register(registerDto: RegisterDto) {
    try {
      const { username, email, password, firstName, lastName } = registerDto;
      const user = await this.keycloakAdminService.client.users.create({
        username,
        email,
        enabled: true,
        firstName,
        lastName,
      });

      await this.keycloakAdminService.client.users.resetPassword({
        id: user.id,
        credential: {
          temporary: false,
          type: 'password',
          value: password,
        },
      });

      // get token set
      const tokenSet = await this.keycloakService.client.grant({
        scope: 'openid email profile',
        grant_type: 'password',
        username,
        password,
      });

      // get profile
      const profile: any = await this.keycloakService.client.userinfo(
        tokenSet.access_token,
      );

      return {
        access_token: tokenSet.access_token,
        refresh_token: tokenSet.refresh_token,
        expires_in: tokenSet.expires_in,
        token_type: tokenSet.token_type,
        profile,
      };
    } catch (e) {
      console.log(e);
      if (e.response.status === 409) {
        throw new BadRequestException('Email already exists');
      } else {
        throw new BadRequestException('Register failed');
      }
    }
  }

  // refresh token
  async refreshToken(refreshToken: string) {
    try {
      const onlyToken = refreshToken.replace('Bearer ', '');
      const tokenSet = await this.keycloakService.client.refresh(onlyToken);
      const profile: any = await this.keycloakService.client.userinfo(
        tokenSet.access_token,
      );
      return {
        access_token: tokenSet.access_token,
        refresh_token: tokenSet.refresh_token,
        expires_in: tokenSet.expires_in,
        token_type: tokenSet.token_type,
        profile,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  // logout
  async logout(accessToken: string) {
    try {
      const onlyToken = accessToken.replace('Bearer ', '');
      await this.keycloakService.client.revoke(onlyToken);
      return {
        message: 'Logout success',
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  /// -----------------------------------------------------------------------------//

  async getAuthorizationUrl() {
    return this.keycloakService.getAuthorizationUrl();
  }

  async getProfile(token: string) {
    return await this.keycloakService.client.userinfo(token);
  }

  async callback(code: string) {
    try {
      return await this.keycloakService.callback(code);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  // get realm roles
  async introspect(token: string) {
    return await this.keycloakService.client.introspect(token);
  }

  // get user list
  async getUsers() {
    return await this.keycloakAdminService.client.users.find();
  }

  // get access token from refresh token using keycloak service within 30 minutes time interval
  // @Cron('58 * * * * *')
  @Cron('0 */30 * * * *') // every 30 minutes
  async reAuthenAdmin() {
    console.log('reAuthenAdmin');
    await this.keycloakAdminService.reAuthenticate({
      username: 'admin',
      password: 'admin',
    });
  }
}
