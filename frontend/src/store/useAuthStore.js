import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
}));