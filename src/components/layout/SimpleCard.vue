<script setup>
import { ColorPicker } from "vue3-colorpicker";
import Multiselect from "vue-multiselect";
import { ref, watch } from "vue";

const props = defineProps({
  label: String,
  placeholder: { type: String, default: "Enter text here" },
  type: { type: String, default: "INPUT_ONLY" },
  image: { type: String, default: "" },
  imageSize: { type: String, default: "w-10 h-10" },
  activities: { type: Array, default: () => [] },
  modelValue: [String, Number, Array, Object],
  disabled:{ type: Boolean, default: false },
  showValue: { type: Boolean, default: true },
  class: { type: String, default: '' },
});

const emit = defineEmits(["update:modelValue"]);

const textInput = ref("");
const dateInput = ref("");
const sliderValue = ref(50);
const selectValue = ref("");
const pureColor = ref("#000000");
const gradientColor = ref("");
const multiValue = ref([]);
const descriptions = ref({});

// Sincronizza il valore ricevuto dal genitore
watch(() => props.modelValue, (val) => {
  switch(props.type) {
    case "INPUT_ONLY":
    case "INPUT_IMAGE":
      textInput.value = val ?? "";
      break;
    case "SLIDER":
      sliderValue.value = typeof val === "number" ? val : 50;
      break;
    case "DATE":
      dateInput.value = val ?? "";
      break;
    case "SELECT":
      selectValue.value = val ?? "";
      break;
    case "PICKER":
      pureColor.value = typeof val === "string" ? val : "#000000";
      break;
    case "MULTI_SELECT":
      multiValue.value = val?.selected || [];
      descriptions.value = val?.descriptions || {};
      break;
  }
}, { immediate: true });

// Emissione valori quando cambiano
watch(textInput, val => {
  if(props.type === "INPUT_ONLY" || props.type === "INPUT_IMAGE") {
    emit("update:modelValue", val);
  }
});
watch(dateInput, (val) => {
  if(props.type === "DATE") {
    emit("update:modelValue", val);
  }
}, { immediate: true });

watch(sliderValue, val => {
  if(props.type === "SLIDER") {
    emit("update:modelValue", val);
  }
});

watch(selectValue, val => {
  if(props.type === "SELECT") {
    emit("update:modelValue", val);
  }
});

watch(pureColor, val => {
  if(props.type === "PICKER") {
    emit("update:modelValue", val);
  }
});

watch([multiValue, descriptions], () => {
  if(props.type === "MULTI_SELECT") {
    emit("update:modelValue", {
      selected: multiValue.value,
      descriptions: descriptions.value
    });
  }
}, { deep: true });
</script>

<template>
  <!-- INPUT -->
  <div v-if="type === 'INPUT_ONLY' || type === 'INPUT_IMAGE'" class="flex items-center bg-gray-800 rounded-lg p-2">
    <div class="w-full flex flex-row items-center space-x-4">
      <div v-if="image" class="flex-shrink-0">
        <img :src="image" :class="imageSize" alt="image" />
      </div>
      <div class="flex-grow">
        <label v-if="label" class="block mb-2 text-sm font-medium text-white">{{ label }}</label>
        <input
            v-model="textInput"
            type="text"
            :placeholder="placeholder"
            class="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  </div>

  <!-- INPUT -->
  <div v-if="type === 'DATE'" class="flex items-center bg-gray-800 rounded-lg p-2">
    <div class="w-full flex flex-row items-center space-x-4">

      <div class="flex-grow">
        <label v-if="label" class="block mb-2 text-sm font-medium text-white">{{ label }}</label>
        <input
            v-model="dateInput"
            type="date"
            :placeholder="placeholder"
            :class="[{'bg-gray-700 border border-gray-600': !props.disabled}, {'bg-gray-800 border border-gray-800': props.disabled}]"
            class="w-full p-2.5 rounded-lg  text-white text-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  </div>


 <!-- SLIDER -->
 <div v-if="type === 'SLIDER'" class="flex flex-col bg-gray-800 rounded-lg p-4 space-y-4" :class="props.class">
   <label class="text-sm font-medium text-white">{{ label }}</label>
   <div class="flex items-center space-x-4">
     <img v-if="image" :src="image" :class="imageSize" alt="img" />
     <input
       :disabled="props.disabled"
       type="range"
       min="0"
       max="100"
       v-model.number="sliderValue"
       class="w-full h-2 rounded-lg bg-gray-200 dark:bg-gray-700 cursor-pointer"
     />
     <span v-if="props.showValue" class="text-white w-10 text-right">{{ sliderValue }}</span>
   </div>
   <div class="flex justify-center items-start">
     <slot />
   </div>
 </div>

  <!-- COLOR PICKER -->
  <div v-if="type === 'PICKER'" class="flex flex-col  rounded-lg p-4 space-y-4" :class="props.class">
    <label class="text-sm font-medium text-white">{{ label }}</label>
    <div class="flex items-center justify-start gap-x-3 w-full">
      <ColorPicker v-model:pureColor="pureColor" v-model:gradientColor="gradientColor" />
      <span :class="[{'hidden': !props.showValue}]" :style="{color: pureColor}" class=" ml-4 ">{{ pureColor }}</span>
    </div>
    <slot />
  </div>

  <!-- SELECT -->
  <div v-if="type === 'SELECT'" class="flex flex-col bg-gray-800 rounded-lg p-4 space-y-4">
    <label class="text-sm font-medium text-white">{{ label }}</label>
    <select
        v-model="selectValue"
        class="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:ring-blue-500 focus:border-blue-500"
    >
      <option disabled value="">Choose a quote</option>
      <option value="quote1">Life is beautiful</option>
      <option value="quote2">Stay positive</option>
      <option value="quote3">Keep going</option>
    </select>
    <slot />
  </div>

  <!-- MULTI SELECT -->
  <div v-if="type === 'MULTI_SELECT'" class="flex flex-col bg-gray-800 rounded-lg p-4 space-y-4">
    <label class="text-sm font-medium text-white">{{ label }}</label>
    <Multiselect
        v-model="multiValue"
        :options="activities"
        :multiple="true"
        label="name"
        track-by="id"
        placeholder="Select activities"
    />
    <div v-for="item in multiValue" :key="item.id" class="mt-2">
      <label class="text-sm text-white">{{ item.name }}</label>
      <input
          v-model="descriptions[item.id]"
          type="text"
          class="mt-1 p-2 w-full rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Short description"
      />
    </div>
    <slot />
  </div>
</template>

<style scoped>

:deep(.vc-color-wrap) {
  width: 8rem !important;
  height: 2.5rem !important;
  margin-bottom: .5rem !important;
}
/* Puoi aggiungere eventuali stili personalizzati qui */
</style>
