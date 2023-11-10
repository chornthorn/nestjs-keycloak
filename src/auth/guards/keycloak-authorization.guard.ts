import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Reflector } from '@nestjs/core';
import { catchError, firstValueFrom, map } from 'rxjs';
import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakAuthorizationGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check if isPublic is true
    const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      throw new ForbiddenException();
    }

    const tokenUrl = this.configService.get<string>('KEYCLOAK_TOKEN_URL');
    const clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID');
    const grantType = 'urn:ietf:params:oauth:grant-type:uma-ticket'; // fixed value do not change

    // check if resource defined first (at class level) and scope defined second (at method level)
    const getResource: any = this.reflector.getAllAndOverride<string>(
      'KeycloakAuthZ',
      [context.getClass()],
    );

    const getScope: any = this.reflector.getAllAndOverride<string>(
      'KeycloakAuthZ',
      [context.getHandler()],
    );

    // get resource and scope from metadata
    // check if both resource and scope are defined at method level
    const resourceAndScope: any = this.reflector.getAllAndOverride<string[]>(
      'KeycloakAuthZ',
      [context.getHandler(), context.getClass()],
    );

    // condition
    if (getResource && getScope) {
      resourceAndScope.resource = getResource.resource;
      resourceAndScope.scope = getScope.scope;
    }

    if (!resourceAndScope) {
      throw new ForbiddenException();
    }

    // template: resource#scope
    // example: report#create
    const permission = `${resourceAndScope.resource}#scope:${resourceAndScope.scope}`;

    console.log(resourceAndScope);

    const requestBody = {
      grant_type: grantType,
      audience: clientId,
      permission: permission,
      response_mode: 'decision',
    };

    return await firstValueFrom(
      this.httpService
        .post(tokenUrl, requestBody, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${user.accessToken}`,
          },
        })
        .pipe(
          map((response) => {
            if (response.data) {
              return true;
            } else {
              throw new ForbiddenException();
            }
          }),
          catchError((error) => {
            throw new ForbiddenException();
          }),
        ),
    );
  }
}
