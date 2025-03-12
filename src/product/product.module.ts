import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoryModule } from '../category/category.module';
import { FileModule } from '../file/file.module';

@Module({
  imports:[TypeOrmModule.forFeature([Product]), CategoryModule, FileModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports:[ProductService]
})
export class ProductModule {}
