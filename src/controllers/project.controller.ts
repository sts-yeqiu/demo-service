import { Body, Delete, Get, JsonController, Param, Post, Put, QueryParams, Req } from "routing-controllers";
import { Service } from "typedi";
import { ResultCodeEnum } from "../core/enum/resultCode.enum";
import { ProjectModel } from "../models/project.model";
import { IProject } from '../repository/mogoose/project.entities';
import { ProjectService } from "../services/mongo/project.service";
import { RestHelper } from "../shared/helpers/rest.helper";
import { RestResultModel } from "../shared/interfaces/rest.interface";



/**
 * 项目控制器
 */
@Service()
@JsonController()
export class ProjectController {
  constructor(private projectService: ProjectService) { }

  /**
   * 查询项目列表
   * @param parameters 
   * @param request 
   */
  @Get("/projects")
  async findProjects(@Req() request: any): Promise<RestResultModel> {
    return new Promise<RestResultModel>((resolve, reject) => {
      this.projectService.findProjects(request).then(value => {
        if (value == null) {
          resolve(RestHelper.create400Result(400, ResultCodeEnum.errorMessage));
        } else {
          //实体转换成视图模型
          let models: ProjectModel[] = [];
          value.forEach(entity => {
            let model: ProjectModel = this.map2ProjectModel(entity);
            models.push(model);
          });
          resolve(RestHelper.create200Result(models));
        }
      });
    }).catch(function (error) {
      console.log(error);
      return RestHelper.create400Result(400, ResultCodeEnum.errorMessage);
    });
  }

  /**
   * 新建项目
   * @param projectModel 
   * @param request 
   */
  @Post("/project")
  newProject(@Body() model: ProjectModel, @Req() request: any): Promise<RestResultModel> {
    return new Promise<RestResultModel>((resolve, reject) => {
      this.projectService.newProject(model, request).then(result => {
        if (result.status == ResultCodeEnum.success) {
          resolve(RestHelper.create200Result({ 'projectId': result.message }));
        } else {
          resolve(RestHelper.create400Result(400, result.message))
        }
      });
    }).catch(error => {
      console.log(error);
      return RestHelper.create400Result(400, ResultCodeEnum.errorMessage);
    });
  }

  /**
   * 编辑项目
   * @param model 
   */
  @Put("/project")
  updateProject(@Body() model: ProjectModel, @Req() request: any): Promise<RestResultModel> {
    return new Promise<RestResultModel>((resolve, reject) => {
      this.projectService.updateProject(model, request).then(result => {
        if (result == ResultCodeEnum.success) {
          resolve(RestHelper.create200Result(result));
        } else {
          resolve(RestHelper.create400Result(400, ResultCodeEnum.error));
        }
      });
    }).catch(error => {
      console.log(error);
      return RestHelper.create400Result(400, ResultCodeEnum.errorMessage);
    });
  }

  /**
   * 删除项目
   * @param projectId 
   */
  @Delete("/project/:pid")
  deleteProject(@Param("pid") projectId: string): Promise<RestResultModel> {
    return new Promise<RestResultModel>((resolve, reject) => {
      this.projectService.deleteProject(projectId).then(result => {
        if (result == null) {
          resolve(RestHelper.create400Result(400, "id错误"));
        } else if (result != ResultCodeEnum.success) {
          resolve(RestHelper.create400Result(400, result));
        } else {
          resolve(RestHelper.create200Result(result));
        }
      });
    }).catch(function (error) {
      console.log(error);
      return RestHelper.create400Result(400, ResultCodeEnum.errorMessage);
    });
  }

  /**
   * 根据项目id 获取项目信息详情
   * @param id 
   */
  @Get("/projects/:pid")
  async getProjectInfo(@Param("pid") projectId: string): Promise<RestResultModel> {
    return new Promise<RestResultModel>((resolve, reject) => {
      this.projectService.getProjectInfo(projectId).then(value => {
        if (value != null) {
          let model: ProjectModel = this.map2ProjectModel(value);
          resolve(RestHelper.create200Result(model));
        } else {
          resolve(RestHelper.create200Result());
        }
      });
    }).catch(function (error) {
      console.log(error);
      return RestHelper.create400Result(400, ResultCodeEnum.errorMessage);
    });
  }

  /**
   * 实体转换成视图模型
   * @param entity 
   */
  private map2ProjectModel(entity: IProject): ProjectModel {
    let model = <ProjectModel>{};
    model.projectId = entity._id; //项目Id
    model.name = entity.name; //项目名称
    model.abbreviation = entity.abbreviation; //项目简称
    model.projectNum = entity.projectNum; //项目编号
    model.projectLocation = entity.projectLocation; //项目所在地
    model.projectSituation = entity.projectSituation; //项目概况
    let projectManager: any = entity.projectManager;
    if (projectManager != null) {
      model.projectManager = projectManager._id; //项目经理
      model.projectManagerName = projectManager.name; //项目经理名称
    }
    model.status = entity.status;//状态
    model.beginDate = entity.beginDate; //开始时间
    model.endDate = entity.endDate; //结束时间
    let meta: any = entity.meta;
    if (meta != null) {
      let createBy: any = meta.createBy;
      if (createBy != null) {
        model.createBy = createBy._id; //创建人
        model.createDate = meta.createDate; //创建时间
      }
      let updateBy: any = meta.updateBy;
      if (updateBy != null) {
        model.updateBy = updateBy._id; //更新人
        model.updateDate = meta.updateDate;//更新时间      
      }
    }
    return model;
  }
}
