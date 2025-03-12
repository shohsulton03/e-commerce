import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { FileService } from '../file/file.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private readonly categoryService: CategoryService,
    private readonly fileService: FileService,
  ) {}

  async create(createProductDto: CreateProductDto, files: Array<any>) {
    const category = await this.categoryService.findOne(
      createProductDto.categoryId,
    );
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    const images = await Promise.all(
      files.map((file) => this.fileService.saveFile(file)),
    );

    createProductDto.images = images;

    return this.productRepo.save({ ...createProductDto });
  }

  findAll() {
    return this.productRepo.find({ relations: ['category'] });
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new BadRequestException(`Product with this ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    files?: Array<any>,
  ) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new BadRequestException(`Product with this ${id} not found`);
    }

    if (updateProductDto.categoryId) {
      const category = await this.categoryService.findOne(
        updateProductDto.categoryId,
      );
      if (!category) {
        throw new BadRequestException(
          `Category with this ${updateProductDto.categoryId} not found`,
        );
      }
      product.category = category;
    }

    if (files && files.length > 0) {
      await Promise.all(
        product.images.map((img) => this.fileService.deleteFile(img)),
      );

      const newImages = await Promise.all(
        files.map((file) => this.fileService.saveFile(file)),
      );
      product.images = newImages;
    }

    Object.assign(product, updateProductDto);

    return this.productRepo.save(product);
  }

  async remove(id: number) {
    const deletedProduct = await this.productRepo.findOne({ where: { id } });
    if (!deletedProduct) {
      throw new BadRequestException('Product not found');
    }
    try {
      await Promise.all(
        deletedProduct.images.map(
          async (img) => await this.fileService.deleteFile(img),
        ),
      );
    } catch (error) {
      console.log(error);
      throw new BadRequestException(`Fayllarni o‘chirishda xatolik yuz berdi`);
    }
    return { mesage: 'Product deleted succesfully' };
  }
}
