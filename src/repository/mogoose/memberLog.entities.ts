import { Document, Schema } from "mongoose";

/**
 * 会员日志模型
 */
export var MemberLogSchema: Schema = new Schema({
    memberId: { type: Schema.Types.ObjectId, ref: "member" }, //会员Id
    userId: { type: Schema.Types.ObjectId, ref: "memberUser" }, //用户Id
    type: { type: String }, //日志类型（项目计划导入:importProjectPlan）
    content: { type: Schema.Types.Mixed }, //日志内容
    logDate: { type: Date, default: Date.now } //日志时间
}, { collection: "memberLog" });

export interface IMemberLog extends Document {
    memberId: any;
    userId: any;
    type: string;
    content: any;
    logDate: Date;
}
