import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { QueuesModule } from '../queues/queues.module';


@Module({
    imports: [QueuesModule],
    controllers: [TicketsController],
    providers: [TicketsService],
})
export class TicketsModule { }