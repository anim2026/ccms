import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email tidak sah'),
  password: z.string().min(6, 'Password minimum 6 aksara'),
  name: z.string().min(1, 'Nama diperlukan'),
});

export const loginSchema = z.object({
  email: z.string().email('Email tidak sah'),
  password: z.string().min(1, 'Password diperlukan'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak sah'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token diperlukan'),
  password: z.string().min(6, 'Password minimum 6 aksara'),
});

export const createComplaintSchema = z.object({
  title: z.string().min(3, 'Tajuk minimum 3 aksara'),
  description: z.string().min(10, 'Deskripsi minimum 10 aksara'),
  categoryId: z.string().min(1, 'Kategori diperlukan'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});

export const updateComplaintSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  categoryId: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});

export const statusSchema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
});

export const assignSchema = z.object({
  assignedAdminId: z.string().min(1, 'Admin ID diperlukan'),
});

export const adminUpdateComplaintSchema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  assignedAdminId: z.string().optional(),
});
