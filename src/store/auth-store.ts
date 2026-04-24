import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  displayName: string;
  username: string;
  login: (displayName: string, username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true,
  displayName: "Charlene",
  username: "charlene",
  login: (displayName, username) =>
    set({ isAuthenticated: true, displayName, username }),
  logout: () =>
    set({ isAuthenticated: false, displayName: "", username: "" }),
}));
