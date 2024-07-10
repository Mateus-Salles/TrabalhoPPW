import { Request, Response } from "express";

export class UsersController {
    static async getUser(request: Request, response: Response) {
        const user = request.user

        return response.json({ user })
    }
}