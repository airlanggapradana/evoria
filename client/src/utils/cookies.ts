"use server";
import { cookies } from "next/headers";

export const getCookie = async (name: string) => {
  const cookieStore = await cookies();

  return cookieStore.get(name)?.value ?? null;
};

export const deleteCookie = async (name: string) => {
  const cookieStore = await cookies();

  cookieStore.delete(name);
};
