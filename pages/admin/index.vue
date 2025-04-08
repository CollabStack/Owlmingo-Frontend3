<template>
  <div class="admin-page">
    <v-app-bar app color="white" class="mx-4 pr-5" rounded="lg" elevation="3">
      <v-toolbar-title>Filter</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn :variant="activeMode === 'today'? 'tonal':'text'" @click="onDailyClick" color="primary" class="mr-4">
        Daily
      </v-btn>
      <v-btn :variant="activeMode === 'month'? 'tonal':'text'" @click="onMonthlyClick" color="primary" class="mr-4">
        Monthly
      </v-btn>
      <v-btn :variant="activeMode === 'year'? 'tonal':'text'" @click="onYearlyClick" color="primary" class="mr-4">
        Yearly
      </v-btn>
      <!-- Compact Date Picker Button with Icon + Inline Label -->
      <v-menu
        v-model="startDateMenu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <!-- Activator Button -->
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            color="primary"
            variant="tonal"
            class="d-flex align-center mr-4 px-4"
            height="40"
          >
            <v-icon class="me-2" size="20">mdi-calendar</v-icon>
            <span class="text-caption font-weight-medium me-1">Start Date:</span>
            <span class="text-body-2">
              {{ startDate ? new Date(startDate).toLocaleDateString() : 'Pick Date' }}
            </span>
          </v-btn>
        </template>

        <!-- Date Picker Popover -->
        <v-card elevation="2" class="pa-2" style="border-radius: 12px;">
          <v-date-picker
            v-model="startDate"
            @update:model-value="startDateMenu = false"
            color="primary"
            hide-actions
            show-adjacent-months
          />
        </v-card>
      </v-menu>
      <!-- Compact Date Picker Button with Icon + Inline Label -->
      <v-menu
        v-model="endDateMenu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <!-- Activator Button -->
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            color="primary"
            variant="tonal"
            class="d-flex align-center mr-4 px-4"
            height="40"
          >
            <v-icon class="me-2" size="20">mdi-calendar</v-icon>
            <span class="text-caption font-weight-medium me-1">End Date:</span>
            <span class="text-body-2">
              {{ endDate ? new Date(endDate).toLocaleDateString() : 'Pick Date' }}
            </span>
          </v-btn>
        </template>

        <!-- Date Picker Popover -->
        <v-card elevation="2" class="pa-2" style="border-radius: 12px;">
          <v-date-picker
            v-model="endDate"
            @update:model-value="endDateMenu = false"
            color="primary"
            hide-actions
            show-adjacent-months
          />
        </v-card>
      </v-menu>

      <v-btn variant="tonal" color="red" @click="clearAllFilters" class="mr-4">
        Reset Filters
      </v-btn>

      <v-btn color="primary" variant="flat" @click="onSearchClick">
        <v-icon class="mr-2" size="20">mdi-magnify</v-icon>
        Search
      </v-btn>
    </v-app-bar>
    <v-container fluid>
      <!-- 🟡 Loading State with Skeletons -->
      <template v-if="loading">
        <!-- Payments Data (3 Stats) -->
        <v-card class="dashboard-card mb-4" rounded="lg" elevation="3">
          <v-card-title class="d-flex align-center mb-2">
            <v-skeleton-loader type="avatar" class="mr-2" width="32" height="32" />
            <v-skeleton-loader type="text" width="120px" />
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" v-for="i in 3" :key="'payment-stat-' + i">
                <div class="card-stat">
                  <v-skeleton-loader type="text" width="60%" class="mb-2" />
                  <v-skeleton-loader type="heading" width="40%" />
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Revenue, Files, Summaries -->
        <v-row class="mb-4">
          <v-col cols="12" md="4" v-for="i in 3" :key="'top-group-' + i">
            <v-card class="dashboard-card" rounded="lg" elevation="3">
              <v-card-title class="d-flex align-center mb-2">
                <v-skeleton-loader type="avatar" class="mr-2" width="32" height="32" />
                <v-skeleton-loader type="text" width="100px" />
              </v-card-title>
              <v-card-text>
                <div class="card-stat">
                  <v-skeleton-loader type="text" width="60%" class="mb-2" />
                  <v-skeleton-loader type="heading" width="40%" />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Users Data (3 Stats) -->
        <v-card class="dashboard-card mb-4" rounded="lg" elevation="3">
          <v-card-title class="d-flex align-center mb-2">
            <v-skeleton-loader type="avatar" class="mr-2" width="32" height="32" />
            <v-skeleton-loader type="text" width="120px" />
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" v-for="i in 3" :key="'user-stat-' + i">
                <div class="card-stat">
                  <v-skeleton-loader type="text" width="60%" class="mb-2" />
                  <v-skeleton-loader type="heading" width="40%" />
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Plans Data (3 Stats) -->
        <v-card class="dashboard-card mb-4" rounded="lg" elevation="3">
          <v-card-title class="d-flex align-center mb-2">
            <v-skeleton-loader type="avatar" class="mr-2" width="32" height="32" />
            <v-skeleton-loader type="text" width="120px" />
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" v-for="i in 3" :key="'plan-stat-' + i">
                <div class="card-stat">
                  <v-skeleton-loader type="text" width="60%" class="mb-2" />
                  <v-skeleton-loader type="heading" width="40%" />
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Flashcards & Quizzes (Single Stat Each) -->
        <v-row>
          <v-col cols="12" md="4" v-for="i in 2" :key="'bottom-group-' + i">
            <v-card class="dashboard-card mb-4" rounded="lg" elevation="3">
              <v-card-title class="d-flex align-center mb-2">
                <v-skeleton-loader type="avatar" class="mr-2" width="32" height="32" />
                <v-skeleton-loader type="text" width="100px" />
              </v-card-title>
              <v-card-text>
                <div class="card-stat">
                  <v-skeleton-loader type="text" width="60%" class="mb-2" />
                  <v-skeleton-loader type="heading" width="40%" />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>


      <!-- ✅ Loaded State -->
      <template v-else>
        <Admin-Charts-TotalCard
          class="mb-4"
          :data="paymentsData"
          title="Payments Data"
          icon="mdi-currency-usd"
        />

        <v-row class="mb-2">
          <v-col cols="12" md="4">
            <Admin-Charts-TotalCard
              :data="revenueData"
              title="Revenue"
              icon="mdi-currency-usd"
            />
          </v-col>
          <v-col cols="12" md="4">
            <Admin-Charts-TotalCard
              :data="filesData"
              title="Files"
              icon="mdi-file-check-outline"
            />
          </v-col>
          <v-col cols="12" md="4">
            <Admin-Charts-TotalCard
              :data="summariesData"
              title="Summaries"
              icon="mdi-book-open-page-variant-outline"
            />
          </v-col>
        </v-row>

        <Admin-Charts-TotalCard
          class="mb-4"
          :data="usersData"
          title="Users Data"
          icon="mdi-account-check-outline"
        />

        <Admin-Charts-TotalCard
          class="mb-4"
          :data="plansData"
          title="Plans Data"
          icon="mdi-briefcase-outline"
        />

        <v-row>
          <v-col cols="12" md="4">
            <Admin-Charts-TotalCard
              :data="flashcardsData"
              title="Flashcards"
              icon="mdi-cards-outline"
            />
          </v-col>
          <v-col cols="12" md="4">
            <Admin-Charts-TotalCard
              :data="quizzesData"
              title="Quizzes"
              icon="mdi-help-box-multiple-outline"
            />
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { dashboardStore } from '~/store/dashboard';

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  meta: {
    requiresAuth: true,
  },
});

