import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueuesService {
    constructor(
        @InjectQueue('notify') private readonly notifyQueue: Queue,
        @InjectQueue('sla') private readonly slaQueue: Queue,
    ) { }

    /**
     * Enqueue a notification job for a ticket
     */
    async enqueueNotify(ticketId: string) {
        await this.notifyQueue.add(
            'notify',
            { ticketId },
            {
                jobId: `notify-${ticketId}`,
                attempts: 3,
                backoff: { type: 'exponential', delay: 3000 },
                removeOnComplete: true,
                removeOnFail: false,
            },
        );
    }

    /**
     * Enqueue an SLA check job (delayed)
     */
    async enqueueSla(ticketId: string) {
        await this.slaQueue.add(
            'sla',
            { ticketId },
            {
                jobId: `sla-${ticketId}`,
                delay: 15 * 60 * 1000,
                removeOnComplete: true,
                removeOnFail: false,
            },
        );
    }

    /**
     * Remove SLA job (เมื่อ ticket ถูก resolve)
     */
    async removeSlaJob(ticketId: string) {
        const job = await this.slaQueue.getJob(`sla-${ticketId}`);
        if (job) {
            await job.remove();
        }
    }

    /**
     * Get queue instance by name
     */
    getQueue(name: string): Queue | undefined {
        switch (name) {
            case 'notify':
                return this.notifyQueue;
            case 'sla':
                return this.slaQueue;
            default:
                return undefined;
        }
    }
}
