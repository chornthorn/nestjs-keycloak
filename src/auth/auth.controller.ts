import {
  Controller,
  Get,
  Res,
  Query,
  Headers,
  UnauthorizedException,
  UseGuards,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Head,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { Response } from 'express';
import { JwtAuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { KeycloakAuthZ } from './decorators/keycloak-authz.decorator';
import { KeycloakAuthorizationGuard } from './guards/keycloak-authorization.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  // refresh token
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Headers('authorization') authorization: string) {
    return await this.authService.refreshToken(authorization);
  }

  // getAuthorizationUrl
  @Get('login')
  async getAuthorizationUrl(@Res() req: Response) {
    const result = await this.authService.getAuthorizationUrl();
    req.redirect(result);
  }

  // logout
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Headers('authorization') authorization: string) {
    return await this.authService.logout(authorization);
  }

  // getProfile
  @Get('profile')
  async getProfile(@Headers('authorization') authorization: string) {
    try {
      const token = authorization.replace('Bearer ', '');
      return this.authService.getProfile(token);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  // callback
  @Get('callback')
  async callback(@Query('code') code: string) {
    return this.authService.callback(code);
  }

  // get introspect
  @Get('introspect')
  async introspect(@Headers('authorization') authorization: string) {
    try {
      const token = authorization.replace('Bearer ', '');
      return this.authService.introspect(token);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  // get user list
  @KeycloakAuthZ({ resource: 'report', scope: 'create' })
  @UseGuards(JwtAuthGuard, KeycloakAuthorizationGuard)
  @Get('users')
  async getUsers(@CurrentUser() user: any) {
    return {
      user,
    };
  }

  // get user list
  @Get('users2')
  async getUsers2() {
    return await this.authService.getUsers();
  }
}
