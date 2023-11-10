import { ConfigurableModuleBuilder } from '@nestjs/common';
import { KeycloakModuleOptions } from '../interfaces/keycloak.module-options';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<KeycloakModuleOptions>()
    .setFactoryMethodName('createConfigOptions')
    .build();
