import {Module} from "@nestjs/common";
import {PassportModule} from "@nestjs/passport";

import {AdminModule} from "../admin/admin.module";
import {AuthService} from "./services/auth.service";
import {LocalStrategy} from "./services/local.strategy";
import {AuthController} from "./controllers/auth.controller";

@Module({
  imports: [
    AdminModule,
    PassportModule
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    LocalStrategy
  ]
})
export class AuthModule {

}
