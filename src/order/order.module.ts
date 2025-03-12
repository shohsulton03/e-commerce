import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Basket } from '../basket/entities/basket.entity';
import { BasketModule } from '../basket/basket.module';

@Module({
  imports:[TypeOrmModule.forFeature([Order]), BasketModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
