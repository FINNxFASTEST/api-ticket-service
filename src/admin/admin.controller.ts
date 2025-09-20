import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { QueuesService } from '../queues/queues.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly queues: QueuesService) {}

  @Get('queues/:name/stats')
  async getQueueStats(@Param('name') name: string) {
    const queue = this.queues.getQueue(name);
    if (!queue) {
      throw new NotFoundException(`Queue "${name}" not found`);
    }
    return queue.getJobCounts(); // { waiting, active, completed, failed, delayed }
  }
}
