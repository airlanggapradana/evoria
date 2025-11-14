export interface PaymentResponse {
  message: string;
  data: Data;
}

export interface Data {
  registration: Registration;
  payment: Payment;
  event: Event;
  ticket: Ticket;
}

export interface Event {
  title: string;
  location: string;
  startTime: Date;
  endTime: Date;
}

export interface Payment {
  id: string;
  registrationId: string;
  amount: number;
  method: null;
  status: string;
  transactionId: null;
  paidAt: null;
  createdAt: Date;
  midtransToken: string;
  redirectUrl: string;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  ticketId: string;
  status: string;
  qrCode: null;
  checkedIn: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  name: string;
  price: number;
}
