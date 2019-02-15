/**
 * 项目模型
 */
export interface ProjectModel {
    projectId: string; //项目Id
    name: string; //项目名称
    abbreviation: string; //项目简称
    projectNum: string; //项目编号
    projectLocation: string; //项目所在地
    projectSituation: string; //项目概况
    projectManager: string; //项目经理
    projectManagerName: string; //项目经理名称
    status: string; //项目的状态（草稿：draft;打开:open;关闭：closed完成:finish）
    beginDate: Date; //开始时间
    endDate: Date; //结束时间
    createBy: string; //创建人
    createDate: Date; //创建时间
    updateBy: string; //更新人
    updateDate: Date //更新时间
}
