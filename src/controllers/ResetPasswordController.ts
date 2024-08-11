import { Request, Response } from "express";
import { User } from "../models/User";
import { ResetPassword } from "../models/ResetPassword";
import { Op } from "sequelize";
import { fileURLToPath } from "node:url";
import mail from "../mail/Mail";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import ejs from "ejs";
import path from "node:path";

export class ResetPasswordController {
  static async render(request: Request, response: Response) {
    const { token } = request.query;

    if (!token) return response.status(400).send();

    const resetPassword = await ResetPassword.findOne({
      where: { token: token.toString() },
    });

    if (!resetPassword || !(resetPassword.expires_in > new Date(Date.now())))
      return response.status(401).send();

    return response.render("pages/reset-password", {
      id: resetPassword.user_id,
    });
  }

  static async send(request: Request, response: Response) {
    const { email } = request.body;

    if (!email) return response.status(400).send();

    const user = await User.findOne({ where: { email } });

    if (!user) return response.status(400).send();

    const hash = crypto.randomBytes(20).toString("hex");

    const data = {
      user_id: user.id,
      token: hash,
    };

    const { token } = await ResetPassword.create(data);

    const username = user.username;
    const link = `http://localhost:3333/password/verify?token=${token}`;

    const filePath = path.join(
      fileURLToPath(import.meta.url),
      "..",
      "..",
      "..",
      "resources",
      "views",
      "mail",
      "reset-password.ejs"
    );

    const html = await ejs.renderFile(filePath, {
      username,
      link,
    });

    mail.sendMail(
      {
        from: "mateussallesmelo@gmail.com",
        to: email,
        subject: "Recuperação de senha",
        html,
      },
      (err) => {
        if (err) {
          console.error(err);
          return response.status(500).send();
        }

        console.log("Email Enviado");

        return response.status(200).send();
      }
    );
  }

  static async reset(request: Request, response: Response) {
    const id = request.params.id;
    const { password, confirm } = request.body;

    if (!password || !confirm || !(password === confirm))
      return response.status(400).send();

    const user = await User.findByPk(id);

    if (!user) return response.status(400).send();

    const token = await ResetPassword.findOne({
      where: {
        user_id: user.id,
        expires_in: { [Op.gt]: new Date(Date.now()) },
      },
    });

    if (!token) return response.status(401).redirect("/");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user.password = hash;

    await user.save();

    response.cookie("token", "", { expires: new Date(0) });

    return response.status(204).redirect("/");
  }
}
