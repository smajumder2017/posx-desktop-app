import { Injectable } from '@nestjs/common';
// import isOnline from 'is-online';
import { EventsService } from './event.service';

@Injectable()
export class AppService {
  constructor(private readonly eventService: EventsService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getOnlineStatus() {
    const { default: isOnline } = await import('is-online');
    const online = await isOnline();
    console.log(online);
    this.eventService.emit('onlineStatus', { online });
  }
}
