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
    {
      category = '',
      favorites,
      searchterm,
    }: { category?: string; favorites: boolean; searchterm?: string },
    { pageIndex = 0, pageSize = PaginationConst.PAGE_SIZE }: Partial<Page> = {},
  ): Promise<PagedResult<Product>> {
    const total = await this.model.countDocuments().exec();
    const products = await this.model
      .aggregate([
        {
          $match:
            category && isValidObjectId(category) ? { category: category } : {},
        },
        {
          $match: {
            favorite: favorites || { $in: [false, null, true] },
          },
        },
        {
          $match: {
            name: new RegExp(searchterm ?? '', 'ig'),
          },
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
      data: products.map((p) => ({
        ...p,
        thumbnail: p.thumbnail
          ? `data:image/jpeg;base64,${p.thumbnail?.toString('base64')}`
          : undefined,
      })),
    };
  }

  async create(data: ProductDTO) {
    return this.model.create(data);
  }

  async uploadImage(id: string, file: Express.Multer.File) {
    const product = await this.getProductById(id);

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

    if (!product.thumbnail) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }

    return product.thumbnail;
  }

  async getProductById(id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid product ID', HttpStatus.BAD_REQUEST);
    }

    const product = await this.model.findById(id).exec();

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  addToFavorite(id: string): Promise<void> {
    return this.setFavorite(id, true);
  }

  removeFromFavorite(id: string): Promise<void> {
    return this.setFavorite(id, false);
  }

  private async setFavorite(id: string, favorite: boolean) {
    const product = await this.getProductById(id);
    product.favorite = favorite;

    await product.save();
  }
}
