import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProductModule } from './product/product.module';
import { BasketModule } from './basket/basket.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: true,
      entities: [join(__dirname, '**/*.entity.{ts,js}')],
      logging: true,
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    FileModule,
    ProductModule,
    BasketModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
