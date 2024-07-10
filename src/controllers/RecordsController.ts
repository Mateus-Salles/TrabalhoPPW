import { Request, Response } from "express";
import { Record } from "../models/Record.js";

export class RecordsController {
  static async index(request: Request, response: Response) {
    // const records = await Record.findAll();
    const records = [{a:'oi'}, {a:'po'}, {a:'po'}]
    return response.render("index", { pages: records });
  }

  static async store(request: Request, response: Response) {}
}
