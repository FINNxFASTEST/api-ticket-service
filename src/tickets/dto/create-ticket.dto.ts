import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Priority } from '@prisma/client';

export class CreateTicketDto {


    @ApiProperty({ example: 'Coldplay World Tour 2025' })
    @IsString()
    @MinLength(5)
    @MaxLength(200)
    title!: string;

    @ApiProperty({ example: 'VIP Front Row seat', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(5000)
    description?: string;

    @ApiProperty({ example: 'A12' })
    @IsString()
    seatNumber!: string;

    @ApiProperty({ example: 3500 })
    @IsNumber()
    price!: number;

    @ApiProperty({ example: 'THB', default: 'THB' })
    @IsOptional()
    @IsString()
    currency?: string;

    @ApiProperty({ enum: Priority, required: false, example: Priority.MEDIUM })
    @IsOptional()
    @IsEnum(Priority)
    priority?: Priority;
}
