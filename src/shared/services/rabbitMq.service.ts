import * as amqp from "amqplib";
import { Options, Message, Replies } from "amqplib";

/**
 * Exchange type enum
 */
export enum ExchangeType {
  topic = "topic",
  direct = "direct",
  fanout = "fanout"
}

/**
 * A queue consumer
 */
export interface QueueConsumer {
  queue: string;
  onMessage: (msg: Message | null) => any;
}

/**
 * A exchange consumer
 */
export interface ExchageConsumer {
  exchange: string;
  type: ExchangeType;
  queue: string;
  pattern: string;
  onMessage: (msg: Message | null) => any;
}

/**
 * RabbitMQ Service
 *
 */
export class RabbitMQService {
  constructor() {}

  /**
   * Assert a queue.
   * @param url
   * @param queue
   * @param options
   */
  assertQueue(
    url: string,
    queue: string,
    options?: Options.AssertQueue
  ): Promise<Replies.AssertQueue> {
    return new Promise<Replies.AssertQueue>(async (resolve, reject) => {
      let conn = await amqp.connect(url);
      let channel = await conn.createChannel();
      channel
        .assertQueue(queue, options)
        .then(value => {
          resolve(value);
        })
        .catch(error => {
          reject(error);
        })
        .finally(async () => {
          await channel.close();
          await conn.close();
        });
    });
  }

  /**
   * Assert a exchange.
   * @param url
   * @param exchange
   * @param type
   * @param options
   */
  assertExchange(
    url: string,
    exchange: string,
    type: ExchangeType | string,
    options?: Options.AssertExchange
  ): Promise<Replies.AssertExchange> {
    return new Promise<Replies.AssertExchange>(async (resolve, reject) => {
      let conn = await amqp.connect(url);
      let channel = await conn.createChannel();
      channel
        .assertExchange(exchange, type, options)
        .then(value => {
          resolve(value);
        })
        .catch(error => {
          reject(error);
        })
        .finally(async () => {
          await channel.close();
          await conn.close();
        });
    });
  }

  /**
   * send a message to a named queue.
   * @param queue
   * @param content
   * @param options
   */
  sendToQueue(
    url: string,
    queue: string,
    content: Buffer,
    options?: Options.Publish
  ): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        let conn = await amqp.connect(url);
        let channel = await conn.createChannel();
        await channel.assertQueue(queue);
        await channel.sendToQueue(queue, content);
        await channel.close();
        await conn.close();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * send a message to a exchange.
   * @param exchange
   * @param routingKey
   * @param content
   * @param options
   */
  sendToExchange(
    url: string,
    exchange: string,
    type: ExchangeType | string,
    routingKey: string,
    content: Buffer,
    options?: Options.Publish
  ): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        let conn = await amqp.connect(url);
        let channel = await conn.createChannel();
        await channel.assertExchange(exchange, type);
        await channel.publish(exchange, routingKey, content, options);
        await channel.close();
        await conn.close();
        resolve(true);
      } catch (error) {
        reject(error);
      }
      resolve(false);
    });
  }

  /**
   * register queue consumers.
   * @param url
   * @param queueConsumer
   * @param options
   */
  registerQueueConsumer(
    url: string,
    queueConsumers: Array<QueueConsumer>,
    options?: Options.Consume
  ): Promise<amqp.Connection> {
    return new Promise<amqp.Connection>(async (resolve, reject) => {
      try {
        let conn = await amqp.connect(url);
        let channel = await conn.createChannel();

        queueConsumers.forEach(async qc => {
          await channel.assertQueue(qc.queue);
          channel.consume(qc.queue, qc.onMessage, { noAck: true });
        });

        resolve(conn);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * register exchange consumers
   * @param url
   * @param exchangeConsumer
   * @param options
   */
  registerExchangeConsumer(
    url: string,
    exchangeConsumers: Array<ExchageConsumer>,
    options?: Options.Consume
  ): Promise<amqp.Connection> {
    return new Promise<amqp.Connection>(async (resolve, reject) => {
      try {
        let conn = await amqp.connect(url);
        let channel = await conn.createChannel();

        exchangeConsumers.forEach(async ec => {
          await channel.assertExchange(ec.exchange, ec.type);
          await channel.assertQueue(ec.queue);
          await channel.bindQueue(ec.queue, ec.exchange, ec.pattern);
          channel.consume(ec.queue, ec.onMessage, { noAck: true });
        });

        resolve(conn);
      } catch (error) {
        reject(error);
      }
    });
  }
}
