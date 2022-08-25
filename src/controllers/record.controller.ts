import { Router, Request, Response, Handler } from "express";
import { Controller } from "./controllers";

export default class RecordController extends Controller {
    constructor(path: string, middlewares: Handler[] = []) {
        super(path, middlewares)
        this.initializeRouter();
    }
    public initializeRouter() {
        this.router.get("/", this.getRecords);
        this.router.post("/", this.createRecord);
        this.router.put("/", this.changeRecord);
        this.router.put("/lock", this.acquireLock)
    }
    changeRecord(req: Request, res: Response) {
        res.send("Method not implemented.");
    }
    acquireLock(req: Request, res: Response) {
        res.send("Method not implemented.");
    }
    createRecord(req: Request, res: Response) {
        res.send("Method not implemented.");
    }
    getRecords(req: Request, res: Response) {
        res.send("Method not implemented.");
    }
}