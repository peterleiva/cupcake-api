import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category';
import { Model } from 'mongoose';
import { CreateCategoryDTO } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>
  ) {}

  async getAll() {
    const data = await this.categoryModel.find().exec();

    return data;
  }

  async create(category: CreateCategoryDTO): Promise<Category> {
    const newCategory = new this.categoryModel(category);

    return newCategory.save();
  }

  async delete(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    const data = await this.categoryModel.findOneAndDelete({ _id: id }).exec();

    return data;
  }
}
