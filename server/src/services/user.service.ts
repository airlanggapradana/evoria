import {Request, Response, NextFunction} from "express";
import prisma from "../../prisma/prisma";

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({
      where: {id: userId},
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    })
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    res.status(200).json({
      user
    })
  } catch (e) {
    next(e)
  }
}

export const getUserDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: {id: (req as any).user.id},
      include: {
        registrations: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                description: true,
                location: true,
                startTime: true,
                endTime: true,
                bannerUrl: true,
                category: true,
                isPaid: true,
              },
            },
            ticket: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
            payment: {
              select: {
                id: true,
                amount: true,
                method: true,
                status: true,
                transactionId: true,
                paidAt: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    return res.json({
      message: "User details fetched successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        events: user.registrations.map((reg) => ({
          registrationId: reg.id,
          status: reg.status,
          checkedIn: reg.checkedIn,
          qrCode: reg.qrCode,
          createdAt: reg.createdAt,

          event: reg.event,
          ticket: reg.ticket,
          payment: reg.payment || null,
        })),
      },
    });

  } catch (e) {
    next(e);
  }
}