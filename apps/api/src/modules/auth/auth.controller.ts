import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, SetupDto, CreateUserDto } from './dto/login.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get('setup-check')
  checkSetup() {
    return this.authService.checkSetup();
  }

  @Public()
  @Post('setup')
  setup(@Body() dto: SetupDto) {
    return this.authService.setup(dto.username, dto.password);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password);
  }

  @ApiBearerAuth()
  @Get('me')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @ApiBearerAuth()
  @Get('users')
  getUsers() {
    return this.authService.getUsers();
  }

  @ApiBearerAuth()
  @Post('users')
  createUser(@Body() dto: CreateUserDto) {
    return this.authService.createUser(dto.username, dto.password, dto.role);
  }

  @ApiBearerAuth()
  @Roles('SUPER_ADMIN')
  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(+id);
  }
}
