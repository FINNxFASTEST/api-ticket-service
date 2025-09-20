import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TicketsModule } from './tickets/tickets.module';
import { QueuesModule } from './queues/queues.module';
import { AdminController } from './admin/admin.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        QueuesModule,
        TicketsModule,
    ],
    providers : [ AppService ],
    controllers: [AppController,AdminController],
})
export class AppModule { }