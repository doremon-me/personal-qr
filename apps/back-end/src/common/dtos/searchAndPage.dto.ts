import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class SearchAndPaginationDto {
  @IsString()
  @IsOptional()
  search: string;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsOptional()
  page: number = 1;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsOptional()
  limit: number = 10;

  @IsString()
  @IsOptional()
  orderBy: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'orderDirection must be either "asc" or "desc"',
  })
  @Transform(({ value }) => value?.toLowerCase() || 'asc')
  orderDirection: 'asc' | 'desc' = 'asc';
}
