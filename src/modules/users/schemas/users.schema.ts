import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

import { digester } from '@security';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: String,
    required: true,
    index: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    index: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    select: false,
  })
  digest?: string;

  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('password');
UserSchema.path('digest').select(false);

UserSchema.pre<UserDocument>('save', function (next) {
  if (this.password) {
    this.digest = digester(this.password);
  }

  next();
});

export type UserModel = Model<User>;
