import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Reflector } from '@nestjs/core';
import { catchError, firstValueFrom, map } from 'rxjs';
import { KeycloakAuthzService } from '../keycloak-authz.service';

@Injectable()
export class KeycloakAuthzGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    private readonly reflector: Reflector,
    private readonly keycloakAuthzService: KeycloakAuthzService,
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
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    const clientId = this.keycloakAuthzService.options.clientId;
    const baseUrl = this.keycloakAuthzService.options.baseUrl;
    const realm = this.keycloakAuthzService.options.realm;
    const tokenUrl = `${baseUrl}/realms/${realm}/protocol/openid-connect/token`;
    const grantType = 'urn:ietf:params:oauth:grant-type:uma-ticket'; // fixed value do not change it
    const metadataKey = 'KeycloakAuthZ';

    // check if resource defined first (at class level) and scope defined second (at method level)
    const getResource: { resource: string } = this.reflector.getAllAndOverride<{
      resource: string;
    }>(metadataKey, [context.getClass()]);

    const getScope: { scope: string } = this.reflector.getAllAndOverride<{
      scope: string;
    }>(metadataKey, [context.getHandler()]);

    // check if both resource and scope are defined at method level
    const resourceAndScope: { resource: string; scope: string } =
      this.reflector.getAllAndOverride<{ resource: string; scope: string }>(
        metadataKey,
        [context.getHandler(), context.getClass()],
      );

    // condition
    if (getResource && getScope) {
      resourceAndScope.resource = getResource.resource;
      resourceAndScope.scope = getScope.scope;
    }

    if (!resourceAndScope) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    // keycloak template: resource#scope
    // example: report#create
    const permission = `${resourceAndScope.resource}#scope:${resourceAndScope.scope}`;

    const requestBody = {
      grant_type: grantType,
      audience: clientId,
      permission: permission,
      response_mode: 'decision', // for keycloak to return response as boolean [true|false]
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
              this.console({
                data: resourceAndScope,
                decision: true,
              });
              return true;
            } else {
              this.console({
                data: resourceAndScope,
                decision: false,
              });
              throw new ForbiddenException(
                'You are not authorized to access this resource',
              );
            }
          }),
          catchError((error) => {
            this.console({
              data: resourceAndScope,
              decision: false,
            });
            throw new ForbiddenException(
              'You are not authorized to access this resource',
            );
          }),
        ),
    );
  }

  private console({
    data,
    decision,
  }: {
    data: {
      resource: string;
      scope: string;
    };
    decision: boolean;
  }) {
    const logger = new Logger(KeycloakAuthzGuard.name);
    logger.log(
      `Resource: ${data.resource} - Scope: ${data.scope} - Decision: ${decision}`,
    );
  }
}
