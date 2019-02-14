import { Service } from "typedi";
import { MongoService } from "./mongo.service";
import { MemberUserLoginModel } from "../../models/memberUserLogin.model";
import { IMemberUser } from "../../repository/mogoose/memberUser.entities";
import * as mongoose from "mongoose";
import { MemberUserModel } from "../../models/memberUser.model";
import { ResultCodeEnum } from "../../core/enum/resultCode.enum";


/**
 * 用户服务
 */
@Service()
export class UserService {
  constructor(private ms: MongoService) { }

  /**
   * 用户登录(获取用户的信息)
   * @param userLoginModel 
   */
  signin(userLoginModel: MemberUserLoginModel): Promise<IMemberUser> {
    let conditions: any = {
      "$or": [{ "loginName": userLoginModel.loginName },
      { "loginName": userLoginModel.loginName.toUpperCase() }]
    };
    return new Promise<IMemberUser>((resolve, reject) => {
      this.ms.MemberUserModel.findOne(conditions)
        // .populate({ "path": "memberId", "model": "member", "select": "_id roles" })
        .exec()
        .then(value => {
          resolve(value);
        });
    }).catch(function (error) {
      console.log(error);
      return null;
    });
  }

  /**
   * 查询用户信息
   * @param userId 
   */
  getUserInfo(userId: string): Promise<IMemberUser> {
    return new Promise<IMemberUser>((resolve, reject) => {
      this.ms.MemberUserModel.findById(userId, (err, value) => {
        if (err) {//查询出错
          resolve(null)
        }
      })
        .exec()
        .then(value => {
          resolve(value);
        });
    }).catch(function (error) {
      console.log(error);
      return null;
    });

  }

  /**
   * 查询用户列表
   * @param request 
   */
  findUsers(request: any): Promise<IMemberUser[]> {
    let conditions: any = {};  //查询条件    
    return new Promise<IMemberUser[]>((resolve, reject) => {
      this.ms.MemberUserModel.find(conditions)
        .populate({ path: 'meta.createBy', select: '_id name' })
        .populate({ path: 'meta.updateBy', select: '_id name' })
        .sort(request.sort)
        .skip(request.skip)
        .limit(request.limit)
        .exec()
        .then(value => {
          resolve(value);
        });
    }).catch(function (error) {
      console.log(error);
      return null;
    });
  }

  /**
   * 设置密码
   * @param userModel 
   * @param request 
   */
  async updateUserPassword(userModel: MemberUserModel, request: any): Promise<string> {
    let resultMessage: string = null;
    if (userModel == null) {
      resultMessage = '参数不对';
    } else {
      /** 查询用户信息 */
      let userEntity = await new Promise<IMemberUser>((resolve, reject) => {
        this.ms.MemberUserModel.findById(userModel.userId).then(result => {
          resolve(result);
        });
      });
      if (userEntity != null) {
        /** 验证原始密码是否一致 */
        let validatePassword: boolean = await new Promise<boolean>((resolve, reject) => {
          userEntity.validatePassword(userModel.originalPassword, function (err: any, isMatch: boolean) {
            resolve(isMatch);
          });
        });

        if (validatePassword) {//一致的话修改密码
          userEntity.password = userModel.updatePassword;
          userEntity.save().then();
          resultMessage = ResultCodeEnum.success;
        } else {
          resultMessage = '原始密码不正确';
        }
      } else {
        resultMessage = '未找到对应的用户'
      }
    }

    return new Promise<string>((resolve, reject) => {
      resolve(resultMessage);
    }).catch(function (error) {
      console.log(error);
      return null;
    });

  }

