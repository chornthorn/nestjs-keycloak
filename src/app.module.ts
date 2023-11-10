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
        KEYCLOAK_CLIENT_ID: Joi.string().required(),
        RSA_PUBLIC_KEY: Joi.string().required(),
        REALM: Joi.string().required(),
        CLIENT_ID: Joi.string().required(),
        CLIENT_SECRET: Joi.string().required(),
        AUTH_BASE_URL: Joi.string().required(),
        REDIRECT_URI: Joi.string().required(),
        RESPONSE_TYPE: Joi.string().required(),
        SCOPE: Joi.string().required(),
        ADMIN_AUTH_BASE_URL: Joi.string().required(),
        ADMIN_REALM: Joi.string().required(),
        ADMIN_USER: Joi.string().required(),
        ADMIN_PASSWORD: Joi.string().required(),
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
