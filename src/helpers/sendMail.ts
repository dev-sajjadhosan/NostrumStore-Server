import { nodemailerTransporter } from "./nodemailer";

export const sendEmail = async (
  to: string,
  template: { subject: string; html: string }
) => {
  const mailOptions = {
    from: 'Multi Tenant Saas Platform" <multi-tenant-saas@gmail.com>',
    to,
    subject: template.subject,
    html: template.html,
  };

  return await nodemailerTransporter.sendMail(mailOptions);
};
