/* Sends the "someone applied for a job" notification email, with the CV
   attached, to the hiring inbox. Configured entirely via env vars; if
   SMTP_HOST isn't set this becomes a no-op (returns false) so an
   application still saves to the DB even when email isn't configured yet —
   same "never let the notification step block the real submission" rule
   leads.ts follows for its Odoo push.

   Env vars needed to actually send:
     SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS   — the mailbox to send from
     JOBS_NOTIFY_EMAIL                            — inbox to receive applications
                                                     (falls back to SMTP_USER) */
import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!process.env.SMTP_HOST) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
  }
  return transporter;
}

export async function sendJobApplicationEmail(input: {
  jobTitle: string;
  fullName: string;
  email: string;
  phone?: string;
  coverNote?: string;
  cvPath: string;
  cvFilename: string;
}): Promise<boolean> {
  const t = getTransporter();
  if (!t) {
    console.log("mailer: SMTP not configured, skipping job application email");
    return false;
  }
  const to = process.env.JOBS_NOTIFY_EMAIL || process.env.SMTP_USER;
  await t.sendMail({
    from: process.env.SMTP_USER,
    to,
    replyTo: input.email,
    subject: `New application: ${input.jobTitle} — ${input.fullName}`,
    text: [
      `${input.fullName} applied for "${input.jobTitle}".`,
      "",
      `Email: ${input.email}`,
      input.phone ? `Phone: ${input.phone}` : null,
      "",
      input.coverNote || "(no cover note)",
    ].filter(Boolean).join("\n"),
    attachments: [{ filename: input.cvFilename, path: input.cvPath }],
  });
  return true;
}
