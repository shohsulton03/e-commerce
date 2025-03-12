import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Response } from 'express';
import { LogInDto } from './dto/log-in.dto';
import { CookieGetter } from '../common/decorators/cookie-getter.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register new User' })
  @ApiResponse({
    status: 201,
    description: 'Registered',
    type: Object,
  })
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(createUserDto, res);
  }

  @ApiOperation({ summary: 'Log in User' })
  @ApiResponse({
    status: 200,
    description: 'Loh in',
    type: Object,
  })
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() logInDto: LogInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(logInDto, res);
  }

  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse({
    status: 200,
    description: 'Refresh',
    type: Object,
  })
  @HttpCode(200)
  @Post('refresh')
  async refresh(
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(refresh_token, res);
  }
}
