import { User } from "../models/User.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "default";

export class AuthController {
  static async login(request: Request, response: Response) {
    const { email, password } = request.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return response.status(401).redirect("/auth/login");
    }

    const payload = user.id;
    const token = jwt.sign({ id: payload }, JWT_SECRET, { expiresIn: "8h" });

    response.cookie("token", token, { httpOnly: true });
    return response.redirect("/");
  }

  static async register(request: Request, response: Response) {
    const { email, password, username } = request.body;

    const checkUserExists = await User.findOne({ where: { email } });

    if (checkUserExists) {
      return response.status(400).send();
    }

    const user = await User.create({ email, password, username });

    const payload = user.id;
    const token = jwt.sign({ id: payload }, JWT_SECRET, { expiresIn: "8h" });

    response.cookie("token", token, { httpOnly: true });
    return response.redirect("/");
  }
}
