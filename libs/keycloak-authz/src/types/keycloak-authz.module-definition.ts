import { ConfigurableModuleBuilder } from '@nestjs/common';
import { KeycloakAuthzModuleOptions } from '../interfaces/keycloak-authz.module-options';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<KeycloakAuthzModuleOptions>()
    .setFactoryMethodName('createConfigOptions')
    .setExtras(
      {
        isGlobal: true,
      },
      (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
      }),
    )
    .build();
