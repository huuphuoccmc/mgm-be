import { Router } from "express";
import columnController from "@controllers/column.controller";
import recordController from "@controllers/record.controller";
const router = Router();

router.use("/column", columnController);
router.use("/record", recordController);

export default router;
