import {Request, Response, NextFunction} from "express";
import prisma from "../../prisma/prisma";
import midtransClient from "midtrans-client";
import {env} from "../env";
import {RegistrationInput, registrationSchema} from "../zod/schema";

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
      where: {userId, eventId},
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
    const qrCode = `QR-${user.id}-${event.id}-${Date.now()}`;
    const registration = await prisma.registration.create({
      data: {
        userId,
        eventId,
        ticketId,
        qrCode,
        status: "PENDING",
      },
    });

    // 4️⃣ Reduce ticket stock
    await prisma.ticket.update({
      where: {id: ticket.id},
      data: {quantity: ticket.quantity - 1},
    });

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