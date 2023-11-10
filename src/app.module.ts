import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ReportsModule } from './reports/reports.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { KeycloakAuthzModule } from '@app/keycloak-authz';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        KEYCLOAK_BASE_URL: Joi.string().required(),
        KEYCLOAK_ADMIN_USERNAME: Joi.string().required(),
        KEYCLOAK_ADMIN_PASSWORD: Joi.string().required(),
        KEYCLOAK_REALM: Joi.string().required(),
        KEYCLOAK_CLIENT_ID: Joi.string().required(),
        KEYCLOAK_CLIENT_SECRET: Joi.string().required(),
        KEYCLOAK_RSA_PUBLIC_KEY: Joi.string().required(),
        KEYCLOAK_CLIENT_SCOPE: Joi.string().required(),
        KEYCLOAK_REDIRECT_URIS: Joi.required(),
        KEYCLOAK_RESPONSE_TYPES: Joi.required(),
      }),
    }),
    KeycloakAuthzModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        baseUrl: configService.get<string>('KEYCLOAK_BASE_URL'),
        realm: configService.get<string>('KEYCLOAK_REALM'),
        clientId: configService.get<string>('KEYCLOAK_CLIENT_ID'),
        rsaPublicKey: configService.get<string>('KEYCLOAK_RSA_PUBLIC_KEY'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ProductsModule,
    ReportsModule,
    OrdersModule,
    CategoriesModule,
  ],
})
export class AppModule {}
