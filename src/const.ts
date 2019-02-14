import { LoggingMiddleware } from "./shared/middlewares/logging.middleware";
import { AuthMiddleware } from "./shared/middlewares/auth.middleware";
import { ErrorMiddleware } from "./shared/middlewares/error.middleware";
import { ListMiddleware } from "./shared/middlewares/list.middleware";
import { LogMiddleware } from "./middlewares/log.middleware";
import { DebugHandler } from "./services/events-handlers/debugHandler.service";
import { ServerInfoController } from "./controllers/serverInfo.controller";
import { UserController } from "./controllers/user.controller";
import { TokenController } from "./controllers/token.controller";

export const CONTROLLERS: any[] = [
    UserController,
    TokenController,
    ServerInfoController
];

export const MIDDLEWARES = [AuthMiddleware, ErrorMiddleware, LoggingMiddleware, ListMiddleware, LogMiddleware];

export const INTERCEPTORS: any[] = [];

export const EVENTS_HANDLERS: any = [DebugHandler];
