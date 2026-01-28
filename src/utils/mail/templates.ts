// A helper to keep styles consistent across all emails
const emailWrapper = (content: string) => `
  <div style="background-color: #f9fafb; padding: 40px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
      <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Multi Tenant Saas Server</h1>
      </div>
      <div style="padding: 40px; line-height: 1.6;">
        ${content}
      </div>
      <div style="padding: 20px; background-color: #f3f4f6; text-align: center; font-size: 12px; color: #6b7280;">
        &copy; ${new Date().getFullYear()} Multi Tenant Saas Server. All rights reserved. <br />
        If you didn't request this, please ignore this email.
      </div>
    </div>
  </div>
`;

export const emailTemplates = {
  JOIN_REQUEST_PENDING: (userName: string) => ({
    subject: `Update on your request to join Multi Tenant Saas Server`,
    html: emailWrapper(`
      <h2 style="color: #111827; margin-top: 0;">Hi ${userName},</h2>
      <p>Thank you for your interest in joining <strong>Multi Tenant Saas Server</strong>. We've successfully received your request!</p>
      <p>Your membership is currently <strong>pending review</strong> by the company administrator. You don't need to do anything else right now.</p>
      <div style="margin: 30px 0; text-align: center;">
        <a href="https://yourapp.com/dashboard" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Check Request Status</a>
      </div>
      <p>We will notify you via email the moment a decision is made. Usually, this takes 1-2 business days.</p>
      <p>Best regards,<br /><strong>The Team</strong></p>
    `),
  }),

  JOIN_REQUEST_APPROVED: (userName: string, url: string) => ({
    subject: `Action Required: You've been approved for Multi Tenant Saas Server!`,
    html: emailWrapper(`
      <h2 style="color: #111827; margin-top: 0;">Congratulations ${userName}!</h2>
      <p>We are excited to let you know that your request to join <strong>Multi Tenant Saas Server</strong> has been <strong>approved</strong>.</p>
      <p>You now have full access to the company's workspace, resources, and team communication tools.</p>
      <div style="margin: 30px 0; text-align: center;">
        <a href=${url} style="background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Get Started Now</a>
      </div>
      <p>If you have any trouble accessing the workspace, please reach out to our support team.</p>
      <p>Welcome aboard,<br /><strong>The Multi Tenant Saas Server Team</strong></p>
    `),
  }),
};
