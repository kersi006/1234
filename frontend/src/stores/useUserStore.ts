import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/api';
import { useCartStore } from './useCartStore';

interface UserStore {
  currentUser: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      currentUser: null,

      setUser: (user) => {
        set({ currentUser: user });
      },

      logout: () => {
        set({ currentUser: null });
        useCartStore.getState().clearCart();
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
