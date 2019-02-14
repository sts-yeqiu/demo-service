import { Middleware } from "routing-controllers/decorator/Middleware";
import { ExpressErrorMiddlewareInterface } from "routing-controllers/driver/express/ExpressErrorMiddlewareInterface";

//error handler middleware
@Middleware({ type: "after" })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {

    error(error: any, request: any, response: any, next: (err?: any) => any) {
        console.log("do error handle.");

        /** 写错误日志 */

        /** 发邮件给管理员 */

        next();
    }

}