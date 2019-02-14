import appConfig from "../../config";
import { Service } from "typedi";
import { UserClientInfoModel } from "../../models/userClientInfo.model";
import { TokenPayloadModel } from "../../models/tokenPayload.model";
import { IMemberUser } from '../../repository/mogoose/memberUser.entities';
import { MongoService } from './mongo.service';
var jwt = require('jsonwebtoken');

/**
 * token服务
 */
@Service()
export class TokenService {
  constructor(private ms: MongoService) { }

  /**
   * 获取token
   * 
   * @param token 
   */
  async  getToken(model: UserClientInfoModel): Promise<string> {
    /** 生成token的key */
    let tokenSecret: string = appConfig.jwtKey;
    let token: any = null;
    let conditions: any = {
      "$or": [
        { "loginName": model.loginName },
        { "loginName": model.loginName.toUpperCase() }]
    };

    /** 查询用户的信息 */
    let memberUserEntity = <IMemberUser>{};
    memberUserEntity = await new Promise<IMemberUser>((resolve, reject) => {
      this.ms.MemberUserModel.findOne(conditions)
        .exec()
        .then(value => {
          resolve(value);
        });
    });
  
    if (memberUserEntity != null) {
      let payloadModel = <TokenPayloadModel>{};
      payloadModel.issuer = '';//签发人
      payloadModel.expiresIn = '60 * 60 * 24 * 30';//到期时间 24小时过期
      // payloadModel.expiresIn = '20';//到期时间 24小时过期
      payloadModel.subject = '';//主题
      payloadModel.audience = '';//受众
      payloadModel.notBefore = Math.floor(Date.now() / 1000);//生效时间
      payloadModel.issuedAt = Math.floor(Date.now() / 1000);//签发时间

      payloadModel.userId = memberUserEntity._id;
      payloadModel.name = memberUserEntity.name;
      payloadModel.loginName = memberUserEntity.loginName;
      // payloadModel.memberId = memberUserEntity.memberId; //会员Id
      // payloadModel.memberNum = memberUserEntity.memberNum; //会员编号
      // payloadModel.memberName = memberUserEntity.memberName; //会员名称
      payloadModel.roles = model.roles;
      token = jwt.sign(JSON.stringify(payloadModel), tokenSecret);//生成token
    }
    return new Promise<String>((resolve, reject) => {
      resolve(token);
    }).catch(function (error) {
      console.log(error);
      return null;
    });
  }
}
