import { createContext, useContext } from "react";
import type { User } from "@/types/login.type";

export const SessionContext = createContext<User | undefined>(undefined);

export const useUserSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
