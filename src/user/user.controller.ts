import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { GiveRoleDto } from './dto/give-role.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { AuthGuard } from '../common/guards/auth.guard';
import { UserGuard } from '../common/guards/user.guard';
import { BothGuard } from '../common/guards/both.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @ApiOperation({ summary: 'Add new user' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Added',
  //   type: User,
  // })
  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  @ApiOperation({ summary: 'Give role Admin' })
  @ApiResponse({
    status: 200,
    description: 'Give role Admin',
    type: User,
  })
  @UseGuards(AdminGuard)
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('giverole')
  giveRoleAdmin(@Body() giveRole: GiveRoleDto) {
    return this.userService.giveRoleAdmin(giveRole);
  }

  @ApiOperation({ summary: 'Get all data' })
  @ApiResponse({
    status: 200,
    description: 'All user value',
    type: [User],
  })
  @UseGuards(AdminGuard)
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get one data by Id' })
  @ApiResponse({
    status: 200,
    description: 'Get one by Id',
    type: User,
  })
  @UseGuards(BothGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update one data by Id' })
  @ApiResponse({
    status: 200,
    description: 'Update by Id',
    type: User,
  })
  @UseGuards(UserGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete one data by Id' })
  @ApiResponse({
    status: 200,
    description: 'Delete by Id',
    type: Object,
  })
  @UseGuards(BothGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
