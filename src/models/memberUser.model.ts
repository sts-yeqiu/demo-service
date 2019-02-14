
/**
 * 会员用户信息
 */
export interface MemberUserModel {
    userId: string;
    isActive: boolean, //是否激活
    roles: [string], //角色（管理员:admin）
    name: string, //姓名
    loginName: string, //登陆名
    password: string, //密码
    memberId: any, //会员Id
    memberNum: string, //会员编号
    memberName: string, //会员名称
    gender: string, //性别（男:male 女:female）
    identityNumber: string, //身份证号
    mobile: string, //手机号
    email: string //邮箱
    createBy: any, //创建人
    createDate: Date, //创建时间
    updateBy: any, //更新人
    updateDate: Date //更新时间
    
    originalPassword: string;//原密码
    updatePassword: string;//更新后密码
}