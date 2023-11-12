import { ConfigurableModuleBuilder } from '@nestjs/common';
import { KeycloakAuthnModuleOptions } from './keycloak-authn.module-options';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<KeycloakAuthnModuleOptions>()
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
