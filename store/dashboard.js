import { defineStore } from "pinia";
import { useNuxtApp } from "#app";

export const dashboardStore = defineStore("dashboardStore", {
  state: () => ({
    dashboardData: {
      totalUsers: 0,
      totalActiveUsers: 0,
      totalInactiveUsers: 0,
      totalPlans: 0,
      totalActivePlans: 0,
      totalInactivePlans: 0,
      totalPayments: 0,
      totalCompletedPayments: 0,
      totalPendingPayments: 0,
      totalRevenue: 0,
      totalFiles: 0,
      totalFlashcards: 0,
      totalSummaries: 0,
      totalQuizzes: 0,
    },
  }),
  actions: {
    async getDashboardData() {
      const { $AdminPrivateAxios } = useNuxtApp();
      try {
        const response = await $AdminPrivateAxios.get("/dashboard");
        this.dashboardData = response.data.data; // ✅ only the real data
        console.log("====== Dashboard Data ======");
        console.log(this.dashboardData);
        console.log("============================");
        return this.dashboardData;
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Failed to fetch dashboard data");
      }
    },
  },
});
