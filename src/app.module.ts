import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ReportsModule } from './reports/reports.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { KeycloakModule } from '@app/keycloak';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        KEYCLOAK_TOKEN_URL: Joi.string().required(),
        KEYCLOAK_ADMIN_USERNAME: Joi.string().required(),
        KEYCLOAK_ADMIN_PASSWORD: Joi.string().required(),
        KEYCLOAK_REALM: Joi.string().required(),
        KEYCLOAK_BASE_URL: Joi.string().required(),
        KEYCLOAK_CLIENT_ID: Joi.string().required(),
        KEYCLOAK_CLIENT_SECRET: Joi.string().required(),
        KEYCLOAK_RSA_PUBLIC_KEY: Joi.string().required(),
        KEYCLOAK_CLIENT_SCOPE: Joi.string().required(),
        KEYCLOAK_REDIRECT_URIS: Joi.required(),
        KEYCLOAK_RESPONSE_TYPES: Joi.required(),
      }),
    }),
    KeycloakModule.register({}),
    AuthModule,
    ProductsModule,
    ReportsModule,
    OrdersModule,
    CategoriesModule,
  ],
})
export class AppModule {}
