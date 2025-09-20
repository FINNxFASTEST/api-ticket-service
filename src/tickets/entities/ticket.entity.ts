import { Priority, Status } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TicketEntity {
    @ApiProperty({ example: 'clzw12abc0001xj9zt3qyzc9q' })
    id: string;

    @ApiProperty({ example: 'Coldplay World Tour 2025' })
    title: string;

    @ApiProperty({ example: 'VIP Front Row seat', required: false })
    description?: string | null;

    @ApiProperty({ example: 'A12' })
    seatNumber: string;

    @ApiProperty({ example: 3500 })
    price: number;

    @ApiProperty({ example: 'THB' })
    currency: string;

    @ApiProperty({ enum: Priority, example: Priority.MEDIUM })
    priority: Priority;

    @ApiProperty({ enum: Status, example: Status.OPEN })
    status: Status;

    @ApiProperty({ example: '2025-09-20T14:50:21.123Z' })
    createdAt: Date;

    @ApiProperty({ example: '2025-09-20T14:50:21.123Z' })
    updatedAt: Date;
}
