import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

type JwtPayload = {
  id: string;
};

export async function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const token = request.cookies.token || request.headers.authorization?.split(' ')[1];

  if (!token) {
    return response.status(401).redirect('/auth/login');
  }

  // const [, token] = fullToken.split(" ");

  const JWT_SECRET = process.env.JWT_SECRET || "default";

  try {
    const { id } = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await User.findByPk(id);

    if (!user) throw new Error();

    const { password: _, ...rest } = user;

    request.user = rest;

    return next();
  } catch (err) {
    return response.status(401).redirect('/auth/login');
  }
}
