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
