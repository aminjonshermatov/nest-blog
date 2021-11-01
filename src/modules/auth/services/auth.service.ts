import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";

import {AdminRepository} from "../../admin/services/admin.repository";
import {AdminModel} from "../../admin/models/admin.model";

@Injectable()
export class AuthService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly jwtService: JwtService
  ) {
  }


  async validateAdmin(login: string, pass: string): Promise<AdminModel | null> {
    const admin = await this.adminRepository.findByLogin(login);

    if (admin && admin.password === pass) {
      const { password, ...secureAdmin } = admin;
      return secureAdmin;
    }

    return null;
  }

  async login(admin: AdminModel) {
    const payload = {id: admin.id};

    return {
      accessToken: this.jwtService.sign(payload)
    }
  }
}
