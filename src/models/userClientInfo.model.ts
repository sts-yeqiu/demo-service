
/**
 * 用户客户端信息
 */
export interface UserClientInfoModel {

    memberNum?: string;//会员编号
    loginName: string;//登录名
    password: string;//密码
    roles: string;// 客户端角色
    cordova?: string;//CORDOVA
    model?: string;//手机model
    platform?: string;//平台
    uuid?: string;//UUID
    version?: string;//版本
    manufacturer?: string;//制造商
    isVirtual?: string;//设备是否运行在模拟器
    serial?: string;//序列号
    appType?: string;// 客户端类型   

}