import {NextFunction, Request, Response} from "express";
import prisma from "../../prisma/prisma";
import {EventInput, eventSchema} from "../zod/schema";
import {Prisma} from "../../generated/prisma";

export const getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Ambil query params dan set default value
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string; // Untuk title
    const category = req.query.category as string;
    const location = req.query.location as string;
    // Handle boolean filter (karena query params selalu string)
    const isPaid = req.query.isPaid === 'true' ? true : req.query.isPaid === 'false' ? false : undefined;

    // 2. Hitung skip untuk pagination
    const skip = (page - 1) * limit;

    // 3. Build dynamic filter object
    const whereClause: Prisma.EventWhereInput = {
      ...(search && {
        title: {
          contains: search,
          mode: "insensitive", // Case insensitive search
        },
      }),
      ...(category && {category: category}),
      ...(location && {
        location: {
          contains: location,
          mode: "insensitive",
        },
      }),
      ...(isPaid !== undefined && {isPaid: isPaid}),
    };

    // 4. Jalankan query Transaction (Get Data + Get Count) secara paralel agar efisien
    const [events, totalCount] = await prisma.$transaction([
      prisma.event.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        include: {
          organizer: {
            select: {id: true, name: true, email: true},
          },
          tickets: {
            select: {id: true, name: true, price: true, quantity: true},
          },
          registrations: {
            select: {id: true, status: true},
          },
        },
        orderBy: {createdAt: "desc"},
      }),
      prisma.event.count({where: whereClause}),
    ]);

    // 5. Format data (Sama seperti logic Anda sebelumnya)
    const formatted = events.map((event) => {
      const totalRegistrations = event.registrations.length;
      const confirmedCount = event.registrations.filter(
        (r) => r.status === "CONFIRMED"
      ).length;

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        location: event.location,
        startTime: event.startTime,
        endTime: event.endTime,
        bannerUrl: event.bannerUrl,
        category: event.category,
        isPaid: event.isPaid,
        isApproved: event.isApproved,
        organizer: event.organizer,
        tickets: event.tickets,
        stats: {
          totalRegistrations,
          confirmedCount,
          remainingTickets:
            event.tickets.reduce((sum, t) => sum + t.quantity, 0),
        },
        createdAt: event.createdAt,
      };
    });

    // 6. Return response dengan metadata pagination
    return res.json({
      message: "Events fetched successfully",
      data: formatted,
      pagination: {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit: limit,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;

  try {
    const event = await prisma.event.findUnique({
      where: {id: String(id)},
      include: {
        organizer: {
          select: {id: true, name: true, email: true},
        },
        tickets: {
          select: {id: true, name: true, price: true, quantity: true},
        },
        registrations: {
          include: {
            user: {
              select: {id: true, name: true, email: true},
            },
            ticket: {
              select: {id: true, name: true, price: true},
            },
            payment: {
              select: {
                id: true,
                method: true,
                status: true,
                amount: true,
                paidAt: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({message: "Event not found"});
    }

    // Statistik tambahan
    const totalRegistrations = event.registrations.length;
    const confirmedCount = event.registrations.filter(
      (r) => r.status === "CONFIRMED"
    ).length;
    const checkedInCount = event.registrations.filter(
      (r) => r.checkedIn
    ).length;

    const response = {
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      startTime: event.startTime,
      endTime: event.endTime,
      bannerUrl: event.bannerUrl,
      category: event.category,
      isPaid: event.isPaid,
      isApproved: event.isApproved,
      organizer: event.organizer,
      tickets: event.tickets,
      stats: {
        totalRegistrations,
        confirmedCount,
        checkedInCount,
        remainingTickets:
          event.tickets.reduce((sum, t) => sum + t.quantity, 0),
      },
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };

    return res.json({
      message: "Event detail fetched successfully",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      isApproved,
      bannerUrl,
      endTime,
      startTime,
      isPaid,
      description,
      location,
      organizerId,
      category,
      tickets
    }: EventInput = eventSchema.parse(req.body);

    const newEvent = await prisma.$transaction(async (tx) => {
      //   check if organizer exists
      const organizer = await tx.user.findUnique({
        where: {id: organizerId},
      });

      if (!organizer) {
        return res.status(404).json({
          message: "Organizer not found",
        })
      }

      // create event
      const event = await tx.event.create({
        data: {
          id: `evt_${Date.now()}`,
          title,
          isApproved,
          bannerUrl,
          endTime: new Date(endTime),
          startTime: new Date(startTime),
          isPaid,
          description,
          location,
          category,
          organizer: {
            connect: {id: organizerId}
          }
        }
      });

      // create tickets if provided
      if (tickets && tickets.length > 0) {
        await tx.ticket.createMany({
          data: tickets.map(ticket => ({
            eventId: event.id,
            name: ticket.name,
            quantity: ticket.quantity,
            price: ticket.price
          }))
        });
      }


      // return event with tickets
      return tx.event.findUnique({
        where: {id: event.id},
        include: {
          tickets: true,
          organizer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
    })
    if (!newEvent) return;

    return res.status(201).json({
      message: "Event created successfully",
      data: newEvent,
    });
  } catch (e) {
    next(e);
  }
}

export const updateEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventInput = eventSchema.partial().parse(req.body);
    const {id} = req.params;

    const event = await prisma.event.findUnique({
      where: {id: String(id)},
    });

    if (!event) {
      return res.status(404).json({message: "Event not found"});
    }

    const {tickets, organizerId, ...updateData} = eventInput;

    // Remove undefined values and convert dates
    const cleanUpdateData = Object.fromEntries(
      Object.entries({
        ...updateData,
        startTime: updateData.startTime ? new Date(updateData.startTime) : undefined,
        endTime: updateData.endTime ? new Date(updateData.endTime) : undefined,
      }).filter(([_, value]) => value !== undefined)
    );

    const updatedEvent = await prisma.$transaction(async (tx) => {
      // Update event fields (excluding tickets and organizerId)
      const updated = await tx.event.update({
        where: {id: String(id)},
        data: cleanUpdateData,
      });

      // Update tickets if provided
      if (tickets && tickets.length > 0) {
        // Delete existing tickets
        await tx.ticket.deleteMany({
          where: {eventId: String(id)},
        });

        // Create new tickets
        await tx.ticket.createMany({
          data: tickets.map(ticket => ({
            eventId: String(id),
            name: ticket.name,
            quantity: ticket.quantity,
            price: ticket.price,
          })),
        });
      }

      return tx.event.findUnique({
        where: {id: String(id)},
        include: {
          tickets: true,
          organizer: {
            select: {id: true, name: true, email: true},
          },
        },
      });
    });

    return res.status(200).json({
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (e) {
    next(e);
  }
};

export const deleteEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;

    const event = await prisma.event.findUnique({
      where: {id: String(id)},
    })

    if (!event) {
      return res.status(404).json({message: "Event not found"});
    }
    await prisma.event.delete({
      where: {id: String(id)},
    })
    return res.status(200).json({message: "Event deleted successfully"});
  } catch (e) {
    next(e)
  }
}