import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Response } from 'express';
import { generateTokens } from '../common/helpers/generate-token';
import { compare, hash } from 'bcrypt';
import { LogInDto } from './dto/log-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    private readonly jwtService:JwtService,
    private readonly userService:UserService
  ){}

  async updateRefreshToken(id:number, refresh_token:string) {
    const hashed_refresh_token = await hash(refresh_token, 7)
    await this.userService.updateRefreshToken(id, hashed_refresh_token)
  }

  async register (createUserDto:CreateUserDto, res:Response) {
    const newUser = await this.userService.create(createUserDto)

    if (!newUser) {
      throw new BadRequestException("Foydalanuvchini yaratib bo'lmadi");
    }

    // await this.userService.update(newUser.id, { is_active: true });
    newUser.is_active = true
    await this.userRepo.save(newUser)


    const tokens = await generateTokens(newUser, this.jwtService)
    await this.updateRefreshToken(newUser.id, tokens.refresh_token)
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true
    });

    return {id:newUser.id, access_token:tokens.access_token}
  }
  

  async login(logInDto:LogInDto, res:Response){
    const user = await this.userService.findByEmail(logInDto.email)

    if (!user) {
      throw new UnauthorizedException("Email or password incorrect")
    }

    const validePassword = await compare(
      logInDto.password,
      user.hashed_password
    )

    if (!validePassword) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    // await this.userService.update(user.id, {is_active:true})
    user.is_active = true
    await this.userRepo.save(user)

    const tokens = await generateTokens(user, this.jwtService)
    await this.updateRefreshToken(user.id, tokens.refresh_token)
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });

    return {
      message: 'User login succesfully',
      id: user.id,
      access_token: tokens.access_token,
    };
  }

  async refresh(refresh_token:string, res:Response){
    try {
      if(!refresh_token) {
        throw new UnauthorizedException("Refresh token is missing")
      }
      
      const payload = await this.jwtService.verify(refresh_token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
      if (!payload) {
        throw new UnauthorizedException('Invalid refresh token')
      }
      const user = await this.userService.findByEmail(payload.email)
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const validRefreshToken = await compare(
        refresh_token,
        user.hashed_refresh_token
      )

      if (!validRefreshToken) {
        throw new ForbiddenException('Invalid refresh token');
      }

      const tokens = await generateTokens(user, this.jwtService)
      await this.updateRefreshToken(user.id, tokens.refresh_token)
      res.cookie('refresh_token', tokens.refresh_token, {
        maxAge: Number(process.env.COOKIE_TIME),
        httpOnly: true,
      });

      return {
        message: 'Token refreshed successfully',
        id: user.id,
        access_token: tokens.access_token,
      };

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
