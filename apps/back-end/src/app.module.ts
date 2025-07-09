import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { AdminModule } from './module/admin/admin.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '24h' }
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    AdminModule,
  ],
})
export class AppModule { }
