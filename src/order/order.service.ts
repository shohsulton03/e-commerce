import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Basket } from '../basket/entities/basket.entity';
import { BasketService } from '../basket/basket.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    private readonly basketService: BasketService,
  ) {}

  async create(userId:number) {
    const baskets = await this.basketService.getUserBasket(userId)
    if (!baskets.length) {
      throw new BadRequestException('Basket is empty')
    }

    const orders = baskets.map(basket => this.orderRepo.create({
      userId:basket.userId,
      productId:basket.productId,
      quantity:basket.quantity,
    }))

    await this.orderRepo.save(orders)

    await this.basketService.clearUserBasket(userId)

    return { message: 'Order created successfully', orders };
  }

  findAll() {
    return this.orderRepo.find({ relations: ['user', 'product'] });
  }

  async getOrderByUserId(userId:number) {
    const orders = await this.orderRepo.find({ where: { userId }, relations: ['user', 'product'] });
    if (!orders) {
      throw new BadRequestException('Orders not found');
    }
    return orders;
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({ where: { id }, relations: ['user', 'product'] });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    return order;
  }
}
