import { 
  BadRequestException, 
  Body, 
  Controller, 
  Delete, 
  Get, 
  InternalServerErrorException, 
  NotFoundException, 
  Param, 
  Post, 
  Put 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.usersService.findOneById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.name === 'BSONError' || error.message.includes('invalid ObjectId')) {
        throw new BadRequestException('Format d\'ID utilisateur invalide');
      }
      throw new InternalServerErrorException('Une erreur est survenue lors de la récupération de l\'utilisateur');
    }
  }

  @Get('email/:email')
  async findOneByEmail(@Param('email') email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  @Get('active')
  findActive() {
    return this.usersService.findActive();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Put('activate')
  async activateAccount(@Body() body: { email: string; password: string }) {
    try {
      return await this.usersService.activateAccount(body.email, body.password);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }
}
