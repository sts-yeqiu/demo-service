export interface EventHandler {
  event: string;
  handler: (data: any) => void;
}
