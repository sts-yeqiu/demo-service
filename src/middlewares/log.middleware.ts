import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { MemberLogsService } from "../services/mongo/memberLogs.service";

/** 接口调用后记录调用接口的信息,注释可不用 */
// @Middleware({ type: "after" }) 
export class LogMiddleware implements ExpressMiddlewareInterface {
    constructor(private memberLogsService: MemberLogsService) { }
    /** 记录接口调用日志 */
    use(request: any, response: any, next?: (err?: any) => any): any {
        try {
            let models: any[] = [];
            let model: any = {};
            model.userId = request.userId;
            model.type = 'api';
            model.logDate = new Date();
            model.content = {
                url: request.originalUrl,
                userId: request.userId,
                loginName: request.loginName,
                memberId: request.memberId,
                memberNum: request.memberNum,
                memberName: request.memberName,
                body: request.body
            };
            models.push(model);
            this.memberLogsService.addMemberLog(models, request.memberId);
        } catch (error) {
        }
       return next();
    }

}