import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ConfigModule} from "@nestjs/config";

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {AuthModule} from "./modules/auth/auth.module";
import {AdminMenuModule} from "./modules/admin-menu/admin-menu.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot(),
    AuthModule,
    AdminMenuModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
