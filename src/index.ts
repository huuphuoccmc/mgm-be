import App from "./app";
import bodyParser from "body-parser";
import ColumnController from "./controllers/column.controller";
import RecordController from "./controllers/record.controller";
import AuthController from "./controllers/auth.controller";
import session from "express-session";
import Lock from "@shared/lock";

let sessionId = 1;
const app = new App(
  [
    new ColumnController("/column", [], new Lock(30000)),
    new RecordController("/record"),
    new AuthController("/auth"),
  ],
  [
    bodyParser.json(),
    session({
      secret: "mgm secret",
      cookie: { secure: true, maxAge: 60000 },
      genid: () => (sessionId++).toString(),
      rolling: true,
    }),
  ],
  5000
);

app.listen();
