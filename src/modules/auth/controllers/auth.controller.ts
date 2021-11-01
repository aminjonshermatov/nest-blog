import {Controller, Get, Post, Request, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";

import {AuthService} from "../services/auth.service";
import {InjectRepository} from "@nestjs/typeorm";
import {AdminEntity} from "../../admin/models/admin.entity";
import {Repository} from "typeorm";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(AdminEntity) private readonly adminRepository: Repository<AdminEntity>
  ) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<{ [key: string]: string }> {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req): Promise<{ [key: string]: string }> {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('refresh')
  async refresh(@Request() req) {
    const admin = await this.adminRepository.findOne(req.user.id);
    return this.authService.login(admin);
  }
}
