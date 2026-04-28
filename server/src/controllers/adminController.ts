import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { statusSchema, assignSchema, adminUpdateComplaintSchema } from '../utils/validators';
import { canTransition } from '../utils/statusMachine';
import {
  sendEmail,
  buildStatusChangeHtml,
  buildAssignmentHtml,
} from '../services/emailService';

function qstr(val: unknown): string | undefined {
  return typeof val === 'string' ? val : undefined;
}

export async function getAllComplaints(req: Request, res: Response): Promise<void> {
  const page = parseInt(qstr(req.query.page) || '1') || 1;
  const limit = parseInt(qstr(req.query.limit) || '10') || 10;
  const skip = (page - 1) * limit;
  const search = qstr(req.query.search) || '';
  const status = qstr(req.query.status);
  const priority = qstr(req.query.priority);

  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status) where.status = status;
  if (priority) where.priority = priority;

  const [complaints, total] = await Promise.all([
    prisma.complaint.findMany({
      where,
      include: {
        category: true,
        customer: { select: { id: true, name: true, email: true } },
        assignedAdmin: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.complaint.count({ where }),
  ]);

  res.json({ data: complaints, total, page, limit });
}

export async function assignComplaint(req: Request, res: Response): Promise<void> {
  const { assignedAdminId } = assignSchema.parse(req.body);

  const complaint = await prisma.complaint.findUnique({
    where: { id: req.params.id as string },
    include: { customer: true, assignedAdmin: true },
  }) as any;

  if (!complaint) {
    res.status(404).json({ error: 'Complaint tidak dijumpai' });
    return;
  }

  const admin = await prisma.user.findFirst({
    where: { id: assignedAdminId, role: 'ADMIN' },
  });

  if (!admin) {
    res.status(400).json({ error: 'Admin tidak wujud' });
    return;
  }

  const updated = await prisma.complaint.update({
    where: { id: req.params.id as string },
    data: { assignedAdminId },
    include: {
      category: true,
      customer: { select: { id: true, name: true, email: true } },
      assignedAdmin: { select: { id: true, name: true, email: true } },
    },
  });

  await sendEmail({
    to: admin.email,
    subject: 'Anda Di-Assign ke Complaint - CCMS',
    html: buildAssignmentHtml(admin.name, complaint.title),
  }).catch((err) => console.error('Email send failed:', err));

  res.json(updated);
}

export async function updateStatus(req: Request, res: Response): Promise<void> {
  const { status } = statusSchema.parse(req.body);

  const complaint = await prisma.complaint.findUnique({
    where: { id: req.params.id as string },
    include: { customer: { select: { id: true, name: true, email: true } } },
  }) as any;

  if (!complaint) {
    res.status(404).json({ error: 'Complaint tidak dijumpai' });
    return;
  }

  if (!canTransition(complaint.status, status)) {
    res.status(400).json({
      error: `Status tidak boleh ditukar dari ${complaint.status} ke ${status}`,
    });
    return;
  }

  const updated = await prisma.complaint.update({
    where: { id: req.params.id as string },
    data: { status },
    include: {
      category: true,
      customer: { select: { id: true, name: true, email: true } },
      assignedAdmin: { select: { id: true, name: true, email: true } },
    },
  });

  await sendEmail({
    to: complaint.customer.email,
    subject: 'Status Complaint Dikemaskini - CCMS',
    html: buildStatusChangeHtml(complaint.customer.name, complaint.title, status),
  }).catch((err) => console.error('Email send failed:', err));

  res.json(updated);
}

export async function getDashboard(_req: Request, res: Response): Promise<void> {
  const [total, byStatus, byPriority, recent] = await Promise.all([
    prisma.complaint.count(),
    prisma.complaint.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
    prisma.complaint.groupBy({
      by: ['priority'],
      _count: { priority: true },
    }),
    prisma.complaint.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        customer: { select: { id: true, name: true, email: true } },
        assignedAdmin: { select: { id: true, name: true, email: true } },
      },
    }),
  ]);

  const statusMap: Record<string, number> = { NEW: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0 };
  byStatus.forEach((s) => (statusMap[s.status] = s._count.status));

  const priorityMap: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };
  byPriority.forEach((p) => (priorityMap[p.priority] = p._count.priority));

  res.json({
    total,
    byStatus: statusMap,
    byPriority: priorityMap,
    recent,
  });
}

export async function getAdmins(_req: Request, res: Response): Promise<void> {
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true, name: true, email: true },
  });
  res.json(admins);
}

export async function getCategories(_req: Request, res: Response): Promise<void> {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  res.json(categories);
}

export async function complainUpdate(req: Request, res: Response): Promise<void> {
  const { status, assignedAdminId } = adminUpdateComplaintSchema.parse(req.body);

  const complaint = await prisma.complaint.findUnique({
    where: { id: req.params.id as string },
    include: { customer: { select: { id: true, name: true, email: true } }, assignedAdmin: true },
  }) as any;

  if (!complaint) {
    res.status(404).json({ error: 'Complaint tidak dijumpai' });
    return;
  }

  if (status && !canTransition(complaint.status, status)) {
    res.status(400).json({
      error: `Status tidak boleh ditukar dari ${complaint.status} ke ${status}`,
    });
    return;
  }

  if (assignedAdminId) {
    const admin = await prisma.user.findFirst({
      where: { id: assignedAdminId, role: 'ADMIN' },
    });
    if (!admin) {
      res.status(400).json({ error: 'Admin tidak wujud' });
      return;
    }
  }

  const updateData: any = {};
  if (status) updateData.status = status;
  if (assignedAdminId !== undefined) updateData.assignedAdminId = assignedAdminId || null;

  const updated = await prisma.complaint.update({
    where: { id: req.params.id as string },
    data: updateData,
    include: {
      category: true,
      customer: { select: { id: true, name: true, email: true } },
      assignedAdmin: { select: { id: true, name: true, email: true } },
    },
  });

  if (status) {
    await sendEmail({
      to: complaint.customer.email,
      subject: 'Status Complaint Dikemaskini - CCMS',
      html: buildStatusChangeHtml(complaint.customer.name, complaint.title, status),
    }).catch((err) => console.error('Email send failed:', err));
  }

  if (assignedAdminId) {
    const admin = await prisma.user.findUnique({ where: { id: assignedAdminId } });
    if (admin) {
      await sendEmail({
        to: admin.email,
        subject: 'Anda Di-Assign ke Complaint - CCMS',
        html: buildAssignmentHtml(admin.name, complaint.title),
      }).catch((err) => console.error('Email send failed:', err));
    }
  }

  res.json(updated);
}
