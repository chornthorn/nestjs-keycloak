import { applyDecorators, UseGuards } from '@nestjs/common';
import { KeycloakAuthzJwtGuard } from '../guards/keycloak-authz-jwt.guard';
import { KeycloakAuthzGuard } from '../guards/keycloak-authz.guard';

/**
 * This decorator is a convenience wrapper around the `UseGuards` decorator from NestJS.
 * It applies the `KeycloakAuthzJwtGuard` and `KeycloakAuthzGuard` guards to the routes it decorates.
 *
 * @example
 * ```typescript
 * @UseKeycloakAuthZGuards()
 * @Controller('categories')
 * export class CategoriesController {
 *   // ...
 * }
 **/
export function UseKeycloakAuthzGuard() {
  return applyDecorators(UseGuards(KeycloakAuthzJwtGuard, KeycloakAuthzGuard));
}
