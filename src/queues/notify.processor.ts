import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';


@Processor('notify')
export class NotifyProcessor extends WorkerHost {
    async process(job: Job) {
        const { ticketId } = job.data as { ticketId: string };
        // Mock notify: log/console
        console.log(`[Notify] ticketId=${ticketId} (jobId=${job.id})`);
        return { notified: true };
    }
}