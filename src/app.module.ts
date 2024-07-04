import { Module } from '@nestjs/common';
import { Product } from './products/product.entity';
import { ProductService } from './products/product.service';
import { ProductController } from './products/product.controller';
import { AppController } from './app.controller';
import { User } from './users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import * as dotenv from 'dotenv';
import { MetricsService } from './metrics/metrics.service';
import { MetricsInterceptor } from './metrics/metrics.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DBHOST,
      port: 5432,
      username: process.env.DBUSER,
      password: process.env.DBPASS,
      database: process.env.DBNAME,
      entities: [Product, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Product, User]),
    PrometheusModule.register({
      defaultLabels: {
        app: 'orders-api',
      },
    }),
    AuthModule,
  ],
  providers: [
    ProductService,
    UsersService,
    MetricsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
  controllers: [ProductController, AppController],
})
export class AppModule {}
