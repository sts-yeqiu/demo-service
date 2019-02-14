import { MongoService } from "./mongo.service";
import { Service } from "typedi";
import { IIdRule } from "../../repository/mogoose/idRule.entities";

/**
 * 流水号服务
 */
@Service()
export class SerialNumberService {
  constructor(private ms: MongoService) { }
 

  /**
   * 获取入库单流水号
   */
  async getStockInOrderNo(): Promise<string> {
    let prefix: string = 'IN';
    let relueNo: string = "";
    relueNo = await new Promise<string>((resolve, reject) => {
      this.getRuleNo(prefix).then(value => {
        resolve(value);
      });
    }).catch(function (error) {
      console.log(error);
      return null;
    });

    return relueNo;
  }


  /**
   * 获取流水号
   * 
   * @param prefix 
   */
  async getRuleNo(prefix: string): Promise<string> {

    let ruleNo: string = '';
    try {

      let conditions: any = { prefix: prefix };//查询条件

      ruleNo = await new Promise<string>((resolve, reject) => {
        this.ms.IdRuleModel.findOne(conditions)
          .exec()
          .then(idRuleModel => {
            try {
              let ruleValue: number = 0;
              let ruleLength: number = 0;

              if (idRuleModel == null) {
                this.ms.IdRuleModel.create({ prefix: prefix, length: 4, value: 1 })
                ruleValue = 1;
                ruleLength = 4;
              } else {
                ruleValue = idRuleModel.value.valueOf() == null ? 0 : idRuleModel.value.valueOf();
                ruleLength = idRuleModel.length == null ? 0 : idRuleModel.length.valueOf();

                var updatestr = { 'value': ruleValue + 1 };
                this.ms.IdRuleModel.update(conditions, updatestr, function (err, res) {
                })
                ruleValue = ruleValue + 1;
              }

              let strZero: string = "";
              let size: number = new Number(ruleLength).valueOf() - new Number(ruleValue.toString().length).valueOf();
              for (var i = 0; i < size; i++) {
                strZero = strZero + "0";
              }

              //生成流水号
              ruleNo = prefix + strZero + ruleValue.toString();

            } catch (error) {

            }
            resolve(ruleNo);
          });
      })
    } catch (error) {
      console.log(error);
    }

    return ruleNo;
  }


  /**
   * 
   * @param prefix 
   */
  async getRuleNoByType(prefix: string, type: string, length: number): Promise<string> {

    let ruleNo: string = '';
    let ruleValue: number = 1;
    try {
      prefix = prefix.toUpperCase();//转换大写

      let conditions: any = { prefix: prefix, type: type };//查询条件

      let entity = await new Promise<IIdRule>((resolve, reject) => {
        this.ms.IdRuleModel.findOne(conditions)
          .exec()
          .then(value => {
            resolve(value);
          });
      });


      if (entity == null) {
        this.ms.IdRuleModel.create({ prefix: prefix, type: type, length: length, value: ruleValue })

      } else {
        ruleValue = entity.value.valueOf() == null ? 0 : entity.value.valueOf();
        length = entity.length == null ? 0 : entity.length.valueOf();

        ruleValue = ruleValue + 1;
        this.ms.IdRuleModel.update(conditions, { 'value': ruleValue }, function (err, res) {
        })
      }

      let strZero: string = "";
      let size: number = new Number(length).valueOf() - new Number(ruleValue.toString().length).valueOf();
      for (var i = 0; i < size; i++) {
        strZero = strZero + "0";
      }
      //生成流水号
      ruleNo = prefix + '-' + strZero + ruleValue.toString();

    } catch (error) {
      console.log(error);
    }

    return ruleNo;
  }
}
