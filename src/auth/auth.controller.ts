import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ValidationError } from 'yup';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { createUserValidationSchema } from '../users/dto/create-user.dto';
import { hash } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import {
  LoginUserDto,
  loginUserValidationSchema,
} from '../users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('me')
  async me(@Session() session: Record<string, any>) {
    return session;
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Session() session: Record<string, any>,
  ) {
    try {
      loginUserValidationSchema.validate(loginUserDto);
    } catch (err) {
      if (err instanceof ValidationError) return { error: err.errors[0] };
    }

    const user = await this.usersRepository.findOne({
      where: { email: loginUserDto.email },
    });

    if (!user) return { error: 'That user does not exist' };

    const authenticatedSucessfully = await this.authService.authenticateUser(
      user,
      loginUserDto,
    );

    if (!authenticatedSucessfully) {
      return { error: 'Invalid credentials.' };
    }

    session.userId = user.id;
    session.username = user.username;

    return { sucess: true };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      await createUserValidationSchema.validate(createUserDto);
    } catch (err) {
      if (err instanceof ValidationError) return { error: err.errors[0] };
    }

    const emailAlreadyRegistered = !!(await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    }));

    if (emailAlreadyRegistered)
      return { error: 'That email is already registered' };

    const usernameAlreadyRegistered = !!(await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    }));

    if (usernameAlreadyRegistered)
      return { error: 'That username is already registered' };

    const hashedPassword = await hash(createUserDto.password, 12);

    const user = await this.usersService.createUser({
      email: createUserDto.email,
      username: createUserDto.username,
      password: hashedPassword,
    });

    if (!user) return { error: 'Something went wrong. Please try again later' };

    return { success: true };
  }
}
