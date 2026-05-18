import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Email not sent.");
    return;
  }
  
  return await resend.emails.send({
    from: "AtomQuest <noreply@atomquest.dev>",
    to,
    subject,
    html,
  });
}
