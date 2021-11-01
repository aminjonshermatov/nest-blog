import {Module} from "@nestjs/common";
import {PassportModule} from "@nestjs/passport";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";

import {AdminModule} from "../admin/admin.module";
import {AuthService} from "./services/auth.service";
import {LocalStrategy} from "./services/local.strategy";
import {AuthController} from "./controllers/auth.controller";
import {JwtStrategy} from "./services/jwt.strategy";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AdminEntity} from "../admin/models/admin.entity";

@Module({
  imports: [
    AdminModule,
    PassportModule,
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN')
        }
      })
    }),
    TypeOrmModule.forFeature([
      AdminEntity
    ])
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy
  ]
})
export class AuthModule {

}
