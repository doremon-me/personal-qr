import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@generated/prisma';
import { hash } from "bcrypt";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      await this.seedDatabase();
      Logger.log('Connection successful......');
    } catch (err) {
      Logger.error('Could not connect to MongoDB:', err);
      process.exit(1);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async seedDatabase() {
    const existingAdmin = await this.admin.count();
    if (!existingAdmin) {
      const hashedPassword = await hash("admin123", 6);
      await this.admin.create({
        data: {
          firstName: "Admin",
          lastName: "User",
          number: "9876543210",
          password: hashedPassword,
        }
      });
      Logger.log('Admin user created with default credentials.');
    } else {
      Logger.log('Admin user already exists, skipping creation.');
    }
  }
}
