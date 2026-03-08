import { create } from "zustand";
import type { LoggedUser } from "../types/user";

interface AuthState {
  loggedUser: LoggedUser | null;
  isLogged: boolean;

  setLoggedUser: (user: LoggedUser | null) => void;
  setLoginStatus: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  loggedUser: null,
  isLogged: false,

  setLoggedUser: (user) => set({ loggedUser: user }),

  setLoginStatus: (status) => set({ isLogged: status }),
}));
