import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { dashcase } from 'src/shared/utils';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  timestamps: true,
})
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({
    unique: true,
    set: dashcase,
    default: function () {
      return this.name;
    },
  })
  slug: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

export type CategoryModel = Model<Category>;
