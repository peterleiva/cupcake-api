import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PaginationConst } from '../../shared/pagination';
import { ProductDTO } from './products.interface';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private service: ProductsService) {}

  @Get()
  getAll(
    @Query('page') pageIndex: number,
    @Query('limit') pageSize: number,
    @Query('category') categoryID: string,
    @Query('favorites', {
      transform: (value) => (value === 'true' || value === '1' ? true : false),
    })
    favorites: boolean,
    @Query('searchterm')
    searchterm?: string,
  ) {
    return this.service.getAll(
      { category: categoryID, favorites, searchterm },
      {
        pageIndex: +pageIndex || 0,
        pageSize: +pageSize || PaginationConst.PAGE_SIZE,
      },
    );
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getProductById(id);
  }

  @Post()
  create(@Body() data: ProductDTO) {
    return this.service.create(data);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(
    @Param('id') id: string,

    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: Math.pow(1024, 2) * 2 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.service.uploadImage(id, file);
  }

  @Get(':id/image')
  async getImage(@Param('id') id: string) {
    const imageBuffer = await this.service.getImage(id);

    return 'data:image/jpeg;base64' + imageBuffer.toString('base64');
  }

  @Post(':id/favorite')
  addToFavorite(@Param('id') id: string) {
    return this.service.addToFavorite(id);
  }

  @Delete(':id/favorite')
  removeFromFavorite(@Param('id') id: string) {
    return this.service.removeFromFavorite(id);
  }
}
