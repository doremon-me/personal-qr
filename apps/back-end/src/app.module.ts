import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { AdminModule } from './module/admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './module/user/user.module';
import { JwtMiddleware } from './middleware/jwt.middleware';
import { TokenModule } from '@common/token/token.module';
import { BullModule } from '@nestjs/bullmq';
import { OtpModule } from './module/otp/otp.module';
import { ResetPassMiddleware } from './middleware/resetpass.middleware';
import { ProfileModule } from './module/profile/profile.module';
import { VerifyMiddleware } from './middleware/verify.middleware';
import { QrModule } from './module/qr/qr.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '24h' }
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.BULLMQ_REDIS_HOST,
        port: process.env.BULLMQ_REDIS_PORT,
      }
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    AdminModule,
    UserModule,
    TokenModule,
    OtpModule,
    ProfileModule,
    QrModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
    consumer.apply(ResetPassMiddleware).forRoutes('auth/resetPassword');
    consumer.apply(VerifyMiddleware).forRoutes(
      {
        path: "user/createProfile", method: RequestMethod.POST
      },
      {
        path: "user/updateProfile", method: RequestMethod.PATCH
      },
      {
        path: "user/fetchProfile", method: RequestMethod.GET
      },
      {
        path: "user/delete", method: RequestMethod.DELETE
      },
    );
  }
}
