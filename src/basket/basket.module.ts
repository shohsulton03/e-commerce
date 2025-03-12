import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Basket } from './entities/basket.entity';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Basket]), UserModule, ProductModule],
  controllers: [BasketController],
  providers: [BasketService],
  exports:[BasketService]
})
export class BasketModule {}
