import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductFormDto } from './dto/product-form-data.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Add new category' })
  @ApiResponse({
    status: 201,
    description: 'Added',
    type: Product,
  })
  @UseGuards(AdminGuard)
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  @Post()
  create(
    @Body() productFormDto: ProductFormDto,
    @UploadedFiles() files: Array<any>,
  ) {
    return this.productService.create({ ...productFormDto }, files);
  }

  @ApiOperation({ summary: 'Get all data' })
  @ApiResponse({
    status: 200,
    description: 'All product value',
    type: [Product],
  })
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: 'Get one data by Id' })
  @ApiResponse({
    status: 200,
    description: 'Get one by Id',
    type: Product,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update one data by Id' })
  @ApiResponse({
    status: 200,
    description: 'Update by Id',
    type: Product,
  })
  @UseGuards(AdminGuard)
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() productFormDto: ProductFormDto,
    @UploadedFiles() files: Array<any>,
  ) {
    return this.productService.update(+id, { ...productFormDto }, files);
  }

  @ApiOperation({ summary: 'Delete one data by Id' })
  @ApiResponse({
    status: 200,
    description: 'Delete by Id',
    type: Object,
  })
  @UseGuards(AdminGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
