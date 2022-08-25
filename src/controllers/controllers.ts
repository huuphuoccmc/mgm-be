import { Handler, IRouter, Router } from "express";

export abstract class Controller {
  path: string;
  router: IRouter = Router();

  constructor(path: string, middlewares: Handler[] = []) {
    this.path = path;
    this.initializeMiddlewares(middlewares);
  }

  public initializeMiddlewares(middlewares: Handler[] = []) {
    middlewares.forEach((mdw) => this.router.use(mdw));
  }
}
