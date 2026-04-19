import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserInfo = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  login: (userData: UserInfo, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'hidden-ops-auth',
    }
  )
);
