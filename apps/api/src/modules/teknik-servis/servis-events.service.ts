import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

export interface ServisEvent {
  type: 'new_request' | 'status_change' | 'assignment';
  data: any;
}

@Injectable()
export class ServisEventsService {
  private events = new Subject<ServisEvent>();

  emit(type: ServisEvent['type'], data: any) {
    this.events.next({ type, data });
  }

  subscribe(): Observable<ServisEvent> {
    return this.events.asObservable();
  }
}
