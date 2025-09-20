import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueuesService } from './queues.service';
import { ConfigService } from '@nestjs/config';
import { NotifyProcessor } from './notify.processor';
import { SlaProcessor } from './sla.processor';


@Module({
    imports: [
        BullModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                connection: { url: config.get<string>('REDIS_URL')! },
            }),
            inject: [ConfigService],
        }),
        BullModule.registerQueue(
            { name: 'notify' },
            { name: 'sla' },
        ),
    ],
    providers: [QueuesService, NotifyProcessor, SlaProcessor],
    exports: [QueuesService, BullModule],
})
export class QueuesModule { }