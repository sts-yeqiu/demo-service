/**
 * 格式化时间的帮助类
 */
let minute: number = 1000 * 60;
let hour: number = minute * 60;
let day: number = hour * 24;
let halfamonth: number = day * 15;
let month: number = day * 30;
export class FormatTimeHelper {
  /**
   * 转化时间成朋友圈时间
   * @param dateTimeStamp 
   */
  static getDateDiff(dateTimeStamp: number): string {
    let result: string = "刚刚";
    let now = new Date().getTime();
    let diffValue = now - dateTimeStamp;//时间戳的差值
    if (diffValue < 0) { //若日期不符,则结果置为空
      // alert("结束日期不能小于开始日期！");
      result = ""
    } else {
      let monthC = diffValue / month; //转化为月份
      let weekC = diffValue / (7 * day); //转化为周
      let dayC = diffValue / day;  //转化为天
      let hourC = diffValue / hour;  //转化为小时
      let minC = diffValue / minute; //转化为分钟
      if (monthC >= 1) {
        result = monthC + "个月前";
      } else if (weekC >= 1) {
        result = weekC + "周前";
      } else if (dayC >= 1) {
        result = dayC + "天前";
      } else if (hourC >= 1) {
        result = hourC + "个小时前";
      } else if (minC >= 1) {
        result = minC + "分钟前";
      }
    }
    return result;
  }
}