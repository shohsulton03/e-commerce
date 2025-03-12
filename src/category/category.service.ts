import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { FileService } from '../file/file.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly fileService: FileService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, files: Array<any>) {
    let parentCategory: Category | null = null;
    if (createCategoryDto.parentId) {
      parentCategory = await this.categoryRepo.findOne({
        where: { id: createCategoryDto.parentId },
      });
      if (!parentCategory) {
        throw new BadRequestException(
          `Category with this ${createCategoryDto.parentId} not found`,
        );
      }
    }

    const images = await Promise.all(
      files.map((file) => this.fileService.saveFile(file)),
    );

    createCategoryDto.images = images;

    return this.categoryRepo.save({ ...createCategoryDto });
  }

  findAll() {
    return this.categoryRepo.find({ relations: ['children', 'parent', 'products'] });
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['children', 'parent', 'products'],
    });
    if (!category) {
      throw new BadRequestException(`Category with this ${id} not found`);
    }
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    files?: Array<any>,
  ) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['parent'],
    });
    if (!category) {
      throw new BadRequestException(`Category with id ${id} not found`);
    }

    if (updateCategoryDto.parentId) {
      const parentCategory = await this.categoryRepo.findOne({
        where: { id: updateCategoryDto.parentId },
      });
      if (!parentCategory) {
        throw new BadRequestException(
          `Parent category with id ${updateCategoryDto.parentId} not found`,
        );
      }
      category.parent = parentCategory;
    }

    if (files && files.length > 0) {
      await Promise.all(
        category.images.map((img) => this.fileService.deleteFile(img)),
      );
      category.images = await Promise.all(
        files.map((file) => this.fileService.saveFile(file)),
      );
    }

    Object.assign(category, updateCategoryDto);

    return this.categoryRepo.save(category);
  }

  async remove(id: number) {
    const deletedCategory = await this.categoryRepo.findOne({ where: { id } });
    if (!deletedCategory) {
      throw new BadRequestException('Category not found');
    }
    try {
      await Promise.all(
        deletedCategory.images.map(
          async (img) => await this.fileService.deleteFile(img),
        ),
      );
    } catch (error) {
      console.log(error);
      throw new BadRequestException(`Fayllarni o‘chirishda xatolik yuz berdi`);
    }
    return { mesage: 'Category deleted succesfully' };
  }
}
