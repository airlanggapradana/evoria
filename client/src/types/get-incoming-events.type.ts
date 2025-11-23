export interface GetAllIncomingEventsResponse {
  user: User;
  pagination: Pagination;
  stats: Stats;
  events: Event[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  category: string;
  status: string;
  organizer: Organizer;
  submittedAt: Date;
  isPaid: boolean;
  expectedAttendees: number;
  revenue: number;
}

export interface Organizer {
  id: string;
  name: string;
  email: string;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface Stats {
  totalEvents: number;
  pendingApproval: number;
  approvedEvents: number;
  rejectedEvents: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}
