import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { KeycloakAdminService } from '@app/keycloak-admin';
import { Cron } from '@nestjs/schedule';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { KeycloakClientService } from '@app/keycloak-client';

@Injectable()
export class AuthService {
  constructor(
    private readonly keycloakClientService: KeycloakClientService,
    private readonly keycloakAdminService: KeycloakAdminService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const { username, password } = loginDto;
      const token = await this.keycloakClientService.client.grant({
        scope: 'openid email profile',
        grant_type: 'password',
        username,
        password,
      });

      const profile: any = await this.keycloakClientService.client.userinfo(
        token.access_token,
      );

      return {
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        expires_in: token.expires_in,
        token_type: token.token_type,
        profile,
      };
    } catch (e) {
      if (e.error === 'invalid_grant') {
        throw new BadRequestException('Invalid username or password');
      } else if (e.error === 'unauthorized_client') {
        throw new BadRequestException('Invalid client credentials');
      } else {
        throw new BadRequestException(e.description || 'Login failed');
      }
    }
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
      const tokenSet = await this.keycloakClientService.client.grant({
        scope: 'openid email profile',
        grant_type: 'password',
        username,
        password,
      });

      // get profile
      const profile: any = await this.keycloakClientService.client.userinfo(
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
      const tokenSet =
        await this.keycloakClientService.client.refresh(onlyToken);
      const profile: any = await this.keycloakClientService.client.userinfo(
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
      throw new BadRequestException('Refresh token failed');
    }
  }

  // logout
  async logout(accessToken: string) {
    try {
      const onlyToken = accessToken.replace('Bearer ', '');
      await this.keycloakClientService.client.revoke(onlyToken);
      return {
        message: 'Logout success',
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  /// -----------------------------------------------------------------------------//

  async getAuthorizationUrl() {
    return this.keycloakClientService.getAuthorizationUrl();
  }

  async getProfile(token: string) {
    return await this.keycloakClientService.client.userinfo(token);
  }

  async callback(code: string) {
    try {
      return await this.keycloakClientService.callback(code);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  // get realm roles
  async introspect(token: string) {
    return await this.keycloakClientService.client.introspect(token);
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
      password: 'admin@123@',
    });
  }
}
