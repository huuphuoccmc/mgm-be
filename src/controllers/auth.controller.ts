import { Request, Response, Router } from "express";
import { Controller } from "./controllers";

export default class AuthController extends Controller {
  constructor(path: string) {
    super(path);
    this.initializeRouter();
  }
  public initializeRouter() {
    this.router.post("/", this.getNewSession);
  }
  getNewSession(req: Request, res: Response) {
    res.send("Method not implemented.");
  }
}
