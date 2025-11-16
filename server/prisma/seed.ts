import {PrismaClient} from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.payment.deleteMany()
  await prisma.registration.deleteMany()
  await prisma.ticket.deleteMany()
  await prisma.event.deleteMany()
  await prisma.user.deleteMany()
  console.log("🌱 Starting full database seed...");

  // --- USERS ---
  await prisma.user.createMany({
    data: [
      {
        id: "USER-1",
        name: "Rangga Pratama",
        email: "rangga@example.com",
        password: "hashedpassword123",
        role: "ORGANIZER",
      },
      {
        id: "USER-2",
        name: "Farid Akbar",
        email: "farid@example.com",
        password: "hashedpassword123",
        role: "USER",
      },
      {
        id: "USER-3",
        name: "Siti Rahma",
        email: "siti@example.com",
        password: "hashedpassword123",
        role: "USER",
      },
      {
        id: "USER-4",
        name: "Dewi Lestari",
        email: "dewi@example.com",
        password: "hashedpassword123",
        role: "USER",
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Users seeded.");

  // --- EVENTS + TICKETS ---
  const event1 = await prisma.event.create({
    data: {
      id: "EVT-001",
      title: "Tech Innovation Fair 2025",
      description:
        "An annual technology exhibition featuring the latest innovations from students and startups.",
      location: "Auditorium Kampus A",
      startTime: new Date("2025-12-10T09:00:00"),
      endTime: new Date("2025-12-10T17:00:00"),
      bannerUrl: "https://example.com/banner-techfair.jpg",
      category: "Technology",
      isApproved: true,
      isPaid: true,
      organizerId: "USER-1",
    },
  });

  const event2 = await prisma.event.create({
    data: {
      id: "EVT-002",
      title: "Entrepreneurship Bootcamp",
      description:
        "A 3-day intensive program to develop startup ideas and business models.",
      location: "Ruang Seminar Kampus B",
      startTime: new Date("2025-12-15T08:00:00"),
      endTime: new Date("2025-12-17T16:00:00"),
      bannerUrl: "https://example.com/banner-bootcamp.jpg",
      category: "Business",
      isApproved: true,
      isPaid: false,
      organizerId: "USER-1",
    },
  });

  const event3 = await prisma.event.create({
    data: {
      id: "EVT-003",
      title: "Campus Music Festival",
      description:
        "A celebration of music, creativity, and student performances from across the university.",
      location: "Lapangan Utama",
      startTime: new Date("2025-12-20T17:00:00"),
      endTime: new Date("2025-12-20T23:00:00"),
      bannerUrl: "https://example.com/banner-musicfest.jpg",
      category: "Entertainment",
      isApproved: false,
      isPaid: true,
      organizerId: "USER-1",
    },
  });

  console.log("✅ Events seeded.");

  // --- TICKETS ---
  const tickets = await prisma.ticket.createMany({
    data: [
      {id: "TICKET-001", eventId: event1.id, name: "Regular", quantity: 100, price: 50000},
      {id: "TICKET-002", eventId: event1.id, name: "VIP", quantity: 20, price: 100000},
      {id: "TICKET-003", eventId: event2.id, name: "Participant Pass", quantity: 50, price: 0},
      {id: "TICKET-004", eventId: event3.id, name: "Early Bird", quantity: 50, price: 25000},
      {id: "TICKET-005", eventId: event3.id, name: "Regular", quantity: 100, price: 30000},
    ],
    skipDuplicates: true,
  });

  console.log("✅ Tickets seeded.");

  // --- REGISTRATIONS + PAYMENTS ---
  const registrations = await prisma.registration.createMany({
    data: [
      {
        id: "REG-001",
        userId: "USER-2",
        eventId: event1.id,
        ticketId: "TICKET-001",
        status: "CONFIRMED",
        qrCode: "QR-USER2-EVT001",
        checkedIn: false,
      },
      {
        id: "REG-002",
        userId: "USER-3",
        eventId: event1.id,
        ticketId: "TICKET-002",
        status: "CONFIRMED",
        qrCode: "QR-USER3-EVT001",
        checkedIn: true,
      },
      {
        id: "REG-003",
        userId: "USER-4",
        eventId: event2.id,
        ticketId: "TICKET-003",
        status: "PENDING",
        qrCode: "QR-USER4-EVT002",
        checkedIn: false,
      },
      {
        id: "REG-004",
        userId: "USER-2",
        eventId: event3.id,
        ticketId: "TICKET-005",
        status: "CONFIRMED",
        qrCode: "QR-USER2-EVT003",
        checkedIn: false,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Registrations seeded.");

  // --- PAYMENTS (hanya untuk event berbayar) ---
  await prisma.payment.createMany({
    data: [
      {
        id: "PAY-001",
        registrationId: "REG-001",
        amount: 50000,
        method: "Midtrans",
        status: "SUCCESS",
        transactionId: "TRX-USER2-001",
        paidAt: new Date("2025-11-01T10:00:00"),
      },
      {
        id: "PAY-002",
        registrationId: "REG-002",
        amount: 100000,
        method: "Midtrans",
        status: "SUCCESS",
        transactionId: "TRX-USER3-002",
        paidAt: new Date("2025-11-02T10:00:00"),
      },
      {
        id: "PAY-003",
        registrationId: "REG-004",
        amount: 30000,
        method: "Cash",
        status: "PENDING",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Payments seeded.");
  console.log("🌿 Seeding complete!");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
