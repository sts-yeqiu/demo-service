import * as config from "config";

export interface AppConfig extends config.IConfig {
  env: string;
  server: {
    host: string;
    http_port: number;
    https_port: number;
    keyFile: string;
    certFile: string;
    routePrefix: string;
    downloadUrl: string;
    downloadFilePath: string;
  };
  mongoUrl: string;
  jwtKey: string;
  loggerFile: {
    filePath: string;
    maxSize: string | number;
    maxFiles: string | number;
  };
}

export default <AppConfig>config;
