import { Request, Response } from "express";
import { User } from "../models/User";

export class UsersController {
  static async getUser(request: Request, response: Response) {
    const user = request.user;

    return response.json({ user });
  }

  static async update(request: Request, response: Response) {
    const data = request.body;
    const id = request.user.id;

    if (!id) return response.status(401).send();

    const user = await User.findByPk(id);

    if (!user) return response.status(400).send();

    user.username = data.username;

    user.save();

    return response.status(204).send();
  }

  static async changeInfo(request: Request, response: Response) {
    const info = request.body.info;
    const id = request.user.id;

    if (!id) return response.status(401).send();

    const user = await User.findByPk(id);

    if (!user) return response.status(400).send();

    user.info = info;

    user.save();

    return response.status(204).send();
  }
}
