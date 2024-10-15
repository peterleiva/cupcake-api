import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import type { CreateUsersDTO } from './interfaces';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get()
  getUsers() {
    return this.service.getUsers();
  }

  @Get(':id')
  getById(id: number) {
    return this.service.getUser(id);
  }

  @Post()
  create(@Body() dto: CreateUsersDTO) {
    return this.service.createUser(dto);
  }
}
