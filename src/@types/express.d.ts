import { User } from "../models/User.ts";

declare global {
  namespace Express {
    export interface Request {
      user: Partial<User>
    }
  }
}
