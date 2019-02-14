import { model } from 'mongoose';
import { RestResultModel } from '../interfaces/rest.interface';


/**
 * REST helper class.
 */
export class RestHelper {

    /**
     * Create a REST response result object.
     * @param success 
     * @param status 
     * @param model 
     * @param error 
     */
    static createResult(success: boolean, status?: number, model?: any, error?: string): RestResultModel {
        return <RestResultModel>{
            success: success,
            status: status,
            error: error,
            model: model
        };
    }

    /**
     * Create a REST success response result object.
     * @param status 
     * @param error 
     */
    static create200Result(model?: any): RestResultModel {
        return RestHelper.createResult(true, 200, model);
    }


    /**
     * Create a 400 REST result object.
     * @param status 
     * @param error 
     */
    static create400Result(status?: number, error?: string): RestResultModel {
        return RestHelper.createResult(false, status || 404, null, error);
    }

    /**
     * Create a 500 REST result object.
     * @param status 
     * @param error 
     */
    static create500Result(status?: number, error?: string): RestResultModel {
        return RestHelper.createResult(false, status || 500, null, error);
    }
}