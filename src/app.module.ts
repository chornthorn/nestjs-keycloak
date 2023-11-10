import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ReportsModule } from './reports/reports.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { KeycloakModule } from '@app/keycloak';

@Module({
  imports: [
    KeycloakModule.register({}),
    AuthModule,
    ProductsModule,
    ReportsModule,
    OrdersModule,
    CategoriesModule,
  ],
})
export class AppModule {}
