<script setup>
import SimpleCard from "@/components/layout/SimpleCard.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import modalService from "@/services/ModalService.js";
import apiService from "@/services/ApiService.js";
import router from "@/router/index.js";

const route = useRoute();
const journalId = route.params.id;

const activities = ref([]);
const emotions = ref([]);
const selectedEmotions = ref([]);
const selectedActivities = ref({ selected: [], descriptions: {} });
const moodSlider = ref(0);
const song = ref("");
const color = ref("");
const quote = ref("");
const obsessiveThought = ref("");
const goods = ref("");
const bads = ref("");
const anxiety = ref(0);
const stress = ref(0);
const energy = ref(0);


onMounted(async () => {
  try {
    console.log('Loading journal details...');
    await fetchLookups();
    await fetchJournal();
    checkLogin()
  } catch (error) {
    console.error('Error in component mount:', error);
  }
});

function checkLogin() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    console.warn('User not logged in, redirecting to login page...');
    router.push("/");
  }
}
const user = JSON.parse(localStorage.getItem('user')) || { id: null };


async function fetchLookups() {
  try {
    const [activitiesResponse, emotionsResponse] = await Promise.all([
      apiService.get("/activities/all"),
      apiService.get("/emotions/all")
    ]);

    activities.value = Array.isArray(activitiesResponse.data)
      ? activitiesResponse.data
      : activitiesResponse;

    emotions.value = Array.isArray(emotionsResponse.data)
      ? emotionsResponse.data
      : emotionsResponse;

    console.log('Lookups loaded:', {
      activities: activities.value.length,
      emotions: emotions.value.length
    });
  } catch (error) {
    console.error('Error loading lookups:', error);
    activities.value = [];
    emotions.value = [];
  }
}

async function deleteJournal() {
  try {
    const response = await apiService.delete(`/journals/${journalId}`);
    if(response){
      router.push("/home");
    }
  } catch (e) {
    console.error('Error deleting journal:', e);
  }
}

async function fetchJournal() {
  try {
    const response = await apiService.get(`/journals/${journalId}`);
    console.log('Raw journal data:', response);

    const j = response.data || response;

    // Map the correct field names
    moodSlider.value = j.moodLevel ?? 50;
    song.value = j.song ?? '';
    color.value = j.color ?? '#000000';
    quote.value = j.quote ?? '';
    obsessiveThought.value = j.obsessiveThought ?? '';
    goods.value = j.goods ?? '';
    bads.value = j.bads ?? '';
    anxiety.value = j.anxietyLevel ?? 0;
    stress.value = j.stressLevel ?? 0;
    energy.value = j.energyLevel ?? 0;

    // Handle emotions array with proper mapping
    if (Array.isArray(j.emotions)) {
      selectedEmotions.value = j.emotions.map(e => e.id);
      console.log('Mapped emotions:', selectedEmotions.value);
    } else {
      selectedEmotions.value = [];
    }

    // Handle activities with proper mapping
    if (Array.isArray(j.activities)) {
      selectedActivities.value = {
        selected: j.activities.map(a => ({
          id: a.id,
          name: a.name
        })),
        descriptions: j.activities.reduce((acc, a) => {
          acc[a.id] = a.description || '';
          return acc;
        }, {})
      };
    } else {
      selectedActivities.value = { selected: [], descriptions: {} };
    }

    console.log('Mapped journal data:', {
      mood: moodSlider.value,
      emotions: selectedEmotions.value,
      activities: selectedActivities.value
    });

  } catch (e) {
    console.error('Error loading journal:', e);
    modalService.close();
  }
}
function buildJournalRequest() {
  return {
    moodLevel: moodSlider.value,
    song: song.value,
    color: color.value,
    quote: quote.value,
    obsessiveThought: obsessiveThought.value,
    goods: goods.value,
    bads: bads.value,
    anxietyLevel: anxiety.value,
    stressLevel: stress.value,
    energyLevel: energy.value,
    user: {
      id: user.id
    },
    activities: selectedActivities.value.selected.map(a => ({
      id: a.id,
      description: selectedActivities.value.descriptions[a.id]
    })),
    emotions: selectedEmotions.value.map(id => ({ id }))
  };
}

async function saveJournal() {
  try {
    await apiService.put(`/journals/${journalId}`, buildJournalRequest());
    modalService.close();

  } catch (e) {
    console.error("Errore salvataggio journal:", e);
  }
}


</script>

<template>
  <section class="bg-gray-900 rounded-lg flex flex-col p-4 " >
    <h2 class="text-xl text-white font-bold mb-4">Modifica Journal</h2>
    <div class="grid grid-cols-2 gap-3 mb-4 w-full">
      <div class="flex flex-col col-span-2 items-center mb-4 w-[100%] " >
        <SimpleCard label="Mood Slider" type="SLIDER" v-model="moodSlider" class="w-full">
          <div class="flex gap-x-3 flex-wrap w-full items-center justify-center">
            <label v-for="e in emotions" :key="e.id"
                   class="flex flex-col items-center cursor-pointer">
              <input type="checkbox" :value="e.id" v-model="selectedEmotions" class="hidden" />
              <div :class="['p-1 rounded-full', selectedEmotions.includes(e.id) ? 'bg-cyan-500' : 'bg-transparent']">
                <img :src="e.image" :alt="e.name" class="w-10 h-10 rounded-full" />
              </div>
              <span class="text-xs" :class="selectedEmotions.includes(e.id) ? 'text-cyan-500' : 'text-white'">
              {{ e.name }}
            </span>
            </label>
          </div>
        </SimpleCard>
      </div>
      <SimpleCard label="Song of the day" type="INPUT_IMAGE" v-model="song"
                  image="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1200px-Spotify_logo_without_text.svg.png"
                  image-size="w-10 h-10" />
      <SimpleCard label="Color of the day" type="PICKER" v-model="color" class="bg-gray-800"/>
      <SimpleCard label="Quote of the day" type="SELECT" v-model="quote" />
      <SimpleCard label="Obsessive thought" type="INPUT_ONLY" v-model="obsessiveThought" />
      <SimpleCard label="Goods of the day" type="INPUT_ONLY" v-model="goods" />
      <SimpleCard label="Bads of the day" type="INPUT_ONLY" v-model="bads" />
    </div>



    <div class="mb-4">
      <SimpleCard
          label="Activities"
          type="MULTI_SELECT"
          :model-value="selectedActivities"
          v-model="selectedActivities"
          :activities="activities" />


    </div>

    <div class="grid grid-cols-3 gap-3 mb-4">
      <SimpleCard label="Stress Level" type="SLIDER" v-model="stress"
                  image="https://www.freeiconspng.com/uploads/stress-icons--noun-project-0.png" />
      <SimpleCard label="Anxiety Level" type="SLIDER" v-model="anxiety"
                  image="https://cdn-icons-png.flaticon.com/512/6124/6124549.png" />
      <SimpleCard label="Energy Level" type="SLIDER" v-model="energy"
                  image="https://png.pngtree.com/element_our/png/20180823/energy-line-icon-png_65280.jpg" />
    </div>

    <div class="flex justify-end gap-2">
      <button @click="saveJournal" class="px-4 py-2 hover:bg-cyan-700 bg-cyan-600 text-white rounded-lg">Salva</button>
      <button @click="deleteJournal" class="px-4 py-2 hover:bg-gray-700 bg-gray-600 text-white rounded-lg">Elimina</button>
    </div>
  </section>
</template>
