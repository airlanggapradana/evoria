import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    role: z.enum(["USER", "ADMIN", "ORGANIZER"], {
      message: "Role must be either USER ,ADMIN or ORGANIZER",
    }),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const eventSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters long"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters long"),
    location: z.string().min(10, "Location must be at least 6 characters long"),
    startTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid start time",
    }),
    endTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid end time",
    }),
    bannerUrl: z
      .string()
      .url("Invalid banner URL")
      .transform((v) => (v === "" ? null : v)),
    category: z.string().min(3, "Category must be at least 3 characters long"),
    isApproved: z.boolean().default(false),
    isPaid: z.boolean().default(false),
    organizerId: z.string(),
    tickets: z
      .array(
        z.object({
          name: z
            .string()
            .min(2, "Ticket name must be at least 2 characters long"),
          quantity: z.number().min(1, "Ticket quantity must be at least 1"),
          price: z.number().min(0, "Ticket price must be a positive number"),
        }),
      )
      .min(1, "At least one ticket is required"),
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: "End time must be after start time",
  });

export const registrationSchema = z.object({
  eventId: z.string().min(3, "Event ID must be at least 3 characters long"),
  userId: z.string().min(3, "User ID must be at least 3 characters long"),
  ticketId: z.string().min(3, "Ticket id must be at least 3 characters long"),
});

// Zod schemas for each step
export const eventBasicSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(3, "Location is required"),
});

export const eventDetailsSchema = z.object({
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  bannerUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  isPaid: z.boolean(),
});

export const ticketSchema = z.object({
  name: z.string().min(1, "Ticket name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be 0 or greater"),
});

export const eventTicketsSchema = z.object({
  tickets: z.array(ticketSchema).min(1, "At least one ticket type is required"),
});

export const organizerSchema = z.object({
  organizerId: z.string().min(1, "Organizer ID is required"),
});

export const fullEventSchema = eventBasicSchema
  .merge(eventDetailsSchema)
  .merge(eventTicketsSchema)
  .merge(organizerSchema);

export type EventBasic = z.infer<typeof eventBasicSchema>;
export type EventDetails = z.infer<typeof eventDetailsSchema>;
export type EventTickets = z.infer<typeof eventTicketsSchema>;
export type Organizer = z.infer<typeof organizerSchema>;
export type FullEvent = z.infer<typeof fullEventSchema>;

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
