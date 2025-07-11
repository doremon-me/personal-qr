import { PrismaService } from '@common/prisma/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FindOneDto } from './dto/findOne.dto';

@Injectable()
export class AdminService {
    constructor(private readonly prismaService: PrismaService) { }
    async findOne(findOneDto: FindOneDto) {
        try {
            return await this.prismaService.admin.findFirst({
                where: {
                    OR: [
                        { number: findOneDto.number || undefined },
                        { id: findOneDto.id || undefined }
                    ]
                }
            });
        } catch (error) {
            throw new InternalServerErrorException('Error finding admin');
        }
    }
}
