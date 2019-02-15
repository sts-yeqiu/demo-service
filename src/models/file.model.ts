/**
 * 文件模型
 */
export interface FileModel {
    fileId:any; //文件id
    type: string; // 文件类型
    name: string; // 文件名称
    relationId: any;  //关联ID
    fileSize: string; // 文件大小
    fileContent: any;//文件 
}
