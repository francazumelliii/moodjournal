<script setup>
import SimpleCard from "@/components/layout/SimpleCard.vue";
import { onMounted, ref } from "vue";
import modalService from "@/services/ModalService.js";
import apiService from "@/services/ApiService.js";

const activities = ref([]);
const emotions = ref([]);
const selectedEmotions = ref([]); // stato checkbox emozioni

const selectedActivities = ref({
  selected: [],
  descriptions: {}
});

const moodSlider = ref(0);
const song = ref('');
const color = ref('');
const quote = ref('');
const obsessiveThought = ref('');
const goods = ref('');
const bads = ref('');
const anxiety = ref(0);
const stress = ref(0);
const energy = ref(0);
const user = JSON.parse(localStorage.getItem('user')) || { id: null };

onMounted(async () => {
  await fetchActivities();
  await fetchEmotions();
});

const emit = defineEmits(['submit']);

async function fetchActivities() {
  try {
    const response = await apiService.get('/activities/all');
    activities.value = response;
  } catch (error) {
    console.error('Error fetching activities:', error);
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

function submitData() {
  createJournal();
  emit('submit');
}

async function createJournal() {
  const journalRequest = buildJournalRequest();

  console.log('Submitting journal with levels:', {
    mood: journalRequest.moodLevel,
    anxiety: journalRequest.anxietyLevel,
    energy: journalRequest.energyLevel,
    stress: journalRequest.stressLevel
  });

  try {
    const response = await apiService.post('/journals', journalRequest);
    console.log('Journal created successfully:', response);
    modalService.close();
  } catch (error) {
    console.error('Error creating journal:', error);
  }
}
function buildJournalRequest() {
  return {
    moodLevel: Number(moodSlider.value),
    anxietyLevel: Number(anxiety.value),
    energyLevel: Number(energy.value),
    stressLevel: Number(stress.value),
    song: song.value,
    color: color.value,
    quote: quote.value,
    obsessiveThought: obsessiveThought.value,
    goods: goods.value,
    bads: bads.value,
    activities: selectedActivities.value.selected.map(activity => ({
      id: activity.id,
      description: selectedActivities.value.descriptions[activity.id] || ''
    })),
    emotions: selectedEmotions.value.map(id => ({ id })),
    user: {
      id: user.id
    }
  };
}
</script>

<template>
  <section class="bg-gray-900 rounded-lg flex flex-col h-[100vh] overflow-y-auto">
    <main class="gap-y-3 flex flex-col m-2 p-2  inset-0 ">
      <div class="grid grid-cols-2 gap-3">
        <!-- first row -->
        <SimpleCard label="How I feel today?" type="INPUT_ONLY" />

        <div class="flex flex-col items-center justify-center w-full">
          <SimpleCard label="Mood Slider" type="SLIDER" v-model="moodSlider" :disabled="false">
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
          </SimpleCard>
        </div>

        <!-- second row -->
        <SimpleCard
            v-model="song"
            type="INPUT_IMAGE"
            label="Song of the day"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1200px-Spotify_logo_without_text.svg.png"
            image-size="w-10 h-10"
        />
        <SimpleCard v-model="color" type="PICKER" label="Color of the day" />

        <!-- third row -->
        <SimpleCard v-model="quote" label="Quote of the day" type="SELECT" />
        <SimpleCard v-model="obsessiveThought" label="Obsessive thought" type="INPUT_ONLY" />

        <!-- fourth row -->
        <div class="col-span-2">
          <SimpleCard label="Activities" type="MULTI_SELECT" :activities="activities" v-model="selectedActivities" />
        </div>

        <!-- fifth row -->
        <SimpleCard v-model="goods" type="INPUT_ONLY" label="Goods of the day" />
        <SimpleCard v-model="bads" type="INPUT_ONLY" label="Bads of the day" />
      </div>

      <!-- sixth row -->
      <div class="grid grid-cols-3 gap-3 justify-between">
        <SimpleCard
            v-model="stress"
            :disabled="false"
            type="SLIDER"
            label="Stress Level"
            image="https://www.freeiconspng.com/uploads/stress-icons--noun-project-0.png"
            image-title="Stress level"
        />
        <SimpleCard
            v-model="anxiety"
            type="SLIDER"
            :disabled="false"
            label="Anxiety Level"
            image="https://cdn-icons-png.flaticon.com/512/6124/6124549.png"
            image-title="Anxiety Level"
        />
        <SimpleCard
            v-model="energy"
            type="SLIDER"
            label="Energy Level"
            :disabled="false"
            image="https://png.pngtree.com/element_our/png/20180823/energy-line-icon-png_65280.jpg"
            image-title="Energy Level"
        />
      </div>

      <button
          @click="submitData"
          type="button"
          class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Submit Journal
      </button>
    </main>
  </section>
</template>
