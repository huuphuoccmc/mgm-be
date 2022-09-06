export {}
declare module 'express-async-errors';
import "express-session";
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}