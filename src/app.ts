import { Controller } from '@controllers/controllers';
import express, { Handler, Application } from 'express';
 
class App {
  public app: Application;
  public port: number;
 
  constructor(controllers: Controller[], middlewares: (Handler)[], port: number) {
    this.app = express();
    this.port = port;
 
    this.initializeMiddlewares(middlewares);
    this.initializeControllers(controllers);
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
 
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
 
export default App;