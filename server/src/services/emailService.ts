import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: env.SMTP_USER
    ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
    : undefined,
});

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailPayload): Promise<void> {
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

export function buildVerifyEmailHtml(token: string, name: string): string {
  const link = `${env.CLIENT_URL}/verify-email?token=${token}`;
  return `
    <h2>Salam ${name},</h2>
    <p>Sila sahkan email anda dengan klik pautan di bawah:</p>
    <a href="${link}">${link}</a>
    <p>Pautan tamat dalam 24 jam.</p>
  `;
}

export function buildResetPasswordHtml(token: string, name: string): string {
  const link = `${env.CLIENT_URL}/reset-password?token=${token}`;
  return `
    <h2>Salam ${name},</h2>
    <p>Klik pautan di bawah untuk set semula password:</p>
    <a href="${link}">${link}</a>
    <p>Pautan tamat dalam 1 jam.</p>
  `;
}

export function buildComplaintCreatedHtml(name: string, title: string): string {
  return `
    <h2>Salam ${name},</h2>
    <p>Complaint anda <strong>"${title}"</strong> telah direkodkan.</p>
    <p>Status: <strong>Open</strong></p>
  `;
}

export function buildStatusChangeHtml(name: string, title: string, status: string): string {
  return `
    <h2>Salam ${name},</h2>
    <p>Status complaint <strong>"${title}"</strong> telah dikemaskini kepada:</p>
    <h3>${status}</h3>
  `;
}

export function buildAssignmentHtml(name: string, title: string): string {
  return `
    <h2>Salam ${name},</h2>
    <p>Anda telah di-assign kepada complaint:</p>
    <h3>"${title}"</h3>
  `;
}
