import { PrismaService } from '@common/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
    constructor(private readonly prismaService: PrismaService) { }
    async findAdmin(number: string) {
        return await this.prismaService.admin.findUnique({
            where: {
                number: number,
            }
        });
    }
}
