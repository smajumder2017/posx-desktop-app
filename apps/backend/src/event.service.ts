import { Injectable } from '@nestjs/common';
import { fromEvent } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventsService {
  constructor(private readonly emitter: EventEmitter2) {
    // Inject some Service here and everything about SSE will stop to work.
  }

  subscribe(eventName: string) {
    return fromEvent(this.emitter, eventName);
  }

  async emit(eventName: string, data) {
    this.emitter.emit(eventName, data);
  }
}
