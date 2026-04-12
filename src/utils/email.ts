import nodemailer from "nodemailer";
import status from "http-status";
import path from "path";
import ejs from "ejs";
import { config } from "../config";

const transporter = nodemailer.createTransport({
  host: config.smtp_host,
  port: Number(config.smtp_port),
  secure: false,
  auth: {
    user: config.app_user,
    pass: config.app_pass,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html?: string;
  templateName: string;
  templateData: Record<string, any>;
  attachments?: {
    filename: string;
    content: string | Buffer;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendEmailOptions) => {
  try {
    const templatePath = path.resolve(
      process.cwd(),
      `src/templates/${templateName}.ejs`,
    );
    // console.log({ templatePath })
    // console.log({ templateData })
    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      from: config.smtp_from,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
    console.log(`Email sent to ${to} with message ID ${info.messageId}`);
  } catch (error) {
    console.log("Error sending email", error);
    throw new Error("Failed to send email");
  }
};
