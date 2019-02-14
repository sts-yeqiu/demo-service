import {ExpressMiddlewareInterface,Middleware} from "routing-controllers";
import { QueryParamHelper } from "../helpers/queryParam.helper";

@Middleware({ type: "before" })
export class ListMiddleware implements ExpressMiddlewareInterface { // interface implementation is optional
    use(request: any, response: any, next?: (err?: any) => any): any {
        let pageJson:any = QueryParamHelper.getPageInfo(request.query); //分页
        let sort:any = QueryParamHelper.getSort(request.query); //排序
        let filterJson:any = QueryParamHelper.getCondition(request.query); //过滤条件
        /** 注入request */
        request.skip = pageJson.skip;
        request.limit = pageJson.limit;
        request.sort = sort;
        request.filterJson = filterJson;
        return next(); 
    }
}