import { create } from "zustand";
import { getUserSession, logoutUser } from "../api/userApi";

const useUserStore = create((set) => ({
  user: null,
  isLoading: true,

  fetchSession: async () => {
    try {
        const userData = await getUserSession();
        if (!userData) {
            set({ user: null, isLoading: false });
        } else {
            set({ user: userData, isLoading: false });
        }
    } catch (error) {
        set({ user: null, isLoading: false }); 
    }
},

  login: (userData) => {
    set({ user: userData });
  },

  logout: async () => {
    await logoutUser();
    set({ user: null });
  },
}));

export default useUserStore;
