import { Controller, Get, Post, Req, Res, Render, Body } from "@nestjs/common";
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { User } from "../../types/user/user.type";

@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Get('login')
  @Render('login')
  getLogin(@Req() req: Request, @Res() res: Response) {
    if (req.session.user) {
      return res.redirect('/keywords');
    }

    return {};
  }

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response, @Body() body: User) {
    const user = await this.usersService.findOne(body?.email);

    if (!user) {
      return res.render('login', { error: 'Invalid credentials' });
    }

    const isEqualPassword = await this.usersService.comparePasswords(body?.password, user.password)

    if (user && isEqualPassword) {
      req.session.user = { userId: user.id, email: user.email };
      return res.redirect('/keywords');
    }

    return res.render('login', { error: 'Invalid credentials' });;
  }
}