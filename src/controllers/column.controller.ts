import { Request, Response, Handler } from "express";
import { Controller } from "./controllers";
import columnRepo from "@repos/column-repo";
import { LockingResourceError, LockType } from "@shared/errors";
import ILock from "@interfaces/lock.interface";

export default class ColumnController extends Controller {
  lock: ILock;
  constructor(path: string, middlewares: Handler[] = [], lock: ILock) {
    super(path, middlewares);
    this.lock = lock;
    this.initializeRouter();
  }
  public initializeRouter() {
    this.router.get("/", this.getColumns);
    this.router.post("/", this.createColumn);
    this.router.put("/", this.changeColumn);
    this.router.put("/lock", this.acquireLock);
  }
  async getColumns(req: Request, res: Response) {
    const columns = await columnRepo.getColumns();
    res.json({ code: 0, data: columns });
  }
  async createColumn(req: Request, res: Response) {
    const { columnInfo } = req.body;
    await columnRepo.createColumn(columnInfo);
    res.json({ code: 0, message: "Success" });
  }
  changeColumn(req: Request, res: Response) {
    const userId = +req.session.id;
    const tabId = req.query.tabId || 1;
    if (!this.lock.compare(userId, +tabId)) {
      throw new LockingResourceError(this.lock, LockType.Col);
    }

    const { columnName, columnInfo } = req.body;
    columnRepo.changeColumn(columnName, columnInfo);

    this.lock.release()
    res.json({ code: 0, message: "Success" });
  }
  acquireLock(req: Request, res: Response) {
    if (this.lock.isAcquired())
      throw new LockingResourceError(this.lock, LockType.Col);
    const userId = +req.session.id;
    const tabId = req.query.tabId || 1;
    this.lock?.lock({ userId, tabId: +tabId });

    res.json({ code: 0, message: "Success" });
  }
}
