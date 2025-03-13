import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Basket } from './entities/basket.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';
import { ClearBasketDto } from './dto/clear-bsaket.dto';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(Basket) private readonly basketRepo: Repository<Basket>,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  async create(createBasketDto: CreateBasketDto, userId: number) {
    if (!userId || userId !== createBasketDto.userId) {
      throw new UnauthorizedException('Ruxsat yoq')
    }
    const user = await this.userService.findOne(createBasketDto.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const product = await this.productService.findOne(
      createBasketDto.productId,
    );
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (product.stock < createBasketDto.quantity) {
      throw new BadRequestException('Not enough stock');
    }

    const existingBasket = await this.basketRepo.findOne({
      where: {
        userId: createBasketDto.userId,
        productId: createBasketDto.productId,
      },
    });

    if (existingBasket) {
      existingBasket.quantity += createBasketDto.quantity;
      product.stock -= createBasketDto.quantity;
      await this.productService.update(product.id, product);
      return this.basketRepo.save(existingBasket);
    }

    product.stock -= createBasketDto.quantity;
    await this.productService.update(product.id, product);

    return this.basketRepo.save(createBasketDto);
  }

  async findAll(userId:number) {
    return this.basketRepo.find({where:{userId}, relations: ['user', 'product'] });
  }

  async findOne(id: number) {
    const basket = await this.basketRepo.findOne({
      where: { id },
      relations: ['user', 'product'],
    });

    if (!basket) {
      throw new BadRequestException('Basket not found');
    }

    return basket;
  }

  async update(id: number, updateBasketDto: UpdateBasketDto, userId:number) {
    const basket = await this.basketRepo.findOne({ where: { id } });

    if (!basket) {
      throw new BadRequestException('Basket not found');
    }

    if (!userId || userId !== basket?.userId) {
      throw new UnauthorizedException('Ruxsat yoq');
    }

    if (updateBasketDto.productId) {
      const newProduct = await this.productService.findOne(
        updateBasketDto.productId,
      );
      if (!newProduct) {
        throw new BadRequestException('Product not found');
      }

      if (
        updateBasketDto.quantity !== undefined &&
        newProduct.stock < updateBasketDto.quantity
      ) {
        throw new BadRequestException('Not enough stock');
      }

      const oldProduct = await this.productService.findOne(basket.productId);
      if (oldProduct) {
        oldProduct.stock += basket.quantity;
        await this.productService.update(oldProduct.id, oldProduct);
      }

      if (updateBasketDto.quantity !== undefined) {
        newProduct.stock -= updateBasketDto.quantity;
        await this.productService.update(newProduct.id, newProduct);
      }
    }

    await this.basketRepo.update(id, updateBasketDto);

    return this.basketRepo.findOne({
      where: { id },
      relations: ['user', 'product'],
    });
  }

  async remove(id: number, userId:number) {
    const basket = await this.basketRepo.findOne({ where: { id } });

    if (!basket) {
      throw new BadRequestException('Basket not found');
    }

    if (!userId || userId !== basket?.userId) {
      throw new UnauthorizedException('Ruxsat yoq');
    }

    const product = await this.productService.findOne(basket.productId);
    if (product) {
      product.stock += basket.quantity;
      await this.productService.update(product.id, product);
    }

    await this.basketRepo.delete(id);
    return { message: 'Basket deleted successfully' };
  }

  async getUserBasket(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return this.basketRepo.find({
      where: { userId },
      relations: ['product'],
    });
  }

  async clearUserBasket(userId:number) {

    if (!userId || isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.basketRepo.delete({ userId });
    return { message: 'User basket cleared successfully' };
  }
}
