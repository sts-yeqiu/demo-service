import { JsonController, Get } from "routing-controllers";
import { RestResultModel } from "../shared/interfaces/rest.interface";
import { RestHelper } from "../shared/helpers/rest.helper";
import { Service } from "typedi";
import appConfig from '../config';

/**
 * 服务信息
 */
@Service()
@JsonController()
export class ServerInfoController {

  constructor() { }

  /** 验证服务是否正常启动 */
  @Get("/serverInfo")
  getServerInfo(): Promise<RestResultModel> {
    return new Promise<RestResultModel>((resolve, reject) => {
      resolve(RestHelper.create200Result({ environment: appConfig.env, downloadUrl: appConfig.server.downloadUrl, mongoUrl: appConfig.mongoUrl }));
    });
  }
}