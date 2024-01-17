import { ConflictException, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

import { BlogUserRepository } from '../blog-user/blog-user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { AUTH_USER_EXISTS } from './authentication.constant';
import { BlogUserEntity } from '../blog-user/blog-user.entity';

@Injectable()
export class AuthenticationService {
  constructor(private readonly blogUserRepository: BlogUserRepository) {}

  public async register(dto: CreateUserDto) {
    const { email, firstName, lastName, password } = dto;

    const blogUser = {
      email,
      firstName,
      lastName,
      avatar: '',
      passwordHash: '',
      registartionDate: dayjs().toDate(),
      postsNumber: 0,
      subscribers: 0,
    };

    const existUser = await this.blogUserRepository.findByEmail(email);

    if (existUser) {
      throw new ConflictException(AUTH_USER_EXISTS);
    }

    const userEntity = await new BlogUserEntity(blogUser).setPassword(password);

    return this.blogUserRepository.save(userEntity);
  }
}
