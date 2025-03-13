import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Order } from './entities/order.entity';
import { AdminGuard } from '../common/guards/admin.guard';
import { AuthGuard } from '../common/guards/auth.guard';
import { UserCreateGuard } from '../common/guards/user-create.guard';
import { UserGuard } from '../common/guards/user.guard';
import { Request } from 'express';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Add new order' })
  @ApiResponse({
    status: 201,
    description: 'Added',
    type: Order,
  })
  @UseGuards(UserCreateGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req: Request) {
    const userId = req?.user?.['id'];

    if (!userId) {
      throw new UnauthorizedException('User ID not found');
    }
    return this.orderService.create(+userId);
  }

  @ApiOperation({ summary: 'Get all data' })
  @ApiResponse({
    status: 200,
    description: 'All orders value',
    type: [Order],
  })
  @UseGuards(AdminGuard)
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @ApiOperation({ summary: 'Get all by userId' })
  @ApiResponse({
    status: 200,
    description: 'Get all by userId',
    type: Order,
  })
  @UseGuards(UserCreateGuard)
  @UseGuards(AuthGuard)
  @Get('user-self')
  getOrderByUserId(@Req() req: Request) {
    const userId = req?.user?.['id'];

    if (!userId) {
      throw new UnauthorizedException('User ID not found');
    }
    return this.orderService.getOrderByUserId(+userId);
  }

  @ApiOperation({ summary: 'Get one data by Id' })
  @ApiResponse({
    status: 200,
    description: 'Get one by Id',
    type: Order,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }
}
