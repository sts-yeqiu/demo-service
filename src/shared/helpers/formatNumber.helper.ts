/**
 * FormatHelper
 */
export class FormatNumberHelper {

    /**
     * 格式化数字,保留小数位四舍五入(toFixed 会存在精度问题)
     * @param originalNum 数值
     * @param digit 小数位数
     */
    static formatToFixed(originalNum: number, digit: number): number {
        let result: number = 0;
        try {
            result = new Number(originalNum.toFixed(digit)).valueOf();
        } catch (error) {
            result = 0;
        }
        return result
    }

    /**
     * 格式化数字,保留小数位四舍五入(round 先变成整数,再向下取整,可解决精度问题)
     * @param originalNum 数值
     * @param digit 小数位数
     */
    static formatRound(originalNum: number, digit: number): number {
        let result: number = 0;
        let indexNum = Math.pow(10, digit);//指数幂
        try {
            result = Math.round(originalNum * indexNum) / indexNum;
        } catch (error) {
            result = 0;
        }
        return result
    }
}