import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

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
  ) {
    return this.service.getAll(
      {
        pageIndex: +pageIndex || 0,
        pageSize: +pageSize || PaginationConst.PAGE_SIZE,
      },
      categoryID,
    );
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
  async getImage(@Param('id') id: string, @Res() res: Response) {
    res.type('image/jpeg');
    const imageBuffer = await this.service.getImage(id);

    return res.send(imageBuffer);
  }
}
