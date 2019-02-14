import * as request from "request"; 

export class RequestService {
    constructor() { }


    /**
     * get json数据
     * 
     * @param url 
     * @param headers 
     * @param onError 
     */
    getJson(url: string, headers?: any, onError?: (err?: any) => void): Promise<any> {

        return new Promise<any>((resolve, reject) => {
            try {
                let options = {
                    url: url,
                    headers: headers
                };

                request.get(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        resolve(body);
                    } else {
                        resolve(error);
                    }
                });
            } catch (error) {
                reject(error);
            }

        });
    }

    /**
     * post json数据
     * 
     * @param url 
     * @param data 
     * @param headers 
     * @param onError 
     */
    postJson(url: string, data: any, headers?: any, onError?: (err?: any) => void): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            try {
                let options = {
                    url: url,
                    method: "POST",
                    json: true,
                    headers: headers,
                    body: data
                };

                request.post(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        resolve(body);
                    } else {
                        resolve(error);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * put json数据
     * 
     * @param url 
     * @param data 
     * @param headers 
     * @param onError 
     */
    putJson(url: string, data: any, headers?: any, onError?: (err?: any) => void): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            try {
                let options = {
                    url: url,
                    method: "PUT",
                    json: true,
                    headers: headers,
                    body: data
                };

                request.put(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        resolve(body);
                    } else {
                        resolve(error);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 删除数据
     * 
     * @param url 
     * @param headers 
     * @param onError 
     */
    deleteData(url: string, headers?: any, onError?: (err?: any) => void): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            try {
                let options = {
                    url: url,
                    method: "DELETE",
                    headers: headers
                };

                request.delete(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        resolve(body);
                    } else {
                        resolve(error);
                    }
                });
            } catch (error) {
                reject(error)
            }
        });
    }

    /**
     * 获取html
     * 
     * @param url 
     * @param headers 
     * @param onError 
     */
    getHtml(url: string, onError?: (err?: any) => void): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            try {
                request(url, (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                        resolve(body);
                    } else {
                        resolve(error);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 获取文件信息
     * 
     * @param url 
     * @param headers 
     * @param onError 
     */
    getFileData(url: string, headers?: any, onError?: (err?: any) => void): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            resolve();
        });
    }
}
