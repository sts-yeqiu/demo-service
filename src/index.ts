import "reflect-metadata";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import appConfig from "./config";
import app from "./app";
import Container from "typedi";
import { EventsService } from "./shared/services/events.service"
import { EVENTS_HANDLERS } from "./const";

var options = {
  key: fs.readFileSync(appConfig.server.keyFile),
  cert: fs.readFileSync(appConfig.server.certFile)
};

var httpsServer = https.createServer(options, app);
httpsServer.listen(appConfig.server.https_port);
console.log(
  "the https server is listening on : " + appConfig.server.https_port
);

var httpServer = http.createServer(app);
httpServer.listen(appConfig.server.http_port);
console.log("the http server is listening on : " + appConfig.server.http_port);
 
var eventsService = Container.get(EventsService);
eventsService.use(EVENTS_HANDLERS);