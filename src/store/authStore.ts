import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Mock login - replace with real API call
        const mockUser: User = {
          id: '1',
          name: 'Admin User',
          email: email,
          role: 'ADMIN',
        };
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        set({ 
          user: mockUser, 
          token: mockToken, 
          isAuthenticated: true 
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
      name: 'auth-storage',
    }
  )
);
