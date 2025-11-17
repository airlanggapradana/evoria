import {Request, Response, NextFunction} from "express";
import prisma from "../../prisma/prisma";

export const getOrganizerDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizerId = (req as any).user.id;

    const organizer = await prisma.user.findUnique({
      where: {id: organizerId},
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        createdAt: true,
      }
    })

    // 1. Total events created
    const totalEvents = await prisma.event.count({
      where: {organizerId},
    });

    // 2. Total registrations from all events by this organizer
    const totalRegistrations = await prisma.registration.count({
      where: {
        event: {organizerId}
      },
    });

    // 3. Total revenue (payment SUCCESS only)
    const totalRevenueAgg = await prisma.payment.aggregate({
      _sum: {amount: true},
      where: {
        status: "SUCCESS",
        registration: {
          event: {organizerId},
        },
      },
    });

    const totalRevenue = totalRevenueAgg._sum.amount || 0;

    // 4. Total registrations by status
    const registrationsByStatus = await prisma.registration.groupBy({
      by: ["status"],
      _count: {status: true},
      where: {
        event: {organizerId}
      },
    });

    // Convert group-by result → easier JSON
    const statusMap: Record<string, number> = {
      CONFIRMED: 0,
      PENDING: 0,
      CANCELLED: 0,
    };

    registrationsByStatus.forEach((row) => {
      statusMap[row.status] = row._count.status;
    });

    // 5. Recent events detail (limit 5)
    const recentEvents = await prisma.event.findMany({
      where: {organizerId},
      orderBy: {createdAt: "desc"},
      take: 5,
      include: {
        registrations: {
          include: {
            payment: true,
          }
        },
        tickets: true,
      },
    });

    // Map to clean response
    const recentEventsFormatted = recentEvents.map((event) => {
      const totalParticipants = event.registrations.length;

      const ticketsSold = event.registrations.filter(
        (r) => r.status === "CONFIRMED"
      ).length;

      const eventRevenue = event.registrations
        .filter((r) => r.payment?.status === "SUCCESS")
        .reduce((sum, r) => sum + (r.payment?.amount || 0), 0);

      return {
        id: event.id,
        title: event.title,
        location: event.location,
        startTime: event.startTime,
        endTime: event.endTime,
        totalParticipants,
        ticketsSold,
        revenue: eventRevenue,
      };
    });

    return res.json({
      message: "Organizer dashboard data fetched successfully",
      data: {
        organizer,
        totalEvents,
        totalRegistrations,
        totalRevenue,
        registrationsByStatus: statusMap,
        recentEvents: recentEventsFormatted,
      },
    });

  } catch (error) {
    next(error);
  }
};