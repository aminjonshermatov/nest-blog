import { Module } from '@nestjs/common';

import {AdminRepository} from './services/admin.repository';

@Module({
  providers: [AdminRepository],
  exports: [AdminRepository]
})
export class AdminModule { }
