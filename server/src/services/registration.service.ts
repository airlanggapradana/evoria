import {Request, Response, NextFunction} from "express";
import prisma from "../../prisma/prisma";
import midtransClient from "midtrans-client";
import {env} from "../env";
import {RegistrationInput, registrationSchema} from "../zod/schema";
import jwt from "jsonwebtoken";
import {nanoid} from 'nanoid';

const snap = new midtransClient.Snap({
  isProduction: env.IS_PRODUCTION === 'true',
  serverKey: env.MIDTRANS_SERVER_KEY,
  clientKey: env.MIDTRANS_CLIENT_KEY,
});

export const registerEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {eventId, userId, ticketId}: RegistrationInput = registrationSchema.parse(req.body);

    // 1️⃣ Check if user already registered for this event
    const existing = await prisma.registration.findFirst({
      where: {
        AND: [
          {userId},
          {eventId},
        ]
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "User has already registered for this event",
      });
    }

    // 2️⃣ Validate entities
    const [user, event, ticket] = await Promise.all([
      prisma.user.findUnique({where: {id: userId}}),
      prisma.event.findUnique({where: {id: eventId}}),
      prisma.ticket.findUnique({where: {id: ticketId}}),
    ]);

    if (!user) return res.status(404).json({message: "User not found"});
    if (!event) return res.status(404).json({message: "Event not found"});
    if (!ticket) return res.status(404).json({message: "Ticket not found"});
    if (ticket.eventId !== event.id)
      return res.status(400).json({message: "Ticket does not belong to this event"});
    if (ticket.quantity <= 0)
      return res.status(400).json({message: "Ticket sold out"});

    // 3️⃣ Create registration
    const registration = await prisma.registration.create({
      data: {
        userId,
        eventId,
        ticketId,
        status: event.isPaid ? "PENDING" : "CONFIRMED",
      },
    });

    // 2️⃣ Generate QR code
    const qrCodeData = nanoid(24);
    const qrToken = jwt.sign({
      qrToken: qrCodeData,
      registrationId: registration.id
    }, env.JWT_SECRET, {expiresIn: '30d'});
    const frontendUrl = `${env.FRONTEND_URL}/checkin?token=${qrToken}`;

    // 3️⃣ Simpan QR code ke database
    await prisma.registration.update({
      where: {id: registration.id},
      data: {qrCodeUrl: frontendUrl, qrCode: qrCodeData},
    });

    // 4️⃣ Reduce ticket stock
    await prisma.ticket.update({
      where: {id: ticket.id},
      data: {quantity: ticket.quantity - 1},
    });

    // 🔹 Jika event gratis, tidak perlu buat payment
    if (!event.isPaid) {
      return res.status(201).json({
        message: "Free event registration created successfully",
        data: {
          registration: {
            ...registration,
            qrCode: frontendUrl,
          },
          event: {
            title: event.title,
            location: event.location,
            startTime: event.startTime,
            endTime: event.endTime,
          },
          ticket: {
            name: ticket.name,
            price: ticket.price,
          },
        },
      });
    }

    // 5️⃣ Create payment record
    const payment = await prisma.payment.create({
      data: {
        registrationId: registration.id,
        amount: ticket.price,
        status: "PENDING",
      },
    });

    // 6️⃣ Prepare Midtrans transaction
    const transactionParams = {
      transaction_details: {
        order_id: payment.id,
        gross_amount: ticket.price,
      },
      item_details: [
        {
          id: ticket.id,
          price: ticket.price,
          quantity: 1,
          name: `${event.title} - ${ticket.name}`,
        },
      ],
      customer_details: {
        first_name: user.name,
        email: user.email,
      },
    };

    // 7️⃣ Create transaction in Midtrans
    const transaction = await snap.createTransaction(transactionParams);

    // 8️⃣ Update DB with Midtrans info
    await prisma.payment.update({
      where: {id: payment.id},
      data: {
        transactionId: transaction.token,
      },
    });

    // 9️⃣ Response
    return res.status(201).json({
      message: "Registration created successfully",
      data: {
        registration,
        payment: {
          ...payment,
          midtransToken: transaction.token,
          redirectUrl: transaction.redirect_url,
        },
        event: {
          title: event.title,
          location: event.location,
          startTime: event.startTime,
          endTime: event.endTime,
        },
        ticket: {
          name: ticket.name,
          price: ticket.price,
        },
      },
    });
  } catch (e) {
    next(e)
  }
}

