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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakAuthZGuard implements CanActivate {
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
    const grantType = 'urn:ietf:params:oauth:grant-type:uma-ticket'; // fixed value do not change it

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
              throw new ForbiddenException();
            }
          }),
          catchError((error) => {
            this.console({
              data: resourceAndScope,
              decision: false,
            });
            throw new ForbiddenException();
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
    const logger = new Logger(KeycloakAuthZGuard.name);
    logger.log(
      `Resource: ${data.resource} - Scope: ${data.scope} - Decision: ${decision}`,
    );
  }
}
