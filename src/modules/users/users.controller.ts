import { Body, Controller, Get, Post } from '@nestjs/common';
import type { CreateUsersDTO } from './interfaces';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get()
  getUsers() {
    return this.service.getUsers();
  }

  @Get(':id')
  getById(id: string) {
    return this.service.getUser(id);
  }

  @Post()
  create(@Body() dto: CreateUsersDTO) {
    return this.service.createUser(dto);
  }
}
