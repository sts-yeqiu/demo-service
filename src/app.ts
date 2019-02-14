import * as express from "express";
import { useExpressServer, useContainer } from "routing-controllers";
import Container from "typedi";
import { CONTROLLERS, MIDDLEWARES, INTERCEPTORS } from "./const";
import appConfig from './config';

let app = express();

useContainer(Container);

useExpressServer(app, {
  routePrefix: "demo",
  cors: true,
  classTransformer: false,
  defaultErrorHandler: false,
  middlewares: MIDDLEWARES,
  controllers: CONTROLLERS,
  interceptors: INTERCEPTORS
});

//文件下载路径 
// app.use('/download', express.static('/home/app'));

//文件下载路径 
app.use('/download', express.static(appConfig.server.downloadFilePath));
export default app;
