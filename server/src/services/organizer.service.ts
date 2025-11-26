import {Request, Response, NextFunction} from "express";
import prisma from "../../prisma/prisma";

export const getOrganizerDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizerId = (req as any).user.id;
    const search = req.query.search?.toString() || "";

    // Fetch organizer detail
    const organizer = await prisma.user.findUnique({
      where: {id: organizerId},
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    // Total events created
    const totalEvents = await prisma.event.count({
      where: {
        organizerId,
        title: {contains: search, mode: "insensitive"}
      }
    });

    // Total event registrations
    const totalRegistrations = await prisma.registration.count({
      where: {
        event: {
          organizerId,
          title: {contains: search, mode: "insensitive"}
        }
      }
    });

    // Total revenue from successful payments
    const revenue = await prisma.payment.aggregate({
      _sum: {amount: true},
      where: {
        status: "SUCCESS",
        registration: {
          event: {
            organizerId,
            title: {contains: search, mode: "insensitive"}
          }
        }
      }
    });

    // Registrations grouped by status
    const statusGroups = await prisma.registration.groupBy({
      by: ["status"],
      where: {
        event: {
          organizerId,
          title: {contains: search, mode: "insensitive"}
        }
      },
      _count: {status: true}
    });

    const registrationsByStatus = {
      CONFIRMED: 0,
      PENDING: 0,
      CANCELLED: 0
    };

    statusGroups.forEach((group) => {
      registrationsByStatus[group.status] = group._count.status;
    });

    // Recent events
    const recentEventsDB = await prisma.event.findMany({
      where: {
        organizerId,
        title: {contains: search, mode: "insensitive"}
      },
      orderBy: {createdAt: "desc"},
      take: 5,
      include: {
        registrations: {
          include: {payment: true}
        }
      }
    });

    const recentEvents = recentEventsDB.map((evt) => {
      const totalParticipants = evt.registrations.length;
      const ticketsSold = evt.registrations.filter((r) => r.status === "CONFIRMED").length;

      const revenue = evt.registrations.reduce((sum, r) => {
        if (r.payment?.status === "SUCCESS") {
          return sum + r.payment.amount;
        }
        return sum;
      }, 0);

      return {
        id: evt.id,
        title: evt.title,
        location: evt.location,
        bannerUrl: evt.bannerUrl || "",
        startTime: evt.startTime,
        endTime: evt.endTime,
        isApproved: evt.isApproved,
        totalParticipants,
        ticketsSold,
        revenue
      };
    });

    return res.json({
      message: "Organizer dashboard data",
      data: {
        organizer,
        totalEvents,
        totalRegistrations,
        totalRevenue: revenue._sum.amount || 0,
        registrationsByStatus,
        recentEvents
      }
    });

  } catch (error) {
    next(error);
  }
};

export const getRegistrationChart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizerId = (req as any).user.id;
    const rawRange = String(req.query.range ?? "daily");
    const range = rawRange.toLowerCase();
    const eventId = req.query.eventId ? String(req.query.eventId) : undefined;
    const startDateQuery = req.query.startDate ? new Date(String(req.query.startDate)) : undefined;
    const endDateQuery = req.query.endDate ? new Date(String(req.query.endDate)) : undefined;

    const isoWeekKey = (d: Date) => {
      const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      const dayNum = date.getUTCDay() || 7;
      date.setUTCDate(date.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
    };

    const dayKey = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    const monthKey = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      return `${y}-${m}`;
    };

    let startDate: Date;
    let endDate: Date;
    const now = new Date();
    if (startDateQuery && endDateQuery) {
      startDate = new Date(startDateQuery);
      endDate = new Date(endDateQuery);
    } else {
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (range === "weekly") {
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - (7 * 12) + 1);
      } else if (range === "monthly") {
        startDate = new Date(endDate);
        startDate.setMonth(startDate.getMonth() - 5);
      } else {
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 6);
      }
    }

    const whereAny: any = {
      event: {organizerId}
    };
    if (eventId) whereAny.eventId = eventId;
    whereAny.createdAt = {
      gte: startDate,
      lte: endDate,
    };

    const regs = await prisma.registration.findMany({
      where: whereAny,
      select: {createdAt: true}
    });

    const countsMap = new Map<string, number>();
    regs.forEach(r => {
      const d = new Date(r.createdAt);
      let key = "";
      if (range === "weekly") key = isoWeekKey(d);
      else if (range === "monthly") key = monthKey(d);
      else key = dayKey(d);
      countsMap.set(key, (countsMap.get(key) || 0) + 1);
    });

    const labels: string[] = [];
    const counts: number[] = [];

    if (range === "weekly") {
      const cursor = new Date(startDate);
      const shift = (cursor.getDay() + 6) % 7;
      cursor.setDate(cursor.getDate() - shift);
      while (cursor <= endDate) {
        const key = isoWeekKey(cursor);
        labels.push(key);
        counts.push(countsMap.get(key) || 0);
        cursor.setDate(cursor.getDate() + 7);
      }
    } else if (range === "monthly") {
      const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      while (cursor <= endDate) {
        const key = monthKey(cursor);
        labels.push(key);
        counts.push(countsMap.get(key) || 0);
        cursor.setMonth(cursor.getMonth() + 1);
      }
    } else {
      const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      while (cursor <= endDate) {
        const key = dayKey(cursor);
        labels.push(key);
        counts.push(countsMap.get(key) || 0);
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    // Additional metrics
    const totalRegistrations = regs.length;

    // days in window (inclusive)
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysWindow = Math.floor((endDate.getTime() - startDate.getTime()) / msPerDay) + 1;
    const dailyAverage = daysWindow > 0 ? +(totalRegistrations / daysWindow).toFixed(2) : 0;

    // peak period (label + count)
    let peakLabel = labels.length ? (labels[0] ?? "") : "";
    let peakCount = labels.length ? (counts[0] ?? 0) : 0;
    for (let i = 0; i < counts.length; i++) {
      const c = counts[i] ?? 0;
      if (c > peakCount) {
        peakCount = c;
        peakLabel = labels[i] ?? peakLabel;
      }
    }

    // growth rate: compare first half vs second half sums
    const n = counts.length;
    const split = Math.floor(n / 2);
    const firstSum = counts.slice(0, split).reduce((s, v) => s + v, 0);
    const secondSum = counts.slice(split).reduce((s, v) => s + v, 0);
    let growthRate = 0;
    if (firstSum === 0) {
      growthRate = firstSum === secondSum ? 0 : (secondSum > 0 ? 100 : 0);
    } else {
      growthRate = ((secondSum - firstSum) / firstSum) * 100;
    }
    growthRate = +growthRate.toFixed(2);

    return res.status(200).json({
      message: "Registration chart data",
      data: {
        labels,
        counts,
        totalRegistrations,
        dailyAverage,
        peakPeriod: {label: peakLabel, count: peakCount},
        growthRate // percentage
      }
    });
  } catch (err) {
    next(err);
  }
};
