import axios, { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoginInput, RegisterInput } from "@/zod/schema";
import { env } from "@/env";
import type { LoginResponse } from "@/types/login.type";
import type { MeResponse } from "@/types/me.type";

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
