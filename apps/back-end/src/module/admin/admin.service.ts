import { PrismaService } from '@common/prisma/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class AdminService {
    constructor(private readonly prismaService: PrismaService) { }
    async findAdmin(number: string) {
        try {
            return await this.prismaService.admin.findUnique({
                where: {
                    number: number,
                }
            });
        } catch (error) {
            throw new InternalServerErrorException('Error finding admin');
        }
    }
}
