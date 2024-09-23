import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId } from 'mongoose';

import { Page, PagedResult, PaginationConst } from '../../shared/pagination';
import { ProductDTO } from './products.interface';
import { Product, ProductModel } from './schema/products.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private model: ProductModel) {}

  async getAll(
    { pageIndex = 0, pageSize = PaginationConst.PAGE_SIZE }: Partial<Page> = {},
    categoryID?: string,
  ): Promise<PagedResult<Product>> {
    const total = await this.model.countDocuments().exec();
    const products = await this.model
      .aggregate([
        {
          $match:
            categoryID && isValidObjectId(categoryID)
              ? { category: categoryID }
              : {},
        },
        { $sort: { createdAt: -1 } },
        { $skip: pageSize * pageIndex },
        { $limit: pageSize },
        {
          $addFields: {
            category: { $toObjectId: '$category' },
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $project: { thumbnail: false },
        },
        {
          $addFields: {
            category: { $arrayElemAt: ['$category', 0] },
          },
        },
      ])
      .exec();

    return {
      pageIndex,
      pageSize,
      total,
      lastPage: Math.ceil(total / pageSize),
      isFinalPage: pageSize * (pageIndex + 1) >= total,
      data: products,
    };
  }

  async create(data: ProductDTO) {
    return this.model.create(data);
  }

  async uploadImage(id: string, file: Express.Multer.File) {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid product ID', HttpStatus.BAD_REQUEST);
    }

    const product = await this.model.findById(id);

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    product.thumbnail = file.buffer;
    await product.save();

    return product;
  }

  async getImage(id: string): Promise<Buffer> {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid product ID', HttpStatus.BAD_REQUEST);
    }

    const product = await this.model.findById(id, { thumbnail: 1 }).exec();

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return product.thumbnail;
  }
}
