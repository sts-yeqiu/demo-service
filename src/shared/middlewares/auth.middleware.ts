import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { RestHelper } from "../helpers/rest.helper";
import * as jwt from "jsonwebtoken";
import appConfig from "../../config";

//authorize middleware
@Middleware({ type: "before" })
export class AuthMiddleware implements ExpressMiddlewareInterface {

    use(request: any, response: any, next?: (err?: any) => any): any {

        /** 不用token验证的api,获取token、验证服务是否正常启动、用户登录、用户下载、用户注册 */
        if (request.originalUrl.indexOf('/token') >= 0 || request.originalUrl.indexOf('/serverInfo') >= 0 ||
            request.originalUrl.indexOf('/user/signin') >= 0 || request.originalUrl.indexOf('/download') >= 0 ||
            request.originalUrl.indexOf('/userRegister') >= 0) {
            console.log("不用token验证的api:"+request.originalUrl);
            return next();
        }

        /** 获取token密钥 */
        var tokenSecret = appConfig.jwtKey;
        var token = request.headers["token"];
        if (token == null || token == '') {
            response.send(RestHelper.create400Result(400, '未找到token'));
            return;
        }

        /** 验证token */
        jwt.verify(token, tokenSecret, function (err: any, tokenModel: any) {
            if (err) {
                /** 返回错误信息 */
                response.send(RestHelper.create400Result(400, 'token解析失败'));
                return;
            } else {
                let errorMessage: string = null;//错误信息
                let failureTime: number = new Number(tokenModel.expiresIn).valueOf() + new Number(tokenModel.notBefore).valueOf();//失效时间
                let nowTime: number = Math.floor(Date.now() / 1000);//当前时间,Date.now()当前时间的时间戳

                if (failureTime < nowTime) {
                    errorMessage = 'token已失效';
                }
                if (tokenModel.issuer != '') {
                    errorMessage = '签发人不正确'
                }

                if (errorMessage != null) {
                    response.send(RestHelper.create400Result(400, errorMessage));
                    return;
                }

                /** 解析必要的数据 注入request */ 
                request.issuer = tokenModel.issuer; //签发人
                request.userId = tokenModel.userId; //用户Id
                request.name = tokenModel.name; //用户名称
                request.loginName = tokenModel.loginName; //登录名
                // request.memberId = tokenModel.memberId; //会员Id 
                // request.memberNum = tokenModel.memberNum; //会员编号 
                // request.memberName = tokenModel.memberName; //会员名称
                request.roles = tokenModel.roles;
                /** 跳出中间件 */ 
                return next();
            }
        });
    }
}