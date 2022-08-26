import { Controller } from '@controllers/controllers';
import express, { Handler, Application } from 'express';
 
class App {
  public app: Application;
  public port: number;
 
  constructor(controllers: Controller[], middlewares: (any)[], port: number, errorHandlers: any[] = []) {
    this.app = express();
    this.port = port;
 
    this.initializeMiddlewares(middlewares);
    this.initializeControllers(controllers);
    this.inititalizeErrorHandler(errorHandlers);
  }
 
  private initializeMiddlewares(middlewares: (Handler)[]) {
    middlewares.forEach(mdw => {
        this.app.use(mdw);
    })
  }
 
  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router);
    });
  }
  private inititalizeErrorHandler(errorHandlers: any[]) {
    errorHandlers.forEach(e => this.app.use(e));
  }
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
 
export default App;