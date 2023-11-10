import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { HttpModule } from '@nestjs/axios';
import { ReportsModule } from './reports/reports.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HttpModule.register({}),
    AuthModule,
    ProductsModule,
    ReportsModule,
    OrdersModule,
    CategoriesModule,
  ],
})
export class AppModule {}
