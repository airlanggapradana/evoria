import axios, { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  FullEvent,
  LoginInput,
  RegisterInput,
  RegistrationInput,
} from "@/zod/schema";
import { env } from "@/env";
import type { LoginResponse } from "@/types/login.type";
import type { MeResponse } from "@/types/me.type";
import type { AllEventsResponse } from "@/types/all-events.type";
import type { EventDetailsResponse } from "@/types/event-details.type";
import type { PaymentResponse } from "@/types/payment.type";
import type { GetUserDetailsResponse } from "@/types/get-user-details.type";
import type { GetRegistrationDetailsType } from "@/types/get-registration-details.type";
import type { GetOrganizerDetailsResponse } from "@/types/get-organizer-details.type";
import type { CheckInType } from "@/types/check-in.type";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      try {
        return await axios
          .post(`${env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, data, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          })
          .then((res) => res.status);
      } catch (e) {
        if (e instanceof AxiosError) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
          throw new Error(e.response?.data.message ?? "Registration failed");
        }
        throw new Error("An unexpected error occurred");
      }
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      try {
        return await axios
          .post(`${env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, data, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            withCredentials: true,
          })
          .then((res) => res.data as LoginResponse);
      } catch (e) {
        if (e instanceof AxiosError) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
          throw new Error(e.response?.data.message ?? "Login failed");
        }
        throw new Error("An unexpected error occurred");
      }
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        return await axios
          .get(`${env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "GET",
            withCredentials: true,
          })
          .then((res) => (res.data as MeResponse).user);
      } catch (e) {
        if (e instanceof AxiosError) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
          throw new Error(e.response?.data.message ?? "Fetching user failed");
        }
        throw new Error("An unexpected error occurred");
      }
    },
  });
};

export const useGetAllEvents = ({
  page,
  limit,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["all-events", { page, limit, search }],
    queryFn: async () => {
      try {
        return await axios
          .get(
            `${env.NEXT_PUBLIC_BACKEND_URL}/event${page && limit && search ? `?page=${page}&limit=${limit}&search=${search}` : ""}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              method: "GET",
            },
          )
          .then((res) => res.data as AllEventsResponse);
      } catch (e) {
        if (e instanceof AxiosError) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
          throw new Error(e.response?.data.message ?? "Fetching events failed");
        }
        throw new Error("An unexpected error occurred");
      }
    },
  });
};

export const useGetEventDetails = (eventId: string) => {
  return useQuery({
    queryKey: ["event-details", { eventId }],
    queryFn: async () => {
      try {
        return await axios
          .get(`${env.NEXT_PUBLIC_BACKEND_URL}/event/${eventId}`, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "GET",
          })
          .then((res) => (res.data as EventDetailsResponse).data);
      } catch (e) {
        if (e instanceof AxiosError) {
          throw new Error(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
            e.response?.data.message ?? "Fetching event details failed",
          );
        }
        throw new Error("An unexpected error occurred");
      }
    },
  });
};

export const useMakePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RegistrationInput) => {
      try {
        return await axios
          .post(`${env.NEXT_PUBLIC_BACKEND_URL}/registration`, data, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            withCredentials: true,
          })
          .then((res) => res.data as PaymentResponse);
      } catch (e) {
        if (e instanceof AxiosError) {
          throw new Error(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
            e.response?.data.message ?? "Payment failed",
          );
        }
        throw new Error("An unexpected error occurred");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["all-events"] });
      await queryClient.invalidateQueries({ queryKey: ["user-details"] });
      await queryClient.invalidateQueries({ queryKey: ["organizer-details"] });
    },
  });
};

export const useGetUserDetails = () => {
  return useQuery({
    queryKey: ["user-details"],
    queryFn: async () => {
      try {
        return await axios
          .get(`${env.NEXT_PUBLIC_BACKEND_URL}/user`, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "GET",
            withCredentials: true,
          })
          .then((res) => res.data as GetUserDetailsResponse);
      } catch (e) {
        if (e instanceof AxiosError) {
          throw new Error(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
            e.response?.data.message ?? "Fetching user details failed",
          );
        }
        throw new Error("An unexpected error occurred");
      }
    },
  });
};

export const useGetRegistrationDetails = (registrationId: string) => {
  return useQuery({
    queryKey: ["registration-details", { registrationId }],
    queryFn: async () => {
      try {
        return await axios
          .get(
            `${env.NEXT_PUBLIC_BACKEND_URL}/registration/check/${registrationId}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              method: "GET",
              withCredentials: true,
            },
          )
          .then((res) => res.data as GetRegistrationDetailsType);
      } catch (e) {
        if (e instanceof AxiosError) {
          throw new Error(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
            e.response?.data.message ?? "Fetching registration details failed",
          );
        }
        throw new Error("An unexpected error occurred");
      }
    },
  });
};

export const useGetOrganizerDetails = (search?: string) => {
  return useQuery({
    queryKey: ["organizer-details", { search }],
    queryFn: async () => {
      try {
        return await axios
          .get(
            `${env.NEXT_PUBLIC_BACKEND_URL}/organizer${search ? `?search=${search}` : ""}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              method: "GET",
              withCredentials: true,
            },
          )
          .then((res) => res.data as GetOrganizerDetailsResponse);
      } catch (e) {
        if (e instanceof AxiosError) {
          throw new Error(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
            e.response?.data.message ?? "Fetching organizer details failed",
          );
        }
        throw new Error("An unexpected error occurred");
      }
    },
  });
};

export const useCheckInUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (token: string) => {
      try {
        return await axios
          .post(
            `${env.NEXT_PUBLIC_BACKEND_URL}/registration/check-in?token=${token}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
            },
          )
          .then((res) => (res.data as CheckInType).participant);
      } catch (e) {
        if (e instanceof AxiosError) {
          throw new Error(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
            e.response?.data.message ?? "Check-in failed",
          );
        }
        throw new Error("An unexpected error occurred");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["registration-details"],
      });
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FullEvent) => {
      try {
        return await axios
          .post(`${env.NEXT_PUBLIC_BACKEND_URL}/event`, formData, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            withCredentials: true,
          })
          .then((res) => res.status);
      } catch (e) {
        if (e instanceof AxiosError) {
          throw new Error(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
            e.response?.data.message ?? "Event creation failed",
          );
        }
        throw new Error("An unexpected error occurred");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["all-events"] });
      await queryClient.invalidateQueries({ queryKey: ["organizer-details"] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: string) => {
      try {
        return await axios
          .delete(`${env.NEXT_PUBLIC_BACKEND_URL}/event/${eventId}`, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "DELETE",
            withCredentials: true,
          })
          .then((res) => res.status);
      } catch (e) {
        if (e instanceof AxiosError) {
          throw new Error(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
            e.response?.data.message ?? "Event deletion failed",
          );
        }
        throw new Error("An unexpected error occurred");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["all-events"] });
      await queryClient.invalidateQueries({ queryKey: ["organizer-details"] });
    },
  });
};
