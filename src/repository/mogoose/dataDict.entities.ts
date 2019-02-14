import { Document, Schema } from "mongoose";

/**
 * 数据词典模型
 */
export var DataDictSchema: Schema = new Schema({
    type: { type: String }, // 类型（国家:country 城市:city 箱型:containerType）
    serial: { type: Number }, //序号
    code: { type: String }, //编码
    cName: { type: String }, //中文名
    eName: { type: String }, //英文名
    mnemonic: { type: String } //助记码
}, { collection: "dataDict" });

export interface IDataDict extends Document {
    type: string; // 类型（国家:country 城市:city 箱型:containerType）
    serial: number; //序号
    code: string; //编码
    cName: string; //中文名
    eName: string; //英文名
    mnemonic: string; //助记码
}
