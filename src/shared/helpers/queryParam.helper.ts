const maxPageCount: number = 10000;
const defaultPageCount: number = 20;

export class QueryParamHelper {

    // f=type_epc,factory^XX_begin-end-YY_begin-end^ZZ_begin-end
    /**
     * 解析查询条件
     * @param parameters 
     */
    static getCondition(parameters: any): any {
        let filter = parameters.f;
        let conditions: any = {};
        if (filter != null && filter != '') {
            for (let item of filter.split('^')) {
              
                let startIndex = item.search('_');
                let key: any =item.substring(0, startIndex);
                let value: any = item.substring(startIndex+1,item.length);
                
                if (value.includes("(")) {
                    value = value.replace(/\(/g, '\\(');
                }
                if (value.includes(")")) {
                    value = value.replace(/\)/g, '\\)');
                }
                if (value.includes(" ")) {
                    value = value.replace(/\ /g, '\\ ');
                }
                conditions[key] = value;
            }
        }
        // console.log('QueryParamHelper conditions:'+JSON.stringify(conditions));
        return conditions;
    }

    /**
     * 解析排序
     * 
     * @param parameters 
     */
    static getSort(parameters: any): any {
        //排序
        let strSort = parameters.sort
        // console.log('strSort:'+JSON.stringify(strSort));

        let sort: any = {};
        // let strSort: string = parameters.sort;
        if (strSort != null && strSort != '' && strSort != undefined) {
            for (let item of strSort.split(',')) {
                if (item.includes('-')) {//倒序    
                    sort[item.substring(1)] = -1;
                } else {
                    sort[item] = 1;
                }
            }
        }
        // console.log('sort:'+JSON.stringify(sort));
        
        return sort;

    }

    /**
     * 解析分页
     * 
     * @param parameters 
     */
    static getPageInfo(parameters: any): any {

        let pageInfo: any = {};
        let page: any = parameters.page == null ? 0 : parameters.page;
        let limit: number = parameters.limit != null ? new Number(parameters.limit).valueOf() : defaultPageCount;//每页行数

        let skip: number = 0;//分页
        if (page == 0) {
            limit = maxPageCount;
        } else {
            skip = (page - 1) * limit;
        }

        pageInfo.limit = limit;
        pageInfo.skip = skip;

        return pageInfo;
    }

}
