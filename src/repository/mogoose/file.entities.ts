import { Document, Schema } from "mongoose";

/**
 * 文件模型
 */
export var FileSchema: Schema = new Schema({
    type: { type: String }, // 文件类型
    name: { type: String }, // 文件名称
    fileSize: { type: String }, // 文件大小
    fileContent: { type: Buffer } //文件
}, { collection: "file" });

export interface IFile extends Document {
    type: string; // 文件类型
    name: string; // 文件名称
    fileSize: string; // 文件大小
    fileContent: any; //文件
}
