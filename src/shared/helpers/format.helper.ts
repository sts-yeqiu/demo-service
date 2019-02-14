/**
 * FormatHelper
 */
export class FormatHelper {

    static formatNumber(from: number, count: number): number {
        let result: number = 0;
        try {
            result = new Number(from.toFixed(count)).valueOf();
        } catch (error) {
            result = 0;
        }
        return result
    }
}