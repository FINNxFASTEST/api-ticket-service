import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';


@Processor('sla')
export class SlaProcessor extends WorkerHost {
    async process(job: Job) {
        const { ticketId } = job.data as { ticketId: string };
        // SLA check mock
        console.log(`[SLA] Check SLA for ticketId=${ticketId} (jobId=${job.id})`);
        // Here you could query DB and mark breach, send alerts, etc.
        return { checked: true };
    }
}