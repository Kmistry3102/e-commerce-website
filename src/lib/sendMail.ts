// src/lib/sendMail.ts
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export async function sendMail(
  subject: string,
  receiver: string,
  html: string
) {
  const {
    NODEMAILER_HOST,
    NODEMAILER_PORT,
    NODEMAILER_EMAIL,
    NODEMAILER_PASSWORD,
  } = process.env;

  if (!NODEMAILER_HOST || !NODEMAILER_PORT || !NODEMAILER_EMAIL || !NODEMAILER_PASSWORD) {
    throw new Error("Missing required mail env vars.");
  }

  const transporter = nodemailer.createTransport({
    host: NODEMAILER_HOST,
    port: Number(NODEMAILER_PORT),            // must be a number
    secure: Number(NODEMAILER_PORT) === 465,  // true for 465, false for others (e.g., 587)
    auth: {
      user: NODEMAILER_EMAIL,
      pass: NODEMAILER_PASSWORD,
    },
  } satisfies SMTPTransport.Options);         // <- key: use SMTP transport options

  const mailOptions = {
    from: `"Khushi Mistry" <${NODEMAILER_EMAIL}>`,
    to: receiver,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true as const };
  } catch (error) {
    return { success: false as const, message: (error as Error).message };
  }
}
