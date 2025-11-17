export interface GetOrganizerDetailsResponse {
  message: string;
  data: Data;
}

export interface Data {
  organizer: Organizer;
  totalEvents: number;
  totalRegistrations: number;
  totalRevenue: number;
  registrationsByStatus: RegistrationsByStatus;
  recentEvents: RecentEvent[];
}

export interface Organizer {
  id: string;
  role: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface RecentEvent {
  id: string;
  title: string;
  location: string;
  startTime: Date;
  endTime: Date;
  totalParticipants: number;
  ticketsSold: number;
  revenue: number;
}

export interface RegistrationsByStatus {
  CONFIRMED: number;
  PENDING: number;
  CANCELLED: number;
}
