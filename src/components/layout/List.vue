
<template>
  <section class="flex flex-col items-center justify-center gap-6 p-6 bg-gray-800 rounded-xl shadow-lg">
    <div class="flex items-center w-full justify-center">
      <h1 class="text-4xl text-indigo-500 text-center font-bold">My Journals</h1>
    </div>

    <div class="flex flex-row justify-between gap-1 w-full bg-gray-900 items-center px-2">
      <select v-model="year" class="bg-gray-800 text-white rounded-lg w-1/10 h-10 ">
        <option v-for="y in [2023, 2024, 2025]" :key="y" :value="y">{{ y }}</option>
      </select>

      <select value="month" v-model="month" class="bg-gray-800 text-white rounded-lg w-1/10 h-10 ">
        <option v-for="(m, index) in ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']" :key="index" :value="index + 1">{{ m }}</option>
      </select>
      <div class="flex items-center justify-center w-1/10">
        <SimpleCard type="PICKER" :show-value="false" v-model="color"></SimpleCard>
      </div>

      <div class="flex flex-row justify-between items-center gap-x-1">
        <label
            v-for="emotion in emotions"
            :key="emotion.id"
            class="flex flex-col items-center cursor-pointer select-none"
        >
          <input
              type="checkbox"
              :value="emotion.id"
              v-model="selectedEmotions"
              class="hidden"
          />
          <div
              :class="[
                    'p-1 rounded-full transition-all duration-200',
                    selectedEmotions.includes(emotion.id) ? 'bg-cyan-500 scale-110' : 'bg-transparent'
                  ]"
          >
            <img
                :src="emotion.image"
                :alt="emotion.name"
                class="w-10 h-10 rounded-full"
            />
          </div>
          <span
              :class="[
                    'text-xs mt-1 transition-colors',
                    selectedEmotions.includes(emotion.id) ? 'text-cyan-500' : 'text-white'
                  ]"
          >
                  {{ emotion.name }}
                </span>
        </label>
      </div>

      <select value="sortBy" v-model="sortBy" class="bg-gray-800 text-white rounded-lg w-1/10 h-10 ">
        <option value ="date">Date</option>
        <option value ="mood_level">Mood</option>
      </select>

      <select value="direction" v-model="direction" class="bg-gray-800 text-white rounded-lg w-1/10 h-10 ">
        <option value ="ASC">ASC</option>
        <option value ="DESC">DESC</option>
      </select>

      <div class="flex flex-col items-center  " @click="resetFilters">
        <svg class="w-6 h-6 text-gray-800 dark:text-gray-600 hover:bg-gray-700 rounded-md hover:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
        </svg>
        <small class="text-gray-600 text-xs">Reset</small>

      </div>


    </div>

    <table class="w-full border border-gray-600 ">
      <thead class="bg-gray-800 ">
      <tr>
        <th class="px-4 py-2 text-center text-gray-200">Date</th>
        <th class="px-4 py-2 text-center text-gray-200">Mood</th>
        <th class="px-4 py-2 text-center text-gray-200">Song</th>
        <th class="px-4 py-2 text-center text-gray-200">Quote</th>
        <th class="px-4 py-2 text-center text-gray-200">Color</th>
        <th class="px-4 py-2 text-center text-gray-200">Emotions</th>

      </tr>
      </thead>
      <tbody>
      <tr v-for="item in list" :key="item.id" class="border-b border-gray-600 hover:bg-gray-700" @click="router.push(`/journal/${item.id}`)">
        <td class="px-4 py-2">
          <p class=" text-sm text-gray-400">{{item.date}}</p>
        </td>
        <td class="px-4 py-2 w-50">
          <SimpleCard type="SLIDER" v-model="item.moodLevel" :disabled="true" :show-value="false"></SimpleCard>
        </td>
        <td class="px-4 py-2 ">
          <p class=" text-sm text-gray-400">{{item.song}}</p>
        </td>
        <td class="px-4 py-2">
          <p class=" text-sm text-gray-400">{{item.quote}}</p>
        </td>
        <td class="px-4 py-2">
          <div class="m-3 w-10 h-5" :style="{ backgroundColor: item.color }"></div>
        </td>
        <td class="px-4 py-2">
          <div class="flex flex-row justify-center items-center gap-x-1">
            <div v-for="emotion in item.emotions"
                 :class="[
                    'p-1 rounded-full transition-all duration-200',
                  ]"
            >
              <img
                  :src="emotion.image"
                  :alt="emotion.name"
                  class="w-10 h-10 rounded-full"
              />
            </div>
          </div>

        </td>
      </tr>
      </tbody>

    </table>

