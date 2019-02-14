import { JsonController, Get, Post, Param, Delete, Body, Put, QueryParam, QueryParams, Req, Res } from "routing-controllers";
import { Service } from "typedi";
import { UserClientInfoModel } from "../models/userClientInfo.model";
import { RestHelper } from "../shared/helpers/rest.helper";
import { RestResultModel } from "../shared/interfaces/rest.interface";
import { ResultCodeEnum } from "../core/enum/resultCode.enum";
import { TokenService } from "../services/mongo/token.service";
import appConfig from '../config';

/**
 * token控制器
 */
@Service()
@JsonController()
export class TokenController {
  constructor(
    private tokenService: TokenService
  ) { }

 /**
  * 获取token
  * @param model 
  */
  @Post("/token")
  getToken(@Body() model: UserClientInfoModel): Promise<RestResultModel> {
    return new Promise<RestResultModel>((resolve, reject) => {
      this.tokenService.getToken(model).then(value => {
        if (value == null) {
          resolve(RestHelper.create400Result(400, '登录名或密码错误'));
        } else {
          resolve(RestHelper.create200Result({ token: value }));
        }
      }).catch(error => {
        resolve(RestHelper.create400Result(400, ResultCodeEnum.errorMessage));
      });
    });
  }

}
