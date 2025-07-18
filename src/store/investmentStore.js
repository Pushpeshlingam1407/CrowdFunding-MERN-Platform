import { create } from 'zustand';
import axios from 'axios';

const useInvestmentStore = create((set, get) => ({
  investments: [],
  loading: false,
  error: null,

  createInvestment: async (investmentData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/investor/pay-order`,
        investmentData,
        {
          headers: {
            'auth-token': localStorage.getItem('token'), // Assuming token is stored in localStorage
          },
        }
      );

      if (response.data.success) {
        const newInvestment = {
          amount: investmentData.amount,
          startup_id: investmentData.startup_id,
          investor_id: investmentData.investor_id,
          isPaid: true,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          investments: [newInvestment, ...state.investments],
        }));

        return { data: newInvestment, error: null };
      } else {
        throw new Error(response.data.msg || 'Failed to create investment');
      }
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  fetchUserInvestments: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/investor/getTransactions`,
        {
          headers: {
            'auth-token': localStorage.getItem('token'),
          },
        }
      );

      if (response.data.success) {
        set({ investments: response.data.data, loading: false, error: null });
      } else {
        set({ loading: false, error: response.data.msg });
      }
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },
}));

export default useInvestmentStore;
