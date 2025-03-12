import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './entities/category.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FormDataDto } from './dto/form-data.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Add new category' })
  @ApiResponse({
    status: 201,
    description: 'Added',
    type: Category,
  })
  @UseGuards(AdminGuard)
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  @Post()
  create(@Body() formDataDto: FormDataDto, @UploadedFiles() files: Array<any>) {
    return this.categoryService.create({ ...formDataDto }, files);
  }

  @ApiOperation({ summary: 'Get all data' })
  @ApiResponse({
    status: 200,
    description: 'All category value',
    type: [Category],
  })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'Get one data by Id' })
  @ApiResponse({
    status: 200,
    description: 'Get one by Id',
    type: Category,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update one data by Id' })
  @ApiResponse({
    status: 200,
    description: 'Update by Id',
    type: Category,
  })
  @UseGuards(AdminGuard)
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() formDataDto: FormDataDto,
    @UploadedFiles() files: Array<any>,
  ) {
    return this.categoryService.update(+id, { ...formDataDto }, files);
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
    return this.categoryService.remove(+id);
  }
}
