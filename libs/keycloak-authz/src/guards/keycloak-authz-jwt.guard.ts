import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class KeycloakAuthzJwtGuard extends AuthGuard('keycloak-jwt-auth') {
  constructor(private reflector: Reflector) {
    super();
  }

  // canActivate
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // // check if isPublic is true
    const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // check if rpc (microservice) on context
    if (context.getType() === 'rpc') {
      const ctx = context.switchToRpc();
      const data: { headers: { authorization: string } } = ctx.getData();

      if (!data?.headers?.authorization) {
        // throw new RpcException2('Access denied', 'Unauthorized');
      } else {
        return super.canActivate(context);
      }
    } else {
      return super.canActivate(context);
    }
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // check if rpc (microservice) on context
    if (context.getType() === 'rpc') {
      if (err || !user) {
        // throw err || new RpcException2('Access denied', 'Unauthorized');
      } else {
        return user;
      }
    } else {
      if (err || !user) {
        throw err || new UnauthorizedException('Access denied');
      } else {
        return user;
      }
    }
  }
}
