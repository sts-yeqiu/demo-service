import { JsonController, Get, Post, Param, Delete, Body, Put, QueryParam, QueryParams, Req, Res } from "routing-controllers";
import { Service } from "typedi";
import { RestHelper } from "../shared/helpers/rest.helper";
import { RestResultModel } from "../shared/interfaces/rest.interface";
import { ResultCodeEnum } from "../core/enum/resultCode.enum";
import { UserService } from "../services/mongo/user.service";
import { MemberUserModel } from "../models/memberUser.model";
import { MemberUserLoginModel } from "../models/memberUserLogin.model";
import { IMemberUser, MemberUserSchema } from "../repository/mogoose/memberUser.entities";
import * as mongoose from 'mongoose';

/**
 * 用户控制器
 */
@Service()
@JsonController()
export class UserController {
  constructor(private userService: UserService) { }

  /**
   * 用户登录
   * @param model 
   */
  @Post("/user/signin")
  signin(@Body() model: MemberUserLoginModel): Promise<RestResultModel> {
    return new Promise<RestResultModel>((resolve, reject) => {
      this.userService.signin(model).then(userEntity => {
        if (userEntity == null) {
          resolve(RestHelper.create400Result(0, '会员号或者用户名不正确'));
        } else {
          /** 判断密码是否正确 */
          userEntity.validatePassword(model.password, function (err: any, isMatch: boolean) {
            if (!isMatch) {
              resolve(RestHelper.create400Result(0, '密码不正确'));
            } else {
              resolve(RestHelper.create200Result({ userId: userEntity._id }));
            }
          });
          // if (userLoginModel.password == null || userLoginModel.password != userEntity.password) {
          //   resolve(RestHelper.create400Result(0, '密码不正确'));
          // } else {
          //   resolve(RestHelper.create200Result({ userId: userEntity._id, memberId: userEntity.memberId }));
          // }
        }
      }).catch(error => {
        resolve(RestHelper.create400Result(400, ResultCodeEnum.errorMessage));
      });
    });
  }

  /**
   * 根据用户Id获取用户信息
   * @param userId 
   */
  @Get("/user/:userId/info")
  getUserInfo(@Param('userId') userId: string): Promise<RestResultModel> {
    return new Promise<RestResultModel>((resolve, reject) => {
      this.userService.getUserInfo(userId).then(value => {
        if (value == null) {
          resolve(RestHelper.create400Result(400, 'id错误'));
        } else {
          //实体转换成视图模型
          let model: MemberUserModel = this.map2MemberUserModel(value);
          resolve(RestHelper.create200Result(model));
        }
      }).catch(error => {
        resolve(RestHelper.create400Result(400, ResultCodeEnum.errorMessage));
      });
    });
  }

  /**
   * 查询用户列表
   * @param request 
   */
  @Get("/users")
  findUsers(@Req() request: any): Promise<RestResultModel> {
    return new Promise<RestResultModel>((resolve, reject) => {
      this.userService.findUsers(request).then(values => {
        let models: MemberUserModel[] = [];
        /** 循环用户列表 */
        values.forEach(entity => {
          let model: MemberUserModel = this.map2MemberUserModel(entity);
          models.push(model);
        });
        resolve(RestHelper.create200Result(models));
      }).catch(error => {
        resolve(RestHelper.create400Result(400, ResultCodeEnum.errorMessage));
      });
    });
  }

  /**
   * 修改密码
   * @param userModel 
   */
  @Put("/users/password")
  updateUserPassword(@Body() userModel: MemberUserModel, @Req() request: any): Promise<RestResultModel> {
    return new Promise<RestResultModel>((resolve, reject) => {
      this.userService.updateUserPassword(userModel, request).then(result => {
        if (result == ResultCodeEnum.success) {
          resolve(RestHelper.create200Result());
        } else {
          resolve(RestHelper.create400Result(400, result));
        }
      }).catch(error => {
        resolve(RestHelper.create400Result(400, ResultCodeEnum.errorMessage));
      });
    });
  }


  /**
   * 注册用户
   * @param userModel 
   * @param request 
   */
  @Post("/userRegister")
  addUsers(@Body() userModel: MemberUserModel): Promise<RestResultModel> {
    return new Promise<RestResultModel>((resolve, reject) => {
      this.userService.addUsers(userModel).then(result => {
        if (result == ResultCodeEnum.success) {
          resolve(RestHelper.create200Result());
        } else {
          resolve(RestHelper.create400Result(400, result));
        }
      }).catch(error => {
        resolve(RestHelper.create400Result(400, ResultCodeEnum.errorMessage));
      });
    });
  }

  /**
   * 编辑用户
   * @param userModel 
   * @param request 
   */
  @Put("/users")
  updateUsers(@Body() userModel: MemberUserModel, @Req() request: any): Promise<RestResultModel> {
    return new Promise<RestResultModel>((resolve, reject) => {
      this.userService.updateUsers(userModel, request).then(result => {
        if (result == ResultCodeEnum.success) {
          resolve(RestHelper.create200Result());
        } else {
          resolve(RestHelper.create400Result(400, result));
        }
      }).catch(error => {
        resolve(RestHelper.create400Result(400, ResultCodeEnum.errorMessage));
      });
    });
  }

  /**
   * 删除用户
   * @param userId 
   * @param request 
   */
  @Delete("/users/:userId")
  deleteUsers(@Param('userId') userId: string, @Req() request: any): Promise<RestResultModel> {
    return new Promise<RestResultModel>((resolve, reject) => {
      this.userService.deleteUser(userId, request).then(result => {
        if (result == ResultCodeEnum.success) {
          resolve(RestHelper.create200Result());
        } else {
          resolve(RestHelper.create400Result(400, result));
        }
      }).catch(error => {
        resolve(RestHelper.create400Result(400, ResultCodeEnum.errorMessage));
      });
    });
  }

  /**
   * 重置密码
   * @param userId 
   * @param request 
   */
  @Get("/users/:userId/resetPassword")
  resetPassword(@Param('userId') userId: string, @Req() request: any): Promise<RestResultModel> {
    return new Promise<RestResultModel>((resolve, reject) => {
      this.userService.resetPassword(userId, request).then(result => {
        if (result == ResultCodeEnum.success) {
          resolve(RestHelper.create200Result());
        } else {
          resolve(RestHelper.create400Result(400, result));
        };
      }).catch(error => {
        resolve(RestHelper.create400Result(400, ResultCodeEnum.errorMessage));
      });
    });
  }

  /**
   * 用户的数据转换模型
   * @param entity 
   */
  private map2MemberUserModel(entity: IMemberUser): MemberUserModel {
    let model = <MemberUserModel>{};
    model.userId = entity._id;
    model.isActive = entity.isActive; //是否激活
    model.roles = entity.roles; //角色（管理员:admin）
    model.name = entity.name; //姓名
    model.loginName = entity.loginName; //登陆名
    let basicInfo: any = entity.basicInfo;
    if (basicInfo != null) {
      model.gender = basicInfo.gender; //性别（男:male 女:female）
      model.identityNumber = basicInfo.identityNumber; //身份证号
      model.mobile = basicInfo.mobile; //手机号
      model.email = basicInfo.email; //邮箱
    }
    let meta: any = entity.meta;
    if (meta != null) {
      model.createBy = meta.createBy;//创建人
      model.createDate = meta.createDate; //创建时间
      model.updateBy = meta.updateBy; //更新人
      model.updateDate = meta.updateDate; //更新时间
    }
    return model;
  }

}
