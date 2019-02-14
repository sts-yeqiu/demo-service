import { Service } from "typedi";
import { MongoService } from './mongo.service';
import { IMemberLog } from "../../repository/mogoose/memberLog.entities";
import { ResultCodeEnum } from "../../core/enum/resultCode.enum";

/**
 * 会员日志服务
 */
@Service()
export class MemberLogsService {
  constructor(private ms: MongoService) { }

  /**
   * 添加日志
   */
  async addMemberLog(memberLogModels: any[], memberId: string) {

    try {
      for (let model of memberLogModels) {
        let memberLogEntity = <IMemberLog>{};
        memberLogEntity.memberId = memberId;
        memberLogEntity.userId = model.userId;
        memberLogEntity.type = model.type;
        memberLogEntity.logDate = model.logDate;
        memberLogEntity.content = model.content;
        this.ms.MemberLogModel.create(memberLogEntity).then();
      }
    } catch (error) {
      console.log('error:' + error);

    }
  }

}
