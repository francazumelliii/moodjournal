<!-- src/components/Calendar.vue -->
<template>
  <section class="w-full p-4">
    <div class="p-4 w-full mx-auto">
      <!-- Header mese -->
      <div class="flex justify-between items-center mb-2">
        <button @click="prevMonth" class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">←</button>
        <h2 class="text-lg font-semibold uppercase dark:text-white">{{ currentMonthYear }}</h2>
        <button @click="nextMonth" class="px-3 py-1 bg-gray-700  hover:bg-gray-600 text-white rounded text-sm">→</button>
      </div>

      <!-- Giorni settimana -->
      <div class="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-400">
        <div v-for="(day, idx) in weekDays" :key="idx">{{ day }}</div>
      </div>

      <!-- Celle giorni -->
      <div class="grid grid-cols-7 gap-1 mt-1">
        <div
            v-for="(day, idx) in calendarDays"
            :key="idx"
            class="border rounded p-1 h-20 flex flex-col bg-gray-700 hover:bg-gray-600 cursor-pointer"
            @click="onDayClick(day)"
        >
          <!-- Numero giorno -->
          <div class="text-xs font-medium" :class="{ 'text-gray-400': !day.currentMonth }">
            {{ day.date.getDate() }}
          </div>

          <!-- Eventi: fino a 3, con truncation -->
          <div class="mt-1 space-y-0.5 flex-1 overflow-hidden">
            <div
                v-for="(event, eidx) in day.events.slice(0, 3)"
                :key="event.id"
                class="text-[10px] leading-snug px-1 bg-indigo-400 hover:bg-indigo-500 text-indigo-900 rounded truncate"
                :title="event.date"
                @click.stop="onEventClick(event)"
            >
              {{ event.title }}
            </div>
            <div
                v-if="day.events.length > 3"
                class="text-[10px] text-gray-500 mt-0.5"
            >
              +{{ day.events.length - 3 }}...
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/ApiService.js'

const today = new Date()
const currentDate = ref(new Date(today.getFullYear(), today.getMonth(), 1))


const eventsList = ref([]);

function checkLogin() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    router.push("/")
  }
}

watch(eventsList, (newVal) => {
  console.log('eventsList changed:', newVal?.length, 'events');
}, { immediate: true, deep: true });


const user = JSON.parse(localStorage.getItem('user'));
const newEventTitle = ref('')
const selectedDate = ref(null)

const weekDays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']


const router = useRouter()

const currentMonthYear = computed(() =>
    currentDate.value.toLocaleDateString('it-IT', {
      month: 'long',
      year: 'numeric'
    })
)
const selectedDateString = computed(() =>
    selectedDate.value?.toISOString().split('T')[0]
)

async function fetchEventsForMonth(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  try {
    console.log(`Fetching events for ${year}-${month}...`);
    const response = await apiService.get(`/journals?month=${year}-${month}&userId=${user.id}`)

    if (Array.isArray(response)) {
      eventsList.value = response;
      console.log('Events loaded:', response.length, 'events');
      console.log('First event:', response[0]);
    } else {
      console.warn('API response is not an array:', response);
      eventsList.value = [];
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    eventsList.value = [];
  }
}

function formatLocalDateToYMD(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}


onMounted(async () => {
  checkLogin()
  console.log('Calendar mounted, fetching events...');
  await fetchEventsForMonth(currentDate.value);

  await nextTick();
  console.log('After nextTick - Events count:', eventsList.value?.length);
  console.log('After nextTick - Events data:', eventsList.value);
});

watch(currentDate, async (newDate) => {
  await fetchEventsForMonth(newDate);
});

const calendarDays = computed(() => {
  console.log('Recalculating calendar days with events:', eventsList.value);
  const start = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
  const end = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0)

  const days = []
  const startDay = start.getDay() // 0 domenica .. 6 sabato
  const totalDays = end.getDate()

  function getEventsForDate(date) {
  if (!eventsList.value) {
    console.warn('eventsList is null/undefined');
    return [];
  }
  console.log("EVENTSLIST VALUES: ",eventsList.value);

  const key = formatLocalDateToYMD(date);
  console.log(`Getting events for ${key}, total events:`, eventsList.value.length);

  return eventsList.value
    .filter(evt => {
      if (!evt?.date) return false;
      const evtDate = formatLocalDateToYMD(new Date(evt.date));
      return evtDate === key;
    })
    .map(evt => ({
      id: evt.id,
      title: evt.date || evt.oneWordDesc || evt.quote || 'Giornale',
      date: evt.date,
      route: `/journal/${evt.id}`,
      raw: evt
    }));
}







  for (let i = 0; i < startDay; i++) {
    const date = new Date(start)
    date.setDate(date.getDate() - (startDay - i))
    days.push({ date, currentMonth: false, events: getEventsForDate(date) })
  }
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), i)
    days.push({ date, currentMonth: true, events: getEventsForDate(date) })
  }
  const nextDays = 42 - days.length
  for (let i = 1; i <= nextDays; i++) {
    const date = new Date(end)
    date.setDate(end.getDate() + i)
    days.push({ date, currentMonth: false, events: getEventsForDate(date) })
  }
  return days
})

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}
function prevMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

function onDayClick(day) {
  if (!day.currentMonth) return
  selectedDate.value = day.date
  newEventTitle.value = ''
}

function onEventClick(event) {
  if (event.route) {
    router.push(event.route)
  } else {
    router.push({ name: 'EventDetail', params: { id: event.id } })
  }
}


</script>

<style scoped>
</style>
