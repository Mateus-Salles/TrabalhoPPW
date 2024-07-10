import { User } from "../models/User.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "default";

export class AuthController {
  static renderRegister(request: Request, response: Response) {
    return response.render("auth/register");
  }

  static renderLogin(request: Request, response: Response) {
    return response.render("auth/login");
  }

  static async login(request: Request, response: Response) {
    const { email, password } = request.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return response.status(401).redirect('/auth/login');
    }

    const payload = user.id;
    const token = jwt.sign({ id: payload }, JWT_SECRET, { expiresIn: "8h" });

    response.cookie("token", token, { httpOnly: true });
    return response.redirect("/home");
  }

  static async register(request: Request, response: Response) {
    const { email, password, username } = request.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      const user = await User.create({ email, password, username });

      const payload = user.id;
      const token = jwt.sign({ id: payload }, JWT_SECRET, { expiresIn: "8h" });

      response.cookie("token", token, { httpOnly: true });
      return response.redirect("/home");
    } else {
      return response.status(400).send();
    }
  }
}
