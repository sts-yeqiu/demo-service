import {ExpressMiddlewareInterface, Middleware} from "routing-controllers";


//logging reqeust middleware
@Middleware({ type: "after" })
export class LoggingMiddleware implements ExpressMiddlewareInterface { 

    use(request: any, response: any, next?: (err?: any) => any): any {
        console.log("do logging...");
        next();
    }

}