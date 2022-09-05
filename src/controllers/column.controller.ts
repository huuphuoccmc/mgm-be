import { Request, Response, Router } from "express";
import columnService from "@services/column.service";
import dataTypeService from "@services/data-type.service";
import errors from "@shared/errors";
import rowService from "@services/row.service";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json(columnService.getColumns())
});

router.post("/", (req: Request, res: Response) => {
  const { columnInfo } = req.body;
  if (!dataTypeService.isValidDataType(columnInfo.dataType))
    throw errors.InvalidDataType;
  columnService.addColumn(columnInfo);
  rowService.onAddColumn(columnInfo);
  res.json({ code: 0, message: "Success" });
});

router.put("/", (req: Request, res: Response) => {
  const { oldColumnName, columnInfo } = req.body;
  if (!dataTypeService.isValidDataType(columnInfo.dataType))
    throw errors.InvalidDataType;
  const oldColumn = columnService.editColumn(oldColumnName, columnInfo);
  rowService.onUpdateColumn(oldColumn, columnInfo, dataTypeService.castData);
});

router.delete("/", (req: Request, res: Response) => {
  const { columnName } = req.body;
  columnService.deleteColumn(columnName);
  rowService.onDeleteColumn(columnName);
  res.json({ code: 0, message: "Success" });
});

export default router;