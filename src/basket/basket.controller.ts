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
import { BasketService } from './basket.service';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Basket } from './entities/basket.entity';
import { ClearBasketDto } from './dto/clear-bsaket.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { UserCreateGuard } from '../common/guards/user-create.guard';
import { Request } from 'express';

@ApiTags('basket')
@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @ApiOperation({ summary: 'Add new basket' })
  @ApiResponse({
    status: 201,
    description: 'Added',
    type: Basket,
  })
  @UseGuards(UserCreateGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createBasketDto: CreateBasketDto, @Req() req: Request) {
    const userId = req?.user?.['id'];

    if (!userId) {
      throw new UnauthorizedException('User ID not found');
    }
    return this.basketService.create(createBasketDto, +userId);
  }

  @ApiOperation({ summary: 'Get all data' })
  @ApiResponse({
    status: 200,
    description: 'All basket value',
    type: [Basket],
  })
  @UseGuards(UserCreateGuard)
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    const userId = req?.user?.['id'];

    if (!userId) {
      throw new UnauthorizedException('User ID not found');
    }
    return this.basketService.findAll(+userId);
  }

  // @ApiOperation({ summary: 'Get one data by Id' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Get one by Id',
  //   type: Basket,
  // })
  // @UseGuards(UserCreateGuard)
  // @UseGuards(AuthGuard)
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.basketService.findOne(+id);
  // }

  @ApiOperation({ summary: 'Update one data by Id' })
  @ApiResponse({
    status: 200,
    description: 'Update by Id',
    type: Basket,
  })
  @UseGuards(UserCreateGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBasketDto: UpdateBasketDto,
    @Req() req: Request,
  ) {
    const userId = req?.user?.['id'];

    if (!userId) {
      throw new UnauthorizedException('User ID not found');
    }
    return this.basketService.update(+id, updateBasketDto, +userId);
  }

  @ApiOperation({ summary: 'Delete all data by userId' })
  @ApiResponse({
    status: 200,
    description: 'Delete by userId',
    type: Object,
  })
  @UseGuards(UserCreateGuard)
  @UseGuards(AuthGuard)
  @Delete('clear')
  clearUserBasket(@Req() req: Request) {
    const userId = req?.user?.['id'];

    if (!userId) {
      throw new UnauthorizedException('User ID not found');
    }
    return this.basketService.clearUserBasket(+userId);
  }

  @ApiOperation({ summary: 'Delete one data by Id' })
  @ApiResponse({
    status: 200,
    description: 'Delete by Id',
    type: Object,
  })
  @UseGuards(UserCreateGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = req?.user?.['id'];

    if (!userId) {
      throw new UnauthorizedException('User ID not found');
    }
    return this.basketService.remove(+id, +userId);
  }
}
