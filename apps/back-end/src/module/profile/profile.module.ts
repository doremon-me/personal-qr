import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { PrismaModule } from '@common/prisma/prisma.module';
import { ProfileController } from './profile.controller';

@Module({
  imports: [PrismaModule],
  providers: [ProfileService],
  controllers: [ProfileController]
})
export class ProfileModule { }
