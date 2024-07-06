import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsService } from './metrics/metrics.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MetricsInterceptor } from './metrics/metrics.interceptor';
import { ProductController } from './products/product.controller';
import { ProductService } from './products/product.service';
import { Product } from './products/product.entity';
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
      entities: [Product],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Product]),
    PrometheusModule.register({
      defaultLabels: {
        app: 'product-api',
      },
    }),
    AuthModule,
  ],
  providers: [
    ProductService,
    MetricsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
  controllers: [ProductController, AppController],
})
export class AppModule { }
