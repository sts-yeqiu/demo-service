import * as XLSX from 'xlsx';
const { read, utils: { sheet_to_json } } = XLSX;

/**
 * XLSX helper class.
 */
export class XLSXHelper {

    /**
     * 转换excel成json数据格式
     * 
     * @param filePath 
     */
    static readExcelFilePathToJson(filePath: string): any {
        const options: XLSX.ParsingOptions = {
            cellDates: true
        };

        const wb: XLSX.WorkBook = XLSX.readFile(filePath, options);
        const ws: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[0]];

        let data: any[][] = sheet_to_json(ws, { header: 1, raw: true });
        return data;
    }

    /**
     * 转换excel成json数据格式
     * 
     * @param data 
     */
    static readExcelDataToJson(data: any): any {
        const options: XLSX.ParsingOptions = {
            cellDates: true
        };

        const wb: XLSX.WorkBook = XLSX.read(data, options);

        const ws: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[0]];

        let dataJson: any[][] = sheet_to_json(ws, { header: 1, raw: true });
        return dataJson;
    }

}



