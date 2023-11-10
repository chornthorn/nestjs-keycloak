import { ConfigurableModuleBuilder } from '@nestjs/common';
import { KeycloakAdminModuleOptions } from './keycloak-admin.module-options';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<KeycloakAdminModuleOptions>()
    .setFactoryMethodName('createConfigOptions')
    .build();
