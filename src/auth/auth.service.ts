import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { compare } from 'bcrypt';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  // constructor(
  //   @InjectRepository(User) private readonly usersRepository: Repository<User>,
  // ) {}

  authenticateUser(user: User, loginUserDto: LoginUserDto) {
    return compare(loginUserDto.password, user.password);
  }
}
