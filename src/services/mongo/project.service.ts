import { Service } from "typedi";
import * as mongoose from "mongoose";
import { ResultCodeEnum } from "../../core/enum/resultCode.enum";
import { ProjectModel } from '../../models/project.model';
import { IProject } from "../../repository/mogoose/project.entities";
import { MongoService } from "./mongo.service";

/**
 * 项目服务
 */
@Service()
export class ProjectService {
  constructor(private ms: MongoService) { }

  /**
   * 获取项目列表
   * @param parameters 
   */
  async findProjects(request: any): Promise<IProject[]> {
    //查询条件过滤
    let conditions: any = this.getProjectCondition(request);
    return new Promise<IProject[]>((resolve, reject) => {
      this.ms.ProjectModel.find(conditions)
        .populate({ "path": "projectManager", "model": "memberUser", "select": "_id name" })
        .populate({ "path": "meta.createBy", "model": "memberUser", "select": "_id name" })
        .populate({ "path": "meta.updateBy", "model": "memberUser", "select": "_id name" })
        .sort(request.sort)
        .skip(request.skip)
        .limit(request.skip)
        .exec()
        .then(result => {
          resolve(result)
        });
    });
  }

  /**
   * 新建项目
   * @param projectModel 
   * @param request 
   */
  async newProject(projectModel: ProjectModel, request: any): Promise<any> {
    let resultMessage: any = {};
    resultMessage.status = ResultCodeEnum.error;

    let projectEntity = <IProject>{};
    if (projectModel.name != null && projectModel.name != "" && projectModel.name != undefined) {
      projectEntity._id = mongoose.Types.ObjectId().toHexString();//项目Id
      projectEntity.name = projectModel.name; //项目名称
      projectEntity.abbreviation = projectModel.abbreviation; //项目简称
      projectEntity.projectNum = projectModel.projectNum; //项目编号
      projectEntity.projectSituation = projectModel.projectSituation; //项目概况
      projectEntity.projectManager = request.userId; //项目经理(暂定当前登录人)
      projectEntity.projectLocation = projectModel.projectLocation; //项目所在地
      projectEntity.beginDate = projectModel.beginDate; //开始时间
      projectEntity.endDate = projectModel.endDate; //结束时间

      let meta: any = {};
      meta.createBy = request.userId; //当前登录人
      meta.createDate = new Date(); //创建时间
      projectEntity.meta = meta;
      await this.ms.ProjectModel.create(projectEntity).then(result => {
        resultMessage.status = ResultCodeEnum.success;
        resultMessage.message = result._id;
      });
    } else {
      resultMessage.message = "项目名不能为空";
    };

    return new Promise<string>((resolve, reject) => {
      resolve(resultMessage);
    }).catch(error => {
      console.log(error);
      return null;
    });
  }

  /**
   * 修改项目
   * @param projectModel 
   */
  async updateProject(model: ProjectModel, request: any): Promise<string> {
    let projectEntity = <IProject>{};
    let resultMessage: string = ResultCodeEnum.success;//设置默认值为成功
    /** 查询项目实体 */
    projectEntity = await new Promise<IProject>((resolve, reject) => {
      this.ms.ProjectModel.findById(model.projectId, (err, value) => {
        if (err) {//查询出错
          resolve(null)
        }
      })
        .exec()
        .then(result => {
          resolve(result);
        }).catch(error => {
          console.log(error);
          resultMessage = ResultCodeEnum.error;
        });
    });

    if (projectEntity != null) {
      projectEntity.name = model.name; //项目名称
      projectEntity.abbreviation = model.abbreviation; //项目简称
      projectEntity.projectNum = model.projectNum; //项目编号
      projectEntity.projectSituation = model.projectSituation; //项目概况
      // projectEntity.projectManager = model.projectManager; //项目经理
      projectEntity.projectLocation = model.projectLocation; //项目所在地
      projectEntity.beginDate = model.beginDate; //开始日期
      projectEntity.endDate = model.endDate; //结束日期
      projectEntity.meta.updateBy = request.userId; //更新人
      projectEntity.meta.updateDate = new Date(); //更新时间

      /** 保存项目实体 */
      await projectEntity.save().then().catch(error => {
        console.log(error);
        resultMessage = ResultCodeEnum.error;
      });
    } else {
      resultMessage = "未找到对应的项目,请检查!";
    }
    return new Promise<string>((resolve, reject) => {
      resolve(resultMessage);
    }).catch(function (error) {
      console.log(error);
      return null;
    });
  }

  /**
   * 删除项目
   * @param id 
   */
  deleteProject(id: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.ms.ProjectModel.findOneAndRemove({ "_id": id, "status": "draft" }, (err, project) => {
        if (err) {
          reject(err)
        } else if (project == null) {
          resolve("不是草稿状态,不能删除")
        } else {
          resolve(ResultCodeEnum.success);
        }
      });
    }).catch(error => {
      console.log(error);
      return null;
    });
  }

  /**
   * 根据id 获取项目详情
   * @param projectId 
   */
  getProjectInfo(projectId: string): Promise<IProject> {
    return new Promise<IProject>((resolve, reject) => {
      this.ms.ProjectModel.findOne({ _id: projectId },(err,value)=>{
        if(err){
          resolve(null)
        }
      })
        .populate({ "path": "projectManager", "model": "memberUser", "select": "_id name" })
        .populate({ "path": "meta.createBy", "model": "memberUser", "select": "_id name" })
        .populate({ "path": "meta.updateBy", "model": "memberUser", "select": "_id name" })
        .exec()
        .then(value => {
          resolve(value);
        });
    }).catch(error => {
      console.log(error);
      return null;
    });
  }

  private getProjectCondition(request: any): any {
    // ?page=1&limit=10&f=status_unInspection^keyword_xxx&sort=orderNo   
    // status: string, //状态（待质检:unInspection 质检完成:inspected）
    // inspectionResult: string, //质检结果（合格:qualified 不合格:unQualified）
    let condition: any = {};
    // condition.projectId = projectId;
    // //状态的过滤
    // if (filterCondition.status != null && filterCondition.status != '' && filterCondition.status != undefined) {
    //     if (filterCondition.status == ProductionInspectionEnum.unInspection) {
    //         condition.status = filterCondition.status;//待质检
    //     } else if (filterCondition.status == ProductionInspectionEnum.qualified || filterCondition.status == ProductionInspectionEnum.unQualified) {
    //         condition.status = ProductionInspectionEnum.inspected;//质检完成
    //         condition.inspectionResult = filterCondition.status;//质检结果
    //     }

    // }

    // let keywordCondition: any[] = [];   //关键字的过滤条件
    // if (filterCondition.keyword != null && filterCondition.keyword != "" && filterCondition.keyword != undefined) {
    //     keywordCondition.push({ "orderNo": { $regex: filterCondition.keyword } })  //质检单编号
    //     condition.$or = keywordCondition;
    // }
    return condition;
  }



}
