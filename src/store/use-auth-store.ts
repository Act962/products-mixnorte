import { getLead } from "@/http/get-lead";
import { Lead } from "@/types/lead";
import { create } from "zustand";

type AuthStore = {
  authLead: Lead | null;
  checkLead: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()((set, get) => ({
  authLead: null,
  checkLead: async () => {
    //
  },
}));
