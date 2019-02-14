import "reflect-metadata";
import * as node_redis from "redis";
import * as bluebird from "bluebird";
import { Service } from "typedi";
import { RedisClient, ClientOpts } from "redis";
import { inherits } from "util";
import { resolve } from "dns";


/**
 * Redis Service
 */
@Service()
export class RedisService {
  redis: any;
  client: any = null;
  constructor() {
    this.redis = bluebird.promisifyAll(node_redis);
  }

  /**
   * Startup redis service.
   * @param options
   */
  async startup(options?: ClientOpts): Promise<any> {
    this.client = await this.connect(options);
    return this.client;
  }

  /**
   * Shutdown redis service.
   */
  async shutdown(): Promise<any> {
    return await this.client.quitAsync();
  }

  /**
   * Create a redis connection.
   * @param options
   */
  connect(options?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let client = this.redis.createClient(0, "", options);
      client.on("connect", () => {
        resolve(client);
      });
    });
  }

  /**
   * Set a string value
   * @param key
   * @param value
   */
  async set(key: string, value: string, seconds?: number): Promise<boolean> {
    try {
      await this.client.setAsync(key, value);
      if (seconds) {
        await this.client.expireAsync(key, seconds);
      }
      return true;
    } catch (error) {
      console.log("redis set string error:", error);
      return false;
    }
  }

  /**
   * Get a string value
   * @param key
   */
  async get(key: string) {
    return await this.client.getAsync(key);
  }

  /**
   * Set the string value of a hash field 
   * @param key 
   * @param field 
   * @param value 
   */
  async hset(key: string, field: string, value: string): Promise<boolean> {
    try {
      await this.client.hsetAsync(key, field, value);

      return true;
    } catch (error) {
      console.log(" Set hash error:", error);
      return false;
    }
  }

  /**
   * Get the value of a hash field.
   * @param key 
   * @param field 
   */
  async hget(key: string, field: string) {
    return await this.client.hgetAsync(key, field);
  }

  /**
   * Get all fields and values in a hash.
   * @param key 
   */
  async hgetall(key: string) {
    return await this.client.hgetallAsync(key);
  }

  /**
   * Determine if a hash field exists
   * 判断hash是否存在
   * @param key 
   * @param field 
   */
  async hexists(key: string, field: string): Promise<boolean> {
    try {
      let result = await this.client.hexistsAsync(key, field);
      return result == 1;
    } catch (error) {
      console.log(" Set hash error:", error);
      return false;
    }
  }

  /**
   * Delete  hash fields
   * @param key 
   * @param field 
   */
  async hdel(key: string, field: string): Promise<boolean> {
    try {
      await this.client.hdelAsync(key, field);
      return true;
    } catch (error) {
      console.log(" Delete  hash fields:", error);
      return false;
    }
  }

  /**
   * push value to a list
   * @param key 
   * @param value 
   */
  async lpush(key: string, value: string): Promise<boolean> {
    try {
      await this.client.lpushAsync(key, value);
      return true;
    } catch (error) {
      console.log(" push value to a list:", error);
      return false;
    }
  }

  /**
   * Remove and get the first element in a list.
   * @param key 
   */
  async lpop(key: string) {
    return await this.client.lpopAsync(key);
  }

  /**
   * Remove and get the last element in a list.
   * @param key 
   */
  async rpop(key: string) {
    return await this.client.rpopAsync(key);
  }

  /**
   * Get the length of a list.
   * @param key 
   */
  async llen(key: string) {
    return await this.client.llenAsync(key);
  }

  /**
   * Append one or multiple members to a set.
   * 
   * @param key 
   * @param value 
   */
  async sadd(key: string, ...values: any[]): Promise<boolean> {
    try {
      await this.client.saddAsync(key, values);
      return true;
    } catch (error) {
      console.log(" push value to a list:", error);
      return false;
    }
  }

  /**
   *  Remove  member from a set.
   * @param key 
   */
  async srem(key: string, value: string): Promise<boolean> {
    try {
      let result = await this.client.sremAsync(key, value);
      return result == 1;
    } catch (error) {
      console.log("Remove  member from a set:", error);
      return false;
    }
  }
 

}
