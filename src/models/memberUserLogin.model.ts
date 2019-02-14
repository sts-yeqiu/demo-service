
/**
 * 会员用户登录模型
 */
export interface MemberUserLoginModel {
    memberNum: string;//会员编号(目前暂未用到)
    loginName: string;//登录名
    password: string;//密码
    role: string; //角色(目前暂未用到)
}