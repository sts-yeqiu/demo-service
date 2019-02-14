import { Document, Schema } from "mongoose";

/**
 * 会员垃圾箱模型
 */
export var MemberDustBinSchema: Schema = new Schema({
    memberNum: { type: String }, //会员编号
    type: { type: String }, //类型
    document: { type: Schema.Types.Mixed }, //文档
    oper: { type: String }, //操作人
    operDate: { type: Date } //操作日期
}, { collection: "memberDustBin" });

export interface IMemberDustBin extends Document { }
