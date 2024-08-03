import nodemailer from "nodemailer";

const config = {
  service: process.env.SMTP_SERVICE,
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
};

const transporter = nodemailer.createTransport({
  service: config.service,
  secure: true,
  auth: {
    user: config.user,
    pass: config.pass
  }
})

export default transporter;
