<template>
  <section class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-800 rounded-xl shadow-lg">
    <div class="col-span-2 flex items-center w-full justify-center">
      <h1 class="text-4xl text-indigo-500 text-center font-bold">My Personal Journal</h1>
    </div>

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
      <div class="flex items-center align-center flex-row gap-3">
        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z" clip-rule="evenodd"/>
        </svg>

        <p class="text-white font-bold text-2xl">Create Today's Journal</p>
      </div>
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
