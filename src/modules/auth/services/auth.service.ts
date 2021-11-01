import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

import {AdminEntity} from "../../admin/models/admin.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(AdminEntity) private readonly adminRepository: Repository<AdminEntity>
  ) {
  }


  async validateAdmin(login: string, pass: string): Promise<AdminEntity | null> {
    const admin = await this.adminRepository.findOne({ where: { login } });

    if (admin && await bcrypt.compare(pass, admin.passwordHash)) {
      const { passwordHash, ...secureAdmin } = admin;
      return secureAdmin;
    }

    return null;
  }

  async login(admin: AdminEntity) {
    const payload = {id: admin.id};

    return {
      accessToken: this.jwtService.sign(payload)
    }
  }
}
