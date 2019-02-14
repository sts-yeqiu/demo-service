import { EventHandler } from "./eventHandler.interface";
import { Service } from "typedi";

@Service()
export class DebugHandler implements EventHandler {
  event: string;
  handler: (data: any) => void;

  constructor() {
    this.event = "debug";
    this.handler = (data: any) => {
      console.log("\t debug handler: ", data);
    };
  }
}