const useDashboardStore = dashboardStore();
const loading = ref(true);

const startDateMenu = ref(false);
const endDateMenu = ref(false);
const startDate = ref(null);
const endDate = ref(null);

const usersData = ref({});
const plansData = ref({});
const paymentsData = ref({});
const revenueData = ref({});
const filesData = ref({});
const summariesData = ref({});
const flashcardsData = ref({});
const quizzesData = ref({});

let activeMode = ref('');

const clearAllFilters = () => {
  startDate.value = null;
  endDate.value = null;
  startDateMenu.value = false;
  endDateMenu.value = false;
  activeMode.value = '';
  fetchDashboardData();
};

const onDailyClick = () => {
  activeMode.value = 'today';
  fetchDashboardData('today');
};

const onMonthlyClick = () => {
  activeMode.value = 'month';
  fetchDashboardData('month');
};

const onYearlyClick = () => {
  activeMode.value = 'year';
  fetchDashboardData('year');
};

const onSearchClick = () => {
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value);
    start.setHours(0, 0, 0, 0); // 👈 Start of day (00:00:00.000)

    const end = new Date(endDate.value);
    end.setHours(23, 59, 59, 999); // 👈 End-day end (23:59:59.999)

    activeMode.value = 'range';

    // Send ISO strings
    fetchDashboardData('range', start.toISOString(), end.toISOString());
  }
};


const fetchDashboardData = async (mode = '', start = '', end = '') => {
  loading.value = true;
  try {
    let query = '';
    if (mode === 'today') {
      query = '?mode=today';
    } else if (mode === 'month') {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);

      startDate.value = startOfMonth;
      endDate.value = endOfMonth;

      query = `?mode=range&startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`;
    } else if (mode === 'year') {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      startOfYear.setHours(0, 0, 0, 0);

      const endOfYear = new Date(now.getFullYear(), 11, 31);
      endOfYear.setHours(23, 59, 59, 999);

      startDate.value = startOfYear;
      endDate.value = endOfYear;

      query = `?mode=range&startDate=${startOfYear.toISOString()}&endDate=${endOfYear.toISOString()}`;
    } else if (mode === 'range' && start && end) {
      query = `?mode=range&startDate=${start}&endDate=${end}`;
    }

    console.log('Query:', query);
    const response = await useDashboardStore.getDashboardData(query);
    const data = response;

    usersData.value = {
      totalUsers: data.totalUsers,
      totalActiveUsers: data.totalActiveUsers,
      totalInactiveUsers: data.totalInactiveUsers
    };

    plansData.value = {
      totalPlans: data.totalPlans,
      totalActivePlans: data.totalActivePlans,
      totalInactivePlans: data.totalInactivePlans
    };

    paymentsData.value = {
      totalPayments: data.totalPayments,
      totalCompletedPayments: data.totalCompletedPayments,
      totalPendingPayments: data.totalPendingPayments
    };

    revenueData.value = {
      totalRevenue: data.totalRevenue + ' $'
    };

    filesData.value = {
      totalFiles: data.totalFiles
    };

    summariesData.value = {
      totalSummaries: data.totalSummaries
    };

    flashcardsData.value = {
      totalFlashcards: data.totalFlashcards
    };

    quizzesData.value = {
      totalQuizzes: data.totalQuizzes
    };
  } catch (e) {
    console.error('Dashboard load error:', e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});

</script>

<style scoped>
.admin-page {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 0px;
  margin: 0px;
}

.font-weight-medium {
  font-weight: 500;
}

</style>
