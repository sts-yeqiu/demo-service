import { Service } from 'typedi';
import { RequestService } from './request.service';
let smsHost = "http://192.168.1.5:9462";


@Service()
export class smsSendService {//供外部调用的服务类
    constructor(private requestService: RequestService) { }
    /**
     * 发送短信
     * @param mobileNumber 手机号
     * @param content 短信内容
     * @param template 模板类型
     */
    async sendMessage(mobileNumber: string, content: string, template: string): Promise<any> {
        let url: string = smsHost + "/sendMessage";
        let headers: any = {
            'Accept': 'application/json;version=2.0',
            'Content-Type': 'application/json',
            'token': ''
        };
        let body = {
            content: content,   //短信内容
            mobileNumber: mobileNumber,   //用户手机号
            template: template,//短信通知模板
        }
        return await this.requestService.postJson(url, body, headers);
    }
    /**
     * 发送验证码
     * @param mobileNumber 手机号
     * @param effectiveTime 有效时间
     * @param template 验证码模板
     * @param type 验证码类型
     */
    async sendCode(mobileNumber: string, effectiveTime: number, template: string, type: string): Promise<any> {
        let url: string = smsHost + "/sendCode";
        let headers: any = {
            'Accept': 'application/json;version=2.0',
            'Content-Type': 'application/json',
            'token': ''
        };
        let body = {
            mobileNumber: mobileNumber,   //用户手机号 
            effectiveTime: effectiveTime, //短信验证码的有效时间
            template: template,//验证码模板
            type: type,       //验证码类型
        }
        return await this.requestService.postJson(url, body, headers);
    }
    /**
     * 校验验证码
     * @param mobileNumber 手机号
     * @param code 验证码
     * @param type 验证码类型
     */
    async checkCode(mobileNumber: string, code: string, type: string): Promise<any> {
        let url: string = smsHost + "/checkCode";
        let headers: any = {
            'Accept': 'application/json;version=2.0',
            'Content-Type': 'application/json',
            'token': ''
        };
        let body = {
            mobileNumber: mobileNumber,
            code: code,
            type: type,
        }
        return await this.requestService.postJson(url, body, headers);
    }
}