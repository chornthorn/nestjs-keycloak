import { ConfigurableModuleBuilder } from '@nestjs/common';
import { KeycloakClientModuleOptions } from './keycloak-client.module-options';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<KeycloakClientModuleOptions>()
    .setFactoryMethodName('createConfigOptions')
    .build();
