import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import bodyParser from "body-parser";
import session from "express-session";
import controllers from "@controllers/controllers";
import mockDb from "@db/mockDb";
import rowService from "@services/row.service";
import columnService from "@services/column.service";
import Graceful from "node-graceful";
import errors from "@shared/errors";

let sessionId = 1;
const app = express();
app.use(bodyParser.json());
app.use(session({
  secret: "mgm secret",
  cookie: { secure: true, maxAge: 60000 },
  genid: () => (sessionId++).toString(),
  rolling: true,
}));

app.use("/api", controllers);

app.use((
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.json(Object.keys(error).includes("code") ? error: errors.Unknown);
});

(async () => {
  const { columns, rows, maxRowId, rowHeadId } = await mockDb.load();
  rowService.loadRow(rows);
  rowService.loadConfig(maxRowId, rowHeadId);
  columnService.loadColumn(columns);
})();
Graceful.on("exit", async () => {
  const data = {
    rows: rowService.getRowsData(),
    columns: columnService.getColumns(),
    maxRowId: rowService.getMaxRowId(),
    rowHeadId: rowService.getRowHeadId(),
  }
  await mockDb.save(data);
})
app.listen(5000, () => {
  console.log("Server listening on http://localhost:5000");
});
