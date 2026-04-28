import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { createComplaintSchema, updateComplaintSchema } from '../utils/validators';
import { sendEmail, buildComplaintCreatedHtml } from '../services/emailService';

function qstr(val: unknown): string | undefined {
  return typeof val === 'string' ? val : undefined;
}

export async function createComplaint(req: Request, res: Response): Promise<void> {
  const data = createComplaintSchema.parse(req.body);

  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) {
    res.status(400).json({ error: 'Kategori tidak wujud' });
    return;
  }

  const complaint = await prisma.complaint.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority || 'MEDIUM',
      categoryId: data.categoryId,
      customerId: req.user!.userId,
    },
    include: { category: true },
  });

  await sendEmail({
    to: req.user!.email,
    subject: 'Complaint Direkodkan - CCMS',
    html: buildComplaintCreatedHtml(req.user!.email, complaint.title),
  }).catch((err) => console.error('Email send failed:', err));

  res.status(201).json(complaint);
}

export async function getMyComplaints(req: Request, res: Response): Promise<void> {
  const page = parseInt(qstr(req.query.page) || '1') || 1;
  const limit = parseInt(qstr(req.query.limit) || '10') || 10;
  const skip = (page - 1) * limit;

  const [complaints, total] = await Promise.all([
    prisma.complaint.findMany({
      where: { customerId: req.user!.userId },
      include: { category: true, assignedAdmin: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.complaint.count({ where: { customerId: req.user!.userId } }),
  ]);

  res.json({ data: complaints, total, page, limit });
}

export async function getComplaintById(req: Request, res: Response): Promise<void> {
  const complaint = await prisma.complaint.findUnique({
    where: { id: req.params.id as string },
    include: { category: true, assignedAdmin: { select: { id: true, name: true, email: true } } },
  }) as any;

  if (!complaint) {
    res.status(404).json({ error: 'Complaint tidak dijumpai' });
    return;
  }

  if (req.user!.role === 'CUSTOMER' && complaint.customerId !== req.user!.userId) {
    res.status(403).json({ error: 'Akses ditolak' });
    return;
  }

  res.json(complaint);
}

export async function updateComplaint(req: Request, res: Response): Promise<void> {
  const complaint = await prisma.complaint.findUnique({
    where: { id: req.params.id as string },
  }) as any;

  if (!complaint) {
    res.status(404).json({ error: 'Complaint tidak dijumpai' });
    return;
  }

  if (complaint.customerId !== req.user!.userId) {
    res.status(403).json({ error: 'Akses ditolak' });
    return;
  }

  if (complaint.status === 'CLOSED') {
    res.status(400).json({ error: 'Complaint yang Closed tidak boleh dikemaskini' });
    return;
  }

  const data = updateComplaintSchema.parse(req.body);
  const updated = await prisma.complaint.update({
    where: { id: req.params.id as string },
    data,
    include: { category: true },
  });

  res.json(updated);
}

export async function deleteComplaint(req: Request, res: Response): Promise<void> {
  const complaint = await prisma.complaint.findUnique({
    where: { id: req.params.id as string },
  }) as any;

  if (!complaint) {
    res.status(404).json({ error: 'Complaint tidak dijumpai' });
    return;
  }

  if (complaint.customerId !== req.user!.userId) {
    res.status(403).json({ error: 'Akses ditolak' });
    return;
  }

  if (complaint.status !== 'NEW') {
    res.status(400).json({ error: 'Hanya complaint status New boleh dipadam' });
    return;
  }

  await prisma.complaint.delete({ where: { id: req.params.id as string } });
  res.json({ message: 'Complaint berjaya dipadam' });
}
