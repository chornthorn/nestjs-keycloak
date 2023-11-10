import { Inject, Injectable } from '@nestjs/common';
import { KeycloakAuthzModuleOptions } from './interfaces/keycloak-authz.module-options';
import { MODULE_OPTIONS_TOKEN } from './types/keycloak-authz.module-definition';

@Injectable()
export class KeycloakAuthzService {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly _options: KeycloakAuthzModuleOptions,
  ) {}

  /**
   * Getter for the KeycloakModuleOptions option.
   * This method returns the KeycloakModuleOptions from the Keycloak service.
   *
   * @returns {KeycloakAuthzModuleOptions} The KeycloakModuleOptions instance.
   */
  get options(): KeycloakAuthzModuleOptions {
    return this._options;
  }

  /**
   * Getter for the RSA Public Key option.
   * This method returns the RSA Public Key from the Keycloak module options.
   * It also replaces all occurrences of '\\n' in the key with '\n'.
   *
   * @returns {string} The RSA Public Key with '\\n' replaced by '\n'.
   */
  get getRSAPublicKey(): string {
    // check if rsaPublicKey is not defined
    return this.options.rsaPublicKey.replace(/\\n/g, '\n');
  }
}
