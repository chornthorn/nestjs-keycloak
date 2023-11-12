import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { KeycloakAuthnService } from './keycloak-authn.service';
import { switchMap } from 'rxjs/operators';

/**
 * @Injectable() is a decorator that marks a class as available to be provided and injected as a dependency.
 */
@Injectable()
export class KeycloakAuthnInterceptor implements NestInterceptor {
  constructor(private readonly keycloakAuthnService: KeycloakAuthnService) {}

  /**
   * This method is an interceptor that intercepts incoming requests,
   * retrieves a token from the Keycloak authentication service,
   * and adds it to the request headers and request object.
   *
   * @param {ExecutionContext} context - The execution context instance.
   * @param {CallHandler} next - The CallHandler instance.
   * @returns {Observable<any>} - Returns an Observable that can be subscribed to.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return this.keycloakAuthnService.getToken().pipe(
      switchMap((response: { data: { access_token: string } }) => {
        const http = context.switchToHttp();
        const request = http.getRequest();
        request.headers.authorization = `Bearer ${response.data.access_token}`;
        request.token = response.data.access_token; // Add the token to the request object
        return next.handle();
      }),
    );
  }
}
