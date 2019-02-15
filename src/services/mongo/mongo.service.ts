import * as mongoose from "mongoose";
import { Connection, ConnectionOptions, Model } from "mongoose";
import { Service } from "typedi";
import appConfig from '../../config';
import { IMemberUser, MemberUserSchema } from '../../repository/mogoose/memberUser.entities';
import { IDataDict, DataDictSchema } from "../../repository/mogoose/dataDict.entities";
import { IFile, FileSchema } from "../../repository/mogoose/file.entities";
import { MemberLogSchema, IMemberLog } from "../../repository/mogoose/memberLog.entities";
import { IIdRule, IdRuleSchema } from "../../repository/mogoose/idRule.entities";
import { IProject, ProjectSchema } from "../../repository/mogoose/project.entities";

/**
 * 数据库集合枚举
 */
export enum EntityNameEnum {
  idRule = "idRule", //..计数规则
  memberUser = "memberUser", //..用户
  dataDict = "dataDict", //..数据字典
  file = "file", //..文件
  memberLog = "memberLog", //..会员日志
  project = "project", //..项目
}

@Service()
export class MongoService {

  connection: Connection;

  MemberUserModel: Model<IMemberUser>;//会员用户
  DataDictModel: Model<IDataDict>;//数据字典
  FileModel: Model<IFile>;//附件
  MemberLogModel: Model<IMemberLog>;//会员日志
  IdRuleModel: Model<IIdRule>;//流水号
  ProjectModel: Model<IProject>;//项目

  constructor() {
    try {
      let url: string = appConfig.mongoUrl;
      let options = <ConnectionOptions>{ config: { autoIndex: false } };
      this.connection = mongoose.createConnection(url, options);
      console.log("success to connect mongodb.");
    } catch (error) {
      console.error("failed to connect mongodb : ", error);
    }
    this.defineModels();
  }

  private defineModels(): Promise<void> {
    return new Promise((resolve, reject) => {

      /** 用户模型 */
      this.MemberUserModel = this.connection.model<IMemberUser>(
        EntityNameEnum.memberUser,
        MemberUserSchema
      );

      /** 数据字典模型 */
      this.DataDictModel = this.connection.model<IDataDict>(
        EntityNameEnum.dataDict,
        DataDictSchema
      );

      /** 附件模型 */
      this.FileModel = this.connection.model<IFile>(
        EntityNameEnum.file,
        FileSchema
      );

      /** 会员日志模型 */
      this.MemberLogModel = this.connection.model<IMemberLog>(
        EntityNameEnum.memberLog,
        MemberLogSchema
      );

      /** 流水号模型 */
      this.IdRuleModel = this.connection.model<IIdRule>(
        EntityNameEnum.idRule,
        IdRuleSchema
      );

       /** 项目基本信息模型*/
       this.ProjectModel = this.connection.model<IProject>(
        EntityNameEnum.project,
        ProjectSchema
      );

      resolve();
    }).catch(function (error) {
      console.log(error);
      return null;
    });
  }
}