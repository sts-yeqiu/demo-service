import Container, { Service } from "typedi";

/**
 * MQService Service.
 */
@Service()
export class MQService {
  private bus: any;
  constructor() { }
 
  /**
   * send message to queue.
   * @param event
   * @param data
   */
  send(event: string, data: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.bus.send(event, data);
      resolve();
    });
  }

  /**
   * publish message to queue.
   * @param event
   * @param data
   */
  publish(event: string, data: any) {
    this.bus.publish(event, data);
  }

  /**
   * register listening handlers.
   * @param handlers 
   */
  listen(handlers: Array<any>) {
    if (handlers) {
      handlers.forEach((handler: any) => {
        let eh: any = Container.get(handler);
        this.bus.listen(eh.event, function (data: any) {
          eh.handler(data);
        });
      });
    }
  }

  /**
   * register subscribe handlers.
   * @param handlers 
   */
  subscribe(handlers: Array<any>) {
    if (handlers) {
      handlers.forEach((handler: any) => {
        let eh: any = Container.get(handler);
        this.bus.subscribe(eh.event, function (data: any) {
          eh.handler(data);
        });
      });
    }
  }

  /**
   * connect to mq service.
   * @param options
   */
  connect(options?: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.bus = require("servicebus").bus(options);
      this.bus.on("ready", function () {
        resolve();
      });
    });
  }

  /**
   * disconnect m service.
   */
  disconnect() {
    this.bus.close();
  } 

}