  /**
   * 新增会员用户
   * @param userModel 
   * @param request 
   */
  async addUsers(userModel: MemberUserModel): Promise<string> {
    console.log("userRegister");

    let resultMessage: string = null;
    /**检查登录名是否填写 */
    if (userModel == null || userModel.loginName == null || userModel.loginName == '') {
      resultMessage = '参数错误';
    } else {
      /** 登录名的校验,登录名是否重复 */
      let loginNameQty: number = await new Promise<number>((resolve, reject) => {
        this.ms.MemberUserModel.find({ "loginName": userModel.loginName }).count((err: any, count: number) => {
          resolve(count);
        });
      });

      if (loginNameQty == 0) {
        let userEntity = <IMemberUser>{};
        userEntity.isActive = userModel.isActive;//是否激活
        userEntity.roles = userModel.roles; //角色（管理员:admin）
        userEntity.name = userModel.name; //姓名
        userEntity.loginName = userModel.loginName.toUpperCase(); //登陆名
        userEntity.password = 'yrf'; //密码,默认密码为yrf

        let basicInfo: any = {};//基础信息
        basicInfo.gender = userModel.gender; //性别（男:male 女:female）
        basicInfo.identityNumber = userModel.identityNumber; //身份证号
        basicInfo.mobile = userModel.mobile; //手机号
        basicInfo.email = userModel.email; //邮箱
        userEntity.basicInfo = basicInfo;

        let meta: any = {};
        // meta.createBy = request.userId; //创建人
        // meta.createDate = new Date(); //创建时间
        userEntity.meta = meta;
        this.ms.MemberUserModel.create(userEntity).then();
        resultMessage = ResultCodeEnum.success;
      } else {
        resultMessage = '用户名已存在,请重新选择！';
      }
    }

    return new Promise<string>((resolve, reject) => {
      resolve(resultMessage);
    }).catch(function (error) {
      console.log(error);
      return null;
    });
  }

  /**
   * 编辑用户
   * @param userModel 
   * @param request 
   */
  async  updateUsers(userModel: MemberUserModel, request: any): Promise<string> {
    let resultMessage: string = null;//返回信息
    if (resultMessage == null) {
      let userEntity = await new Promise<IMemberUser>((resolve, reject) => {
        this.ms.MemberUserModel.findById(userModel.userId).then(result => {
          resolve(result);
        });
      });
      if (userEntity != null) {
        userEntity.isActive = userModel.isActive;//是否激活
        userEntity.roles = userModel.roles; //角色（管理员:admin）
        userEntity.name = userModel.name; //姓名
        userEntity.loginName = userModel.loginName; //登陆名
        // userEntity.password = '1111'; //密码

        let basicInfo: any = userEntity.basicInfo;
        basicInfo.gender = userModel.gender; //性别（男:male 女:female）
        basicInfo.identityNumber = userModel.identityNumber; //身份证号
        basicInfo.mobile = userModel.mobile; //手机号
        basicInfo.email = userModel.email; //邮箱
        userEntity.basicInfo = basicInfo;

        let meta: any = userEntity.meta;
        if (meta != null) {
          meta.updateBy = request.userId;//更新人
          meta.updateDate = new Date(); //更新时间
          userEntity.meta = meta;
        }
        userEntity.save().then();//保存数据
        resultMessage = ResultCodeEnum.success;
      } else {
        resultMessage = '未找到对应的会员用户';
      }
    }
    return new Promise<string>((resolve, reject) => {
      resolve(resultMessage);
    }).catch(function (error) {
      console.log(error);
      return null;
    });
  }

  /**
   * 删除用户
   * @param userId 
   * @param request 
   */
  deleteUser(userId: string, request: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.ms.MemberUserModel.findOneAndRemove({ "_id": userId }, (err, userInfo) => {
        if (err) {
          resolve("用户Id错误,未找到对应的用户!")
        } else if (userInfo == null) {
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
   * 重置密码
   * @param userId 
   * @param request 
   */
  async resetPassword(userId: string, request: any): Promise<string> {
    let resultMessage: string = null;
    /** 查询用户信息 */
    let userEntity = await new Promise<IMemberUser>((resolve, reject) => {
      this.ms.MemberUserModel.findById(userId).then(result => {
        resolve(result);
      });
    });
    if (userEntity != null) {
      userEntity.password = 'yrf';
      userEntity.save().then();
      resultMessage = ResultCodeEnum.success;
    } else {
      resultMessage = '未找到对应的会员用户';
    }
    return new Promise<string>((resolve, reject) => {
      resolve(resultMessage);
    });
  }
}
