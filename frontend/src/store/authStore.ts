import { apiPost } from "@/lib/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF_GUDANG";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

interface BackendLoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      nama: string;
      email: string;
      role: string;
    };
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        const response = await apiPost<BackendLoginResponse>("/auth/login", {
          identifier: email,
          password,
        });

        if (!response.success) {
          throw new Error(response.message || "Login failed");
        }

        const { token, user } = response.data;

        const mappedUser: User = {
          id: String(user.id),
          name: user.nama,
          email: user.email,
          role: user.role.toLowerCase() === "admin" ? "ADMIN" : "STAFF_GUDANG",
        };

        set({
          user: mappedUser,
          token,
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
