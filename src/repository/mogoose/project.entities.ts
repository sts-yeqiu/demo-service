import { Document, Schema } from "mongoose";

/**
 * 项目模型
 */
export var ProjectSchema: Schema = new Schema({
    name: { type: String }, //项目名称
    abbreviation: { type: String }, //项目简称
    projectNum: { type: String }, //项目编号
    projectLocation: { type: String }, //项目所在地
    projectSituation: { type: String }, //项目概况
    projectManager: { type: Schema.Types.ObjectId, ref: "memberUser" },//项目经理(目前暂时是当前创建人)
    status: { type: String, default: "draft" }, //项目状态（草稿：draft,打开:open,关闭：closed完成:finish）
    beginDate: { type: Date }, //开始时间
    endDate: { type: Date }, //结束时间
    meta: {
        createBy: { type: Schema.Types.ObjectId, ref: "memberUser" }, //创建人
        createDate: { type: Date, default: Date.now }, //创建时间
        updateBy: { type: Schema.Types.ObjectId, ref: "memberUser" }, //更新人
        updateDate: { type: Date } //更新时间
    }, //元信息
    photo: { type: Buffer } //项目照片
},
    { collection: "project" }
);

//索引
ProjectSchema.index({ projectNum: 1 });

export interface IProject extends Document {
    name: string; //项目名称
    abbreviation: string; //项目简称
    projectNum: string; //项目编号
    projectLocation: string; //项目所在地
    projectSituation: string; //项目概况
    projectManager: any; //项目经理
    status: string; //项目状态（草稿：draft,打开:open,关闭：closed完成:finish）
    beginDate: Date; //开始时间
    endDate: Date; //结束时间
    photo: any; //项目照片
    meta: {
        createBy: any; //创建人
        createDate: Date; //创建时间
        updateBy: any; //更新人
        updateDate: Date; //更新时间
    }; //元信息
}
