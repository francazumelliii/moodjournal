<!-- components/modals/ToastNotification.vue -->
<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: 'Fire Icon'
  },
  description: {
    type: String,
    default: 'Set yourself free.'
  }
})
</script>

<template>
  <div
      id="toast-default"
      class="fixed top-5 left-5 z-50 flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-md dark:text-gray-400 dark:bg-gray-800"
      role="alert"
  >
    <div class="inline-flex items-center justify-center shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"/>
      </svg>
      <span class="sr-only">{{ props.icon }}</span>
    </div>
    <div class="ms-3 text-sm font-normal">{{ props.description }}</div>
    <button type="button" class="ms-auto bg-transparent text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 dark:text-gray-500 dark:hover:text-white" @click="$emit('close')">
      <span class="sr-only">Close</span>
      <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"/>
      </svg>
    </button>
  </div>
</template>
