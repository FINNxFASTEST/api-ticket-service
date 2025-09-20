import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Priority, Status } from '@prisma/client';

export class UpdateTicketDto {
    @ApiPropertyOptional({ example: 'Coldplay World Tour 2025 (Rescheduled)' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    title?: string;

    @ApiPropertyOptional({ example: 'Seat upgraded to VIP' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 'B15' })
    @IsOptional()
    @IsString()
    seatNumber?: string;

    @ApiPropertyOptional({ example: 4500 })
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiPropertyOptional({ example: 'USD' })
    @IsOptional()
    @IsString()
    currency?: string;

    @ApiPropertyOptional({ enum: Priority, example: Priority.HIGH })
    @IsOptional()
    @IsEnum(Priority)
    priority?: Priority;

    @ApiPropertyOptional({ enum: Status, example: Status.IN_PROGRESS })
    @IsOptional()
    @IsEnum(Status)
    status?: Status;
}
