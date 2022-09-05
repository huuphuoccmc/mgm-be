import columnService from "@services/column.service";
import dataTypeService from "@services/data-type.service";
import rowService from "@services/row.service";
import { Request, Response, Router } from "express";

const router = Router();

const validateRecord = (record: any) => 
    rowService.validateRowData(record, columnService.getColumns().filter(col => !columnService.isPrimary(col)), dataTypeService.validateData);
router.get("/", (req: Request, res: Response) => {
    const lastRowId = req.query.lastRowId ? +req.query.lastRowId : undefined;
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10;

    const records = rowService.getRowsData(lastRowId, pageSize);
    res.json({ code: 0, data: records });
});
router.post("/next", (req: Request, res: Response) => {
    const { rowId, record } = req.body;
    validateRecord(record);
    const id = rowService.addNext(rowId, record);
    res.send({ code: 0, data: { rowId: id } });
});
router.post("/child", (req: Request, res: Response) => {
    const { rowId, record } = req.body;
    validateRecord(record);
    const id = rowService.addChild(rowId, record);
    res.send({ code: 0, data: { rowId: id } });
}
);
router.put("/", (req: Request, res: Response) => {
    const { record } = req.body;
    validateRecord(record);
    rowService.editRow(record);
    res.send({ code: 0, message: "Success" });
});
router.put("/move/next", (req: Request, res: Response) => {
    const { rowId, oldRowId } = req.body;
    rowService.moveAsNext(rowId, oldRowId);
    res.send({ code: 0, message: "Success" });
});
router.put("/move/child", (req: Request, res: Response) => {
    const { parentId, rowId } = req.body;
    rowService.moveAsChild(rowId, parentId);
    res.send({ code: 0, message: "Success" });
});

router.delete("/", (req: Request, res: Response) => {
    const { rowId } = req.body;
    rowService.removeRow(rowId);
    res.send({ code: 0, message: "Success" });
});

export default router;