export const midtransNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {order_id, transaction_status, payment_type} = req.body;

    let newStatus: "PENDING" | "SUCCESS" | "FAILED" = "PENDING";
    if (transaction_status === "settlement") newStatus = "SUCCESS";
    else if (["deny", "cancel", "expire"].includes(transaction_status))
      newStatus = "FAILED";

    const updatedPayment = await prisma.payment.update({
      where: {id: order_id},
      data: {
        status: newStatus,
        method: payment_type, // ✅ isi otomatis dari Midtrans
        paidAt: new Date(),
      },
      include: {registration: true},
    });

    if (newStatus === "SUCCESS") {
      await prisma.registration.update({
        where: {id: updatedPayment.registrationId},
        data: {status: "CONFIRMED"},
      });
    }

    res.status(200).json({message: "Payment status updated"});
  } catch (err) {
    console.error("Midtrans callback error:", err);
    res.status(500).json({message: "Callback error"});
  }
}

export const checkInUser = async (req: Request, res: Response, next: NextFunction) => {
  const {token} = req.query;
  if (!token || typeof token !== "string")
    return res.status(400).json({message: "Token missing"});

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { qrToken: string };

    const registration = await prisma.registration.findFirst({
      where: {qrCode: decoded.qrToken},
      include: {user: true, event: true},
    });

    if (!registration)
      return res.status(404).json({message: "Registration not found"});
    if (registration.checkedIn)
      return res.status(400).json({message: "Already checked in"});

    await prisma.registration.update({
      where: {id: registration.id},
      data: {checkedIn: true},
    });

    return res.status(200).json({
      message: "Check-in successful",
      participant: {
        name: registration.user.name,
        event: registration.event.title,
        time: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getRegistrationDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {id} = req.params;
    const {token} = req.query;

    let registrationId: string | undefined;

    // ✅ Case 1: Token dari QR Code
    if (token && typeof token === "string") {
      try {
        const decoded = jwt.verify(token, process.env.QR_SECRET!) as {
          registrationId: string;
        };
        registrationId = decoded.registrationId;
      } catch (err) {
        return res.status(401).json({message: "Invalid or expired QR token"});
      }
    }

    // ✅ Case 2: Langsung lewat ID
    if (!registrationId && id) {
      registrationId = id;
    }

    if (!registrationId) {
      return res.status(400).json({
        message: "Either registration ID or QR token is required",
      });
    }

    // 🔹 Ambil data lengkap dari Prisma
    const registration = await prisma.registration.findUnique({
      where: {id: registrationId},
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            location: true,
            startTime: true,
            endTime: true,
            isPaid: true,
            isApproved: true,
            bannerUrl: true,
            organizer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        ticket: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        payment: true,
      },
    });

    if (!registration) {
      return res.status(404).json({message: "Registration not found"});
    }

    // 🔹 Format respons yang rapi untuk frontend
    const responseData = {
      id: registration.id,
      status: registration.status,
      checkedIn: registration.checkedIn,
      qrCode: registration.qrCode,
      createdAt: registration.createdAt,
      updatedAt: registration.updatedAt,
      user: registration.user,
      event: {
        ...registration.event,
        organizer: registration.event.organizer,
      },
      ticket: registration.ticket,
      payment: registration.payment
        ? {
          id: registration.payment.id,
          amount: registration.payment.amount,
          method: registration.payment.method,
          status: registration.payment.status,
          transactionId: registration.payment.transactionId,
          paidAt: registration.payment.paidAt,
        }
        : null,
    };

    return res.status(200).json({
      message: "Registration details fetched successfully",
      data: responseData,
    });
  } catch (err) {
    next(err);
  }
};

export const getSingleRegistrationDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;

    const registration = await prisma.registration.findUnique({
      where: {id: String(id)},
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: {
          include: {
            tickets: true,
          },
        },
        ticket: true,
        payment: true,
      },
    });

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found",
      });
    }

    return res.status(200).json({
      message: "Registration detail fetched successfully",
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};
