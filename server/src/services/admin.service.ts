import {Request, Response, NextFunction} from "express";
import prisma from "../../prisma/prisma";

export const getIncomingEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = (req as any).user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const admin = await prisma.user.findFirst({
      where: {
        AND: [
          {id: adminId},
          {role: "ADMIN"}
        ]
      },
      select: {id: true, name: true, email: true, role: true, createdAt: true}
    });
    if (!admin) return res.status(404).json({message: "Admin not found"});

    const totalEvents = await prisma.event.count();
    const pendingApproval = await prisma.event.count({where: {isApproved: false}});
    const approvedEvents = await prisma.event.count({where: {isApproved: true}});
    const cancelledEvents = await prisma.event.count({where: {registrations: {some: {status: "CANCELLED"}}}});

    const events = await prisma.event.findMany({
      orderBy: {createdAt: "desc"},
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        startTime: true,
        endTime: true,
        category: true,
        isPaid: true,
        isApproved: true,
        createdAt: true,
        organizer: {select: {id: true, name: true, email: true}},
        registrations: {
          select: {
            id: true,
            payment: true,
            status: true
          }
        }
      }
    });

    const formattedEvents = events.map(e => ({
      id: e.id,
      title: e.title,
      description: e.description,
      location: e.location,
      startTime: e.startTime,
      endTime: e.endTime,
      category: e.category,
      status: e.isApproved ? "APPROVED" : "PENDING",
      organizer: e.organizer,
      submittedAt: e.createdAt,
      isPaid: e.isPaid,
      expectedAttendees: e.registrations.length,
      revenue: e.registrations.reduce(
        (acc, r) => acc + (r.payment?.status === "SUCCESS" ? r.payment.amount : 0),
        0
      )
    }));

    const totalPages = Math.ceil(totalEvents / Number(limit));

    return res.status(200).json({
      user: admin,
      pagination: {
        currentPage: Number(page),
        limit: Number(limit),
        totalItems: totalEvents,
        totalPages
      },
      stats: {
        totalEvents,
        pendingApproval,
        approvedEvents,
        rejectedEvents: cancelledEvents
      },
      events: formattedEvents
    });
  } catch (e) {
    next(e);
  }
}

export const getAllOrganizersWithEvents = async (req: Request, res: Response, next: NextFunction) => {
  const {page = 1, limit = 10, search = ""} = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  try {
    const totalOrganizers = await prisma.user.count({
      where: {
        role: "ORGANIZER",
        name: {contains: search as string, mode: "insensitive"}
      }
    });

    const organizers = await prisma.user.findMany({
      where: {
        role: "ORGANIZER",
        name: {contains: search as string, mode: "insensitive"}
      },
      include: {
        events: {
          include: {
            registrations: {
              include: {
                payment: true
              }
            },
            tickets: true
          }
        }
      },
      skip,
      take: Number(limit),
      orderBy: {createdAt: "desc"}
    });

    return res.status(200).json({
      message: "Organizers with event details fetched",
      pagination: {
        currentPage: Number(page),
        limit: Number(limit),
        totalItems: totalOrganizers,
        totalPages: Math.ceil(totalOrganizers / Number(limit))
      },
      data: organizers.map(o => ({
        id: o.id,
        name: o.name,
        email: o.email,
        role: o.role,
        createdAt: o.createdAt,
        totalEvents: o.events.length,
        totalRegistrations: o.events.reduce((acc, ev) => acc + ev.registrations.length, 0),
        events: o.events.slice(0, 3).map(ev => ({
          id: ev.id,
          title: ev.title,
          location: ev.location,
          bannerUrl: ev.bannerUrl,
          startTime: ev.startTime,
          endTime: ev.endTime,
          isPaid: ev.isPaid,
          status: ev.isApproved ? "APPROVED" : "PENDING",
          totalParticipants: ev.registrations.length,
          revenue: ev.registrations.reduce((total, r) => {
            if (r.payment?.status === "SUCCESS") return total + (r.payment.amount || 0);
            return total;
          }, 0)
        }))
      }))
    });

  } catch (error) {
    next(error);
  }
};

export const getOrganizerDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search?.toString() || "";

    const skip = (page - 1) * limit;

    const organizer = await prisma.user.findUnique({
      where: {id: String(id), role: "ORGANIZER"}
    });

    if (!organizer) {
      return res.status(404).json({message: "Organizer not found"});
    }

    const totalEvents = await prisma.event.count({
      where: {
        organizerId: String(id),
        title: {contains: search, mode: "insensitive"}
      }
    });

    const events = await prisma.event.findMany({
      where: {
        organizerId: String(id),
        title: {contains: search, mode: "insensitive"}
      },
      orderBy: {createdAt: "desc"},
      skip,
      take: limit,
      include: {
        registrations: {
          include: {
            payment: true
          }
        },
        tickets: true,
      }
    });

    const formattedEvents = events.map(event => {
      // total revenue for the event: sum of successful payments
      const eventRevenue = event.registrations.reduce((sum, r) => {
        return sum + (r.payment?.status === "SUCCESS" ? (r.payment.amount || 0) : 0);
      }, 0);

      // total tickets sold across all ticket types (exclude CANCELLED)
      const totalTicketsSold = event.tickets.reduce((acc, ticket) => {
        const soldForTicket = event.registrations.filter(r => r.ticketId === ticket.id && r.status !== "CANCELLED").length;
        return acc + soldForTicket;
      }, 0);

      return {
        id: event.id,
        title: event.title,
        location: event.location,
        bannerUrl: event.bannerUrl,
        startTime: event.startTime,
        endTime: event.endTime,
        totalParticipants: event.registrations.length,
        ticketsSold: totalTicketsSold,
        revenue: eventRevenue,
        // optional: per-ticket breakdown
        tickets: event.tickets.map(ticket => {
          const sold = event.registrations.filter(r => r.ticketId === ticket.id && r.status !== "CANCELLED").length;
          const ticketRevenue = event.registrations.reduce((sum, r) => {
            if (r.ticketId !== ticket.id) return sum;
            return sum + (r.payment?.status === "SUCCESS" ? (r.payment.amount || 0) : 0);
          }, 0);
          return {
            id: ticket.id,
            name: ticket.name,
            price: ticket.price,
            quantity: ticket.quantity,
            sold,
            revenue: ticketRevenue
          };
        })
      };
    });

    return res.status(200).json({
      message: "Organizer details fetched successfully",
      data: {
        organizer: {
          id: organizer.id,
          role: organizer.role,
          name: organizer.name,
          email: organizer.email,
          createdAt: organizer.createdAt
        },
        totalEvents,
        events: formattedEvents,
        pagination: {
          currentPage: page,
          perPage: limit,
          totalPages: Math.ceil(totalEvents / limit)
        }
      }
    });
  } catch (error) {
    next(error)
  }
};

export const updateEventApproval = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const {isApproved} = req.body; // boolean

    if (typeof isApproved !== "boolean") {
      return res.status(400).json({message: "isApproved must be boolean"});
    }

    const event = await prisma.event.findUnique({where: {id: String(id)}});
    if (!event) {
      return res.status(404).json({message: "Event not found"});
    }

    const updated = await prisma.event.update({
      where: {id: String(id)},
      data: {isApproved},
    });

    return res.status(200).json({
      message: `Event approval updated`,
      data: {
        id: updated.id,
        title: updated.title,
        isApproved: updated.isApproved,
        updatedAt: updated.updatedAt,
      },
    });

  } catch (err) {
    next(err)
  }
};
