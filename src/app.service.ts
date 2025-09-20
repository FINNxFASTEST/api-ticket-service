import { Injectable } from '@nestjs/common';
const uptime = new Date().toISOString()


@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }

    getUptime() : string {
        return uptime
    }
}
