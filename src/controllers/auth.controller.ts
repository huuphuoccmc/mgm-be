import { Request, Response } from "express";
const createSession = (req: Request, res: Response) => {
  res.json({
    code: 0, data: { userId: req.session.id }
  });
};

export default {
  createSession,
} as const;