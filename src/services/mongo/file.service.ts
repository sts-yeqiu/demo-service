import * as mongoose from 'mongoose';
import { Service } from "typedi";
import { QueryParamHelper } from "../../shared/helpers/queryParam.helper";
import { MongoService } from "./mongo.service";
import { IFile } from '../../repository/mogoose/file.entities';
import { ResultCodeEnum } from '../../core/enum/resultCode.enum';
import { FileTypeEnum } from '../../core/enum/fileType.enum';



/**
 * 文件服务
 */
@Service()
export class FileService {

    constructor(private ms: MongoService) { }

    /**
     * 上传多个附件
     * @param userId 
     * @param files 
     * @param request 
     */
    async  uploadJobsPhotos(userId: string, files: any[], request: any): Promise<any[]> {
        let fileIds: any[] = [];//附件Id的数组
        if (files.length > 0) {
            for (let file of files) {
                let entity = <IFile>{};
                entity._id = mongoose.Types.ObjectId().toHexString();
                entity.type = 'JPGTest'; // 文件类型
                entity.relationId = userId; //关联ID,用户ID
                entity.name = file.originalname; // 文件名称
                entity.fileSize = file.size;// 文件大小
                entity.fileContent = file.buffer;//文件
                this.ms.FileModel.create(entity);
                fileIds.push(entity._id);
            }
        }
        /** 回填对应的功能的附件的数据 */

        
        return new Promise<any[]>((resolve, reject) => {
            resolve(fileIds);
        }).catch(error => {
            console.log(error);
            return null;
        });
    }

}