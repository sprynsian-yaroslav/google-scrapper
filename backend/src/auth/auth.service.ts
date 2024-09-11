import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.entity';
import {jwtConstants} from "./constants";

@Injectable()
export class AuthService {
  constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
      private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }), // Refresh токен з іншим терміном дії
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: jwtConstants.secret });
      const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
      if (!user) {
        throw new Error('User not found');
      }
      return this.login(user);
    } catch (e) {
      throw new Error('Invalid refresh token');
    }
  }

  async register(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    return this.usersRepository.save(user);
  }
}
