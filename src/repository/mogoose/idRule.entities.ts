import { Document, Schema } from "mongoose";

/**
 * 编码规则
 */
export var IdRuleSchema: Schema = new Schema({
    prefix: { type: String }, //编码前缀
    length: { type: Number }, //后缀长度
    value: { type: Number }, //当前值
    type: { type: String } //类型
}, { collection: "idRule" });

export interface IIdRule extends Document {
    prefix: string; //编码前缀
    length: number; //后缀长度
    value: number; //当前值
    type: string; //类型
}
