import nodemailer from "nodemailer";
import { config } from "../config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.app_user,
    pass: config.app_pass,
  },
});

export const nodemailerTransporter = transporter;
