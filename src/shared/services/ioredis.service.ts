import * as ioredis from "ioredis";
import { Service } from "typedi";

/**
 * Redis Service.
 */
@Service()
export class IoredisService {
  private _redis: ioredis.Redis;

  constructor() {}

  /**
   * get a ioredis instance
   */
  get instance(): ioredis.Redis {
    return this._redis;
  }

  /**
   * connect to redis server.
   * @param options
   */
  connect(options?: ioredis.RedisOptions): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      this._redis = new ioredis(options);
      this._redis.on("connect", (data: any) => {
        resolve();
      });
    });
  }

  /**
   * disconnect from the redis server.
   */
  disconnect() {
    this._redis.disconnect();
  }
}
