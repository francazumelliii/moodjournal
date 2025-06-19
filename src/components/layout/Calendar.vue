<!-- src/components/Calendar.vue -->
<template>
  <section class="">
    <div class="p-4 max-w-3xl mx-auto">
      <!-- Header mese -->
      <div class="flex justify-between items-center mb-2">
        <button @click="prevMonth" class="px-3 py-1 bg-gray-700 text-white rounded text-sm">←</button>
        <h2 class="text-lg font-semibold">{{ currentMonthYear }}</h2>
        <button @click="nextMonth" class="px-3 py-1 bg-gray-700 text-white rounded text-sm">→</button>
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
            class="border rounded p-1 h-20 flex flex-col hover:bg-gray-100 cursor-pointer"
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
                class="text-[10px] leading-snug px-1 bg-blue-200 text-blue-800 rounded truncate"
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

      <!-- Modal di creazione (opzionale) -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-4 rounded-lg w-80">
          <h3 class="text-base font-semibold mb-3">Crea evento ({{ selectedDateString }})</h3>
          <input
              v-model="newEventTitle"
              type="text"
              placeholder="Titolo evento"
              class="w-full p-2 border rounded text-sm mb-3"
          />
          <div class="flex justify-end gap-2">
            <button @click="closeModal" class="px-3 py-1 bg-gray-300 rounded text-sm">Annulla</button>
            <button @click="createEvent" class="px-3 py-1 bg-blue-600 text-white rounded text-sm">Crea</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/ApiService.js' // Axios o simile
// Stato mese corrente
const today = new Date()
const currentDate = ref(new Date(today.getFullYear(), today.getMonth(), 1))

// Lista eventi ricevuti dall'API per il mese corrente
// array di oggetti { id, title, date, ... }

const eventsList = ref([]);

function checkLogin() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    router.push("/")
  }
}
// Add a watcher for debugging
watch(eventsList, (newVal) => {
  console.log('eventsList changed:', newVal?.length, 'events');
}, { immediate: true, deep: true });


const user = JSON.parse(localStorage.getItem('user'));
const showModal = ref(false)
const newEventTitle = ref('')
const selectedDate = ref(null)

// Giorni settimana
const weekDays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']

// Router per navigazione
const router = useRouter()

// Computed: header mese
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

    // Make sure we're setting the value properly
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

// Costruisce calendarDays: array di oggetti { date: Date, currentMonth: boolean, events: [...] }
const calendarDays = computed(() => {
  console.log('Recalculating calendar days with events:', eventsList.value);
  const start = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
  const end = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0)

  const days = []
  const startDay = start.getDay() // 0 domenica .. 6 sabato
  const totalDays = end.getDate()

  // Helper per ottenere eventi per una data specifica
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







  // Pre-mese
  for (let i = 0; i < startDay; i++) {
    const date = new Date(start)
    date.setDate(date.getDate() - (startDay - i))
    days.push({ date, currentMonth: false, events: getEventsForDate(date) })
  }
  // Giorni mese corrente
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), i)
    days.push({ date, currentMonth: true, events: getEventsForDate(date) })
  }
  // Post-mese per completare 6 righe
  const nextDays = 42 - days.length
  for (let i = 1; i <= nextDays; i++) {
    const date = new Date(end)
    date.setDate(end.getDate() + i)
    days.push({ date, currentMonth: false, events: getEventsForDate(date) })
  }
  return days
})

// Navigazione mese
function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}
function prevMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

// Click sul giorno: ad es. apri modal di creazione, o naviga altrove
function onDayClick(day) {
  // Se vuoi permettere solo creazione su giorni del mese corrente:
  if (!day.currentMonth) return
  selectedDate.value = day.date
  newEventTitle.value = ''
  showModal.value = true
}

// Click su evento: naviga alla pagina evento
function onEventClick(event) {
  // event.id e/o event.route
  if (event.route) {
    router.push(event.route)
  } else {
    // Esempio: rotta nominata "EventDetail" con param id
    router.push({ name: 'EventDetail', params: { id: event.id } })
  }
}

// Creazione nuovo evento via API (opzionale)
// Devi avere un endpoint POST /api/events con body { title, date }
// Dopo creazione, ricarica lista
async function createEvent() {
  if (!newEventTitle.value.trim()) return
  const payload = {
    title: newEventTitle.value.trim(),
    date: selectedDateString.value
    // aggiungi altri campi se necessari
  }
  try {
    const res = await apiService.post('/events', payload)
    // Dopo creazione, ricarica eventi mese
    await fetchEventsForMonth(currentDate.value)
  } catch (error) {
    console.error('Errore creazione evento:', error)
  } finally {
    showModal.value = false
  }
}
</script>

<style scoped>
/* Puoi adattare ulteriormente h-20, p-1, text-xs ecc. come mostrato in versione compatta */
</style>
