import {ExpressMiddlewareInterface, Middleware} from "routing-controllers";

//todo:     sean    8.10    logging reqeust middleware.

//logging reqeust middleware
@Middleware({ type: "after" })
export class LoggingMiddleware implements ExpressMiddlewareInterface { 

    use(request: any, response: any, next?: (err?: any) => any): any {
        console.log("do logging...");
        next();
    }

}