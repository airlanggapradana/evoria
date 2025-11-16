export interface GetRegistrationDetailsType {
  message: string;
  data: Data;
}

export interface Data {
  id: string;
  userId: string;
  eventId: string;
  ticketId: string;
  status: string;
  qrCode: string;
  checkedIn: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  event: Event;
  ticket: Ticket;
  payment: Payment;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  bannerUrl: string;
  category: string;
  isApproved: boolean;
  isPaid: boolean;
  organizerId: string;
  createdAt: Date;
  updatedAt: Date;
  tickets: Ticket[];
}

export interface Ticket {
  id: string;
  eventId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Payment {
  id: string;
  registrationId: string;
  amount: number;
  method: string;
  status: string;
  transactionId: string;
  paidAt: Date;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
