import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma';
import { signToken, generateRandomToken } from '../utils/jwt';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../utils/validators';
import {
  sendEmail,
  buildVerifyEmailHtml,
  buildResetPasswordHtml,
} from '../services/emailService';

export async function register(req: Request, res: Response): Promise<void> {
  const data = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    res.status(409).json({ error: 'Email telah didaftarkan' });
    return;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
    },
  });

  const token = generateRandomToken();
  await prisma.emailToken.create({
    data: {
      token,
      type: 'VERIFY',
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  await sendEmail({
    to: user.email,
    subject: 'Sahkan Email Anda - CCMS',
    html: buildVerifyEmailHtml(token, user.name),
  }).catch((err) => console.error('Email send failed:', err));

  const jwt = signToken({ userId: user.id, email: user.email, role: user.role });
  res.status(201).json({
    message: 'Pendaftaran berjaya. Sila semak email untuk pengesahan.',
    token: jwt,
    user: { id: user.id, email: user.email, name: user.name, role: user.role, verified: user.verified },
  });
}

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  const { token } = req.body;

  const emailToken = await prisma.emailToken.findUnique({ where: { token } });
  if (!emailToken || emailToken.type !== 'VERIFY' || emailToken.expiresAt < new Date()) {
    res.status(400).json({ error: 'Token tidak sah atau tamat tempoh' });
    return;
  }

  await prisma.user.update({
    where: { id: emailToken.userId },
    data: { verified: true },
  });

  await prisma.emailToken.delete({ where: { id: emailToken.id } });

  res.json({ message: 'Email berjaya disahkan' });
}

export async function login(req: Request, res: Response): Promise<void> {
  const data = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    res.status(401).json({ error: 'Email atau password salah' });
    return;
  }

  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) {
    res.status(401).json({ error: 'Email atau password salah' });
    return;
  }

  const jwt = signToken({ userId: user.id, email: user.email, role: user.role });
  res.json({
    message: 'Log masuk berjaya',
    token: jwt,
    user: { id: user.id, email: user.email, name: user.name, role: user.role, verified: user.verified },
  });
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const data = forgotPasswordSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    res.json({ message: 'Jika email wujud, pautan reset akan dihantar.' });
    return;
  }

  const token = generateRandomToken();
  await prisma.emailToken.create({
    data: {
      token,
      type: 'RESET',
      userId: user.id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  await sendEmail({
    to: user.email,
    subject: 'Set Semula Password - CCMS',
    html: buildResetPasswordHtml(token, user.name),
  }).catch((err) => console.error('Email send failed:', err));

  res.json({ message: 'Jika email wujud, pautan reset akan dihantar.' });
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const data = resetPasswordSchema.parse(req.body);

  const emailToken = await prisma.emailToken.findUnique({ where: { token: data.token } });
  if (!emailToken || emailToken.type !== 'RESET' || emailToken.expiresAt < new Date()) {
    res.status(400).json({ error: 'Token tidak sah atau tamat tempoh' });
    return;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  await prisma.user.update({
    where: { id: emailToken.userId },
    data: { password: hashedPassword },
  });

  await prisma.emailToken.delete({ where: { id: emailToken.id } });

  res.json({ message: 'Password berjaya diset semula' });
}
