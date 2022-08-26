import recordRepo from "@repos/record-repo";
import { Router, Request, Response, Handler } from "express";
import { Controller } from "./controllers";

export default class RecordController extends Controller {
    constructor(path: string, middlewares: Handler[] = []) {
        super(path, middlewares)
        this.initializeRouter();
    }
    public initializeRouter() {
        this.router.get("/", this.getRecords);
        this.router.post("/next", this.createNextRecord);
        this.router.post("/child", this.createChildRecord);
        this.router.put("/", this.changeRecord);
        this.router.put("/move/next", this.moveAsNext);
        this.router.put("/move/child", this.moveAsChild);
        this.router.delete("/", this.deleteRecord);
        this.router.put("/lock", this.acquireLock)
    }
    async deleteRecord(req: Request, res: Response) {
        const { rowId } = req.body;
        await recordRepo.deleteRecord(rowId);
        res.send({ code: 0, message: "Success" });
    }
    async moveAsChild(req: Request, res: Response) {
        const { rowId, oldRowId } = req.body;
        await recordRepo.moveAsChild(rowId, oldRowId);
        res.send({ code: 0, message: "Success" });
    }
    async moveAsNext(req: Request, res: Response) {
        const { rowId, oldRowId } = req.body;
        await recordRepo.moveAsNext(rowId, oldRowId);
        res.send({ code: 0, message: "Success" });
    }
    acquireLock(req: Request, res: Response) {
        res.send("Method not implemented.");
    }
    async createNextRecord(req: Request, res: Response) {
        const { rowId, record } = req.body;
        const id = await recordRepo.createNextRecord(rowId, record);
        res.send({ code: 0, data: { rowId: id } });
    }
    async createChildRecord(req: Request, res: Response) {
        const { rowId, record } = req.body;
        const id = await recordRepo.createChildRecord(rowId, record);
        res.send({ code: 0, data: { rowId: id } });
    }
    async changeRecord(req: Request, res: Response) {
        const { rowId, record } = req.body;
        await recordRepo.changeRecord(rowId, record);
        res.send({ code: 0, message: "Success" });
    }
    async getRecords(req: Request, res: Response) {
        const page = +(req.query.page || 1) || 1;
        const pageSize = +(req.query.pageSize || 10) || 10;

        const records = await recordRepo.getRecords(page, pageSize);
        res.json({ code: 0, data: records });
    }
}