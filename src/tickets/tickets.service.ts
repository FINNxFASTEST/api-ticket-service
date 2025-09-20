import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { QueryTicketDto } from './dto/query-ticket.dto';
import { paginate } from '../common/pagination';
import { Priority, Status } from '@prisma/client';
import { QueuesService } from '../queues/queues.service';

@Injectable()
export class TicketsService {
    constructor(private prisma: PrismaService, private queues: QueuesService) { }

    async create(dto: CreateTicketDto) {
        const ticket = await this.prisma.ticket.create({
            data: {
                title: dto.title,
                description: dto.description ?? null,
                seatNumber: dto.seatNumber,
                price: dto.price,
                currency: dto.currency ?? 'THB',
                priority: dto.priority ?? Priority.MEDIUM,
                status: Status.OPEN,
            },
        });

        // Enqueue jobs
        await this.queues.enqueueNotify(ticket.id);
        await this.queues.enqueueSla(ticket.id);

        return ticket;
    }

    async findAll(q: QueryTicketDto) {
        const { skip, take } = paginate(q.page, q.pageSize);

        const where = {
            ...(q.status ? { status: q.status } : {}),
            ...(q.priority ? { priority: q.priority } : {}),
            ...(q.search
                ? {
                    OR: [
                        { title: { contains: q.search, } },
                        { description: { contains: q.search, } },
                    ],
                }
                : {}),
        } as const;

        const orderBy = [{ [q.sortBy ?? 'createdAt']: q.sortOrder ?? 'desc' }];

        const [items, total] = await this.prisma.$transaction([
            this.prisma.ticket.findMany({ where, skip, take, orderBy }),
            this.prisma.ticket.count({ where }),
        ]);

        return { items, total, page: q.page ?? 1, pageSize: q.pageSize ?? 10 };
    }

    async findOne(id: string) {
        const ticket = await this.prisma.ticket.findUnique({ where: { id } });
        if (!ticket) throw new NotFoundException('Ticket not found');
        return ticket;
    }

    async update(id: string, dto: UpdateTicketDto) {
        const before = await this.findOne(id);

        const updated = await this.prisma.ticket.update({
            where: { id },
            data: {
                title: dto.title ?? before.title,
                description: dto.description ?? before.description,
                seatNumber: dto.seatNumber ?? before.seatNumber,
                price: dto.price ?? before.price,
                currency: dto.currency ?? before.currency,
                priority: dto.priority ?? before.priority,
                status: dto.status ?? before.status,
            },
        });

        if (dto.status === Status.RESOLVED && before.status !== Status.RESOLVED) {
            await this.queues.removeSlaJob(id);
        }

        return updated;
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.ticket.delete({ where: { id } });

        try {
            await this.queues.removeSlaJob(id);
        } catch { }

        return { ok: true };
    }
}
