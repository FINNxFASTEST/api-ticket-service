import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Priority, Status } from '@prisma/client';

export class QueryTicketDto {
    @ApiPropertyOptional({ enum: Status })
    @IsOptional()
    @IsEnum(Status)
    status?: Status;

    @ApiPropertyOptional({ enum: Priority })
    @IsOptional()
    @IsEnum(Priority)
    priority?: Priority;

    @ApiPropertyOptional({ example: 'Coldplay' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    page?: number = 1;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    pageSize?: number = 10;

    @ApiPropertyOptional({ example: 'createdAt' })
    @IsOptional()
    @IsString()
    sortBy?: 'createdAt' | 'updatedAt' | 'price' | 'priority' | 'status' | 'eventName' = 'createdAt';

    @ApiPropertyOptional({ example: 'desc' })
    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc' = 'desc';
}
