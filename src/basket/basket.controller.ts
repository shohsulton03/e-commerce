import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Basket } from './entities/basket.entity';
import { ClearBasketDto } from './dto/clear-bsaket.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { UserCreateGuard } from '../common/guards/user-create.guard';

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
  create(@Body() createBasketDto: CreateBasketDto) {
    return this.basketService.create(createBasketDto);
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
  findAll() {
    return this.basketService.findAll();
  }

  @ApiOperation({ summary: 'Get one data by Id' })
  @ApiResponse({
    status: 200,
    description: 'Get one by Id',
    type: Basket,
  })
  @UseGuards(UserCreateGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.basketService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update one data by Id' })
  @ApiResponse({
    status: 200,
    description: 'Update by Id',
    type: Basket,
  })
  @UseGuards(UserCreateGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBasketDto: UpdateBasketDto) {
    return this.basketService.update(+id, updateBasketDto);
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
  clearUserBasket(@Body() clearBasketDto: ClearBasketDto) {
    return this.basketService.clearUserBasket(clearBasketDto.userId);
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
  remove(@Param('id') id: string) {
    return this.basketService.remove(+id);
  }
}
