import { Document, Schema } from "mongoose";

/**
 * 系统日志模型
 */
export var SystemLogSchema: Schema = new Schema({
    level: { type: String }, //日志级别
    content: { type: Schema.Types.Mixed }, //日志内容
    logDate: { type: Date, default: Date.now } //日志时间
}, { collection: "systemLog" });

export interface ISystemLog extends Document { }
