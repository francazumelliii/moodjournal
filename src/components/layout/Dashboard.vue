<template>
  <section class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-800 rounded-xl shadow-lg">
    <!-- Chart 1 -->
    <div class="flex flex-col items-center justify-center bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <Chart chart-title="This Month Energy-Stress-Anxiety Levels" :chart-data="monthStats" />
    </div>

    <!-- Chart 2 -->
    <div class="flex flex-col items-center justify-center bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <Chart :chartLabels="monthEmotions.labels" chart-title="This Month Emotions" chart-type="polarArea" :chart-data="monthEmotions.series" />
    </div>

    <!-- New Journal Button -->
    <div
        class="md:col-span-2 flex flex-col items-center justify-center gap-4 p-6 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 rounded-lg cursor-pointer transition-all duration-300"
        @click="openModal"
    >
      <p class="text-white font-bold text-size-xl">New Journal</p>
      <!-- svg and text -->
    </div>
  </section>
</template>

<script setup>
import Chart from "@/components/charts/Chart.vue";
import modalService from "@/services/ModalService.js";
import JournalModal from "@/components/modals/JournalModal.vue";
import { onMounted, ref } from "vue";
import apiService from "@/services/ApiService.js";
import router from "@/router/index.js";

const monthStats = ref([]);
const monthEmotions = ref([]);
const user = JSON.parse(localStorage.getItem('user'));

function openModal() {
  const modal = modalService.open(JournalModal, {
    onSubmit: async () => {
      console.log('Journal submitted, refreshing data...');
      await fetchMonthData();
    }
  });
}

onMounted(() => {
  checkLogin();
  fetchMonthData();
});

function checkLogin() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    router.push("/")
  }
}

async function fetchMonthData() {
  await fetchMonthStats();
  await fetchMonthEmotions();
}

async function fetchMonthStats() {
  try {
    const formattedDate = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const response = await apiService.get(`/journals/stats?userId=${user.id}&month=${formattedDate}`);
    monthStats.value = response;
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
  }
}

async function fetchMonthEmotions() {
  try {
    const formattedDate = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const response = await apiService.get(`/journals/emotions/stats?userId=${user.id}&month=${formattedDate}`);
    monthEmotions.value = response;
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
  }
}
</script>
