import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { GiveRoleDto } from './dto/give-role.dto';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const condidate = await this.userRepo.findOne({
        where: { email: createUserDto.email },
      });

      if (condidate) {
        throw new BadRequestException('Bunday foydalanuvchi mavjud');
      }

      if (createUserDto.password !== createUserDto.confirm_password) {
        throw new BadRequestException('Parol mos kelmadi');
      }

      const hashed_password = await hash(createUserDto.password, 7);
      const newUSer = await this.userRepo.save({
        ...createUserDto,
        hashed_password,
      });

      return newUSer;
    } catch (error) {
      console.log(error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException({
          message: 'Phone number already exists.',
        });
      } else if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          message: 'An internal server error occurred.',
        });
      }
    }
  }

  async findAll() {
    return this.userRepo.find();
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return this.userRepo.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userRepo.findOne({ where: { id } });
    if (!updatedUser) {
      throw new BadRequestException('Bunday foydalanuvchi mavjud emas');
    }

    if (
      (updateUserDto.password && !updateUserDto.confirm_password) ||
      (!updateUserDto.password && updateUserDto.confirm_password)
    ) {
      throw new BadRequestException(
        'Confirm password yoki password mavjud emas',
      );
    }

    let hashed_password: string | undefined = undefined;
    if (updateUserDto.password && updateUserDto.confirm_password) {
      if (updateUserDto.password !== updateUserDto.confirm_password) {
        throw new BadRequestException('Parol mos kelmadi');
      }
      hashed_password = await hash(updateUserDto.password, 7);
    }

    delete updateUserDto.confirm_password;
    delete updateUserDto.password;

    await this.userRepo.update(id, {
      ...updateUserDto,
      ...(hashed_password && { hashed_password: hashed_password }),
    });
    const updated = await this.userRepo.findOne({ where: { id } });
    return updated;
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.userRepo.delete(id);
    return { message: `User with ${id} deleted succesfully` };
  }

  async giveRoleAdmin(giveRoleDto: GiveRoleDto) {
    const condidate = await this.userRepo.findOne({where :{email:giveRoleDto.email}})
    if (!condidate) {
      throw new BadRequestException("User with this email not found")
    }
    await this.userRepo.update({ email: giveRoleDto.email }, { role: UserRole.ADMIN });
    const newAdmin = await this.userRepo.findOne({ where: { email: giveRoleDto.email } });
    return newAdmin;
  }

  async updateRefreshToken(id:number, hashed_refresh_token:string) {
    await this.userRepo.update(id, { hashed_refresh_token });
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }
}
