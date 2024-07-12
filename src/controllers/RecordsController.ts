import { Request, Response } from "express";
import { Record } from "../models/Record.js";

interface RecordBody {
  body: string;
  user_id: string;
  id?: string | number;
}

export class RecordsController {
  static async index(request: Request, response: Response) {
    const user = request.user
    const records = await Record.findAll({ where: { user_id: user.id } });
    return response.render("index", { pages: records, user });
  }

  static async store(request: Request, response: Response) {
    const user = request.user;
    const bodies: RecordBody[] = request.body.pages;
    try {
      const records = bodies.map((body) => {
        return { body: body.body || "", user_id: user.id || "" };
      });

      await Record.bulkCreate(records);

      return response.status(201).send();
    } catch (err) {
      return response.status(400).send();
    }
  }

  static async update(request: Request, response: Response) {
    const pages: RecordBody[] = request.body.pages;

    pages.forEach(async (page) => {
      const id = page.id;

      if (!id) return response.status(400).send();

      const record = await Record.findByPk(Number(page.id));

      if (!record) return response.status(400).send();

      record.body = page.body;

      await record.save();
    });

    return response.status(204).send();
  }
}
