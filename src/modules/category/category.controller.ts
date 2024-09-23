import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './schema/category';
import { CreateCategoryDTO } from './category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  getAll(): Promise<Category[]> {
    return this.categoryService.getAll();
  }

  @Post()
  create(@Body() category: CreateCategoryDTO): Promise<Category> {
    return this.categoryService.create(category);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Category> {
    return this.categoryService.delete(id);
  }
}
