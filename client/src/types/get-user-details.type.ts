export interface GetUserDetailsResponse {
  message: string;
  data: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  events: EventElement[] | null;
}

export interface EventElement {
  registrationId: string;
  status: string;
  checkedIn: boolean;
  qrCodeUrl: string;
  qrCode: string;
  createdAt: Date;
  event: EventEvent;
  ticket: Ticket;
  payment: Payment | null;
}

export interface EventEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  bannerUrl: string;
  category: string;
  isPaid: boolean;
}

export interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  transactionId: string;
  paidAt: Date;
}

export interface Ticket {
  id: string;
  name: string;
  price: number;
}
