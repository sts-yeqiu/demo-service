import { Service } from "typedi";
import { JsonController, Get, Post, Param, Delete, Body, Put, QueryParam, QueryParams, Req, Res, UploadedFile, UploadedFiles } from "routing-controllers";
import { RestResultModel } from "../shared/interfaces/rest.interface";
import { ResultCodeEnum } from "../core/enum/resultCode.enum";
import { RestHelper } from "../shared/helpers/rest.helper";
import { FileService } from "../services/mongo/file.service";
import { IFile } from "../repository/mogoose/file.entities";
import { FileModel } from "../models/file.model";

/**
 * 
 */
@Service()
@JsonController()
export class FileController {

  constructor(private fileService: FileService) { }

 /**
  * 测试上传照片
  * @param userId 
  * @param file 
  * @param request 
  */
  @Post("/users/:userId/photos")
  uploadJobsPhotos(@Param("userId") userId: string, @UploadedFiles("files[]") file: any, @Req() request: any): Promise<RestResultModel> {
  //  console.log(file);
    return new Promise<RestResultModel>((resolve, reject) => {
      this.fileService.uploadJobsPhotos(userId, file, request).then(result => {
        resolve(RestHelper.create200Result({ fileId: result }));
      });
    });
  }

 
}