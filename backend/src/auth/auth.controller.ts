import {Controller, Post, Body, UseGuards, Request, HttpException, HttpStatus} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/users.entity';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string, password: string }) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.NOT_FOUND);
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() user: User) {
    const newUser = await this.authService.register(user);
    return { message: 'Registration successful', user: newUser };
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: { refreshToken: string }) {
    return this.authService.refreshTokens(refreshDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
