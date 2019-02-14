import Container, { Service, Inject } from "typedi";
import { EventEmitter } from "eventemitter3"; 

@Service()
export class EventsService {
  private events = new EventEmitter();

  emit(event: string, data: any): boolean {
    return this.events.emit(event, data);
  }

  use(handlers: Array<any>) {
    if (handlers) {
      handlers.forEach((handler: any) => {
        let eh: any = Container.get(handler);
        this.events.on(eh.event, function(data: any) {
          eh.handler(data);
        });
      });
    }
  }

  remove(event?: string) {
    this.events.removeAllListeners(event);
  }
}
