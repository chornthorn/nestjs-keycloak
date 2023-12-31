import { Inject, Injectable, Logger } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from './keycloak-admin.module-definition';
import { KeycloakAdminModuleOptions } from './keycloak-admin.module-options';
import { KeycloakAdminClient } from '@s3pweb/keycloak-admin-client-cjs';
import { KeycloakAdminModule } from './keycloak-admin.module';
import { KeycloakClientService } from '@app/keycloak-client';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class KeycloakAdminService {
  private readonly kcAdminClient: KeycloakAdminClient;
  private logger = new Logger(KeycloakAdminModule.name);

  /**
   * Constructs a new instance of the class.
   *
   * @param {KeycloakAdminModuleOptions} options - the module options
   * @param keycloakClientService
   */
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: KeycloakAdminModuleOptions,
    private readonly keycloakClientService: KeycloakClientService,
  ) {
    this.kcAdminClient = new KeycloakAdminClient({
      baseUrl: options.baseUrl,
      realmName: 'master',
    });

    // authorize with promise
    this.kcAdminClient
      .auth({
        username: this.options.username,
        password: this.options.password,
        grantType: this.options.grantType || 'password',
        clientId: this.options.clientId || 'admin-cli',
      })
      .then((res) => {
        this.logger.log('Keycloak admin client authenticated');
      })
      .catch((err) => {
        this.logger.error(
          '\n1. Keycloak admin client authentication failed,\n2. Please check your configuration',
        );
        this.logger.error(err);
      });
  }

  /**
   * Returns the KeycloakAdminClient instance.
   *
   * @return {KeycloakAdminClient} The KeycloakAdminClient instance.
   */
  get client(): KeycloakAdminClient {
    this.kcAdminClient.setConfig({
      realmName: this.options.realmName,
    });
    return this.kcAdminClient;
  }

  /**
   * Re-authenticates the user with the given credentials.
   *
   * @param {Object} credentials - The credentials used for authentication.
   * @param {string} credentials.grantType - The grant type for authentication. It should be 'client_credentials'.
   * @param {string} credentials.clientId - The client ID for authentication.
   * @param {string} credentials.clientSecret - The client secret for authentication.
   * @return {Promise<void>} - A promise that resolves when the re-authentication is complete.
   */
  async reAuthenticate({
    username,
    password,
  }: {
    password: string;
    username: string;
  }) {
    this.kcAdminClient.setConfig({
      realmName: 'master',
    });
    await this.kcAdminClient.auth({
      clientId: 'admin-cli',
      grantType: 'password',
      username: username,
      password: password,
    });
  }

  // get access token for admin client
  // run every 58 seconds
  @Cron('*/58 * * * * *')
  private async getAccessToken() {
    const refreshToken = this.kcAdminClient.refreshToken;

    const tokenSet =
      await this.keycloakClientService.client.refresh(refreshToken);
    this.kcAdminClient.setAccessToken(tokenSet.access_token);

    console.log('admin client get access token success');
  }
}
