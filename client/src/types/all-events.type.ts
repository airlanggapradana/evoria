export interface AllEventsResponse {
  message: string;
  data: Event[];
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
  isPaid: boolean;
  isApproved: boolean;
  organizer: Organizer;
  tickets: Ticket[];
  stats: Stats;
  createdAt: Date;
}

export interface Organizer {
  id: string;
  name: string;
  email: string;
}

export interface Stats {
  totalRegistrations: number;
  confirmedCount: number;
  remainingTickets: number;
}

export interface Ticket {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