<div class="flex justify-center items-center gap-4 mt-4 text-white">
  <button
    @click="previousPage"
    class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded disabled:opacity-50"
    :disabled="page === 1"
  >
    ←
  </button>

  <span>Page {{ page }} <span v-if="total">({{ total }} records)</span></span>

  <button
    @click="nextPage"
    class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded disabled:opacity-50"
    :disabled="list.length < limit"
  >
    →
  </button>
</div>


  </section>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import router from "@/router/index.js";
import apiService from "@/services/ApiService.js";
import SimpleCard from "@/components/layout/SimpleCard.vue";

const user = JSON.parse(localStorage.getItem('user'));

const list = ref([]);
const emotions = ref([]);
const selectedEmotions = ref([]);


const page = ref(1);
const limit = ref(10);
const total = ref(0);
const month = ref(new Date().getMonth() + 1);
const year = ref(new Date().getFullYear());
const sortBy = ref('date');
const direction = ref('DESC');
const color = ref(null);

onMounted(async () => {
  checkLogin();
  await fetchEmotions();
  await fetchList();
});

function checkLogin() {
  if (!localStorage.getItem("user")) {
    router.push("/");
  }
}

function resetFilters() {
  year.value = new Date().getFullYear();
  month.value = new Date().getMonth() + 1;
  sortBy.value = 'date';
  direction.value = 'DESC';
  selectedEmotions.value = [];
  color.value = null;  // oppure '' se preferisci
}



watch(
    [year, month, selectedEmotions, sortBy, direction, color, limit],
    () => {
      page.value = 1;
      fetchList();
    }
);

const previousPage = () => {
  if (page.value > 1) {
    page.value--;
    fetchList();
  }
}

const nextPage = () => {
  page.value++;
  fetchList();
}


async function fetchList() {
  try {
    const params = {
      userId: user.id,
      page: page.value,
      limit: limit.value,
      month: `${year.value}-${String(month.value).padStart(2, '0')}`,
      sortBy: sortBy.value,
      direction: direction.value,
      color: (color.value && color.value.toLowerCase() !== '#000000' && color.value !== '000000' && color.value !== 'rgba(0, 0, 0, 0)') ? color.value : null,
    };


    const queryString = new URLSearchParams();

    // Aggiungiamo gli array con la sintassi [] per emotions
    if (selectedEmotions.value.length > 0) {
      selectedEmotions.value.forEach(emotionId => {
        queryString.append('emotions[]', emotionId);
      });
    }

    // Aggiungiamo gli altri parametri
    Object.entries(params).forEach(([key, val]) => {
      if (val !== null && val !== '' && val !== undefined) {
        queryString.append(key, val);
      }
    });

    const url = `/journals?${queryString.toString()}`;
    console.log('URL chiamata:', url);  // per debug

    const response = await apiService.get(url);
    if (response) {
      list.value = response;
      console.log('Dati giornale caricati:', response);
    }
  } catch (error) {
    console.error('Errore fetchList:', error);
  }
}

async function fetchEmotions() {
  try {
    const response = await apiService.get('/emotions/all');
    emotions.value = response;
  } catch (error) {
    console.error('Error fetching emotions:', error);
  }
}
</script>
