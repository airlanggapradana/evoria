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