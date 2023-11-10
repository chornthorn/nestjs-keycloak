import { SetMetadata } from '@nestjs/common';

export type KeycloakScope = 'create' | 'view' | 'viewAny' | 'update' | 'delete';
export type KeycloakResource =
  | 'report'
  | 'user'
  | 'product'
  | 'order'
  | 'categories';

export const KeycloakAuthZ = (data: {
  resource?: KeycloakResource;
  scope?: KeycloakScope;
}) => SetMetadata('KeycloakAuthZ', data);
