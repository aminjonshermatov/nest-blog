import {Injectable} from "@nestjs/common";
import {AdminModel} from "../models/admin.model";

@Injectable()
export class AdminRepository {
  private readonly _admins: AdminModel[] = [];

  constructor() {
    this._admins.push({
      id: 1,
      login: 'aminjon',
      password: 'pass'
    });
  }

  async findByLogin(login: string): Promise<AdminModel | undefined> {
    return this._admins.find(admin => admin.login === login);
  }
}
