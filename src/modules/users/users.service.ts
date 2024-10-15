import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { CreateUsersDTO } from './interfaces';
import { User, UserModel } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private model: UserModel) {}

  getUsers() {
    return this.model.find();
  }

  getUser(id: string) {
    console.log('id => ', id);

    return this.model.findById(id);
  }

  createUser(dto: CreateUsersDTO) {
    return this.model.create(dto);
  }

  getUserbyEmail(email: string) {
    return this.model.findOne({ email }, { digest: 1 });
  }
}
