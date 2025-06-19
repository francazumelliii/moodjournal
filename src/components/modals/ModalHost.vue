<!-- components/ModalHost.vue -->
<script setup>
import ModalService from "@/services/ModalService.js"
import { computed } from "vue"

const modalState = ModalService.modalState

// Identifica se il componente da mostrare è un toast
const isToast = computed(() => {
  const name = modalState.component?.name?.toLowerCase() || ''
  return name.includes('toast')
})
</script>

<template>
  <!-- Se è un toast, non usare overlay, mostra solo il toast -->
  <component
      v-if="modalState.isOpen && isToast"
      :is="modalState.component"
      v-bind="modalState.props"
      @close="ModalService.close"
  />

  <!-- Altrimenti, modale centrato -->
  <div
      v-else-if="modalState.isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.7)] backdrop-blur-sm"
      @click.self="ModalService.close"
  >
    <div
        class="relative w-full max-w-4xl mx-4 sm:mx-auto dark:bg-gray-700 rounded-2xl shadow-xl overflow-y-auto"
        style="max-height: 90vh;"
    >
      <!-- Pulsante di chiusura -->
      <button
          @click="ModalService.close"
          class="absolute top-3 right-3 z-10 text-gray-400 hover:text-gray-600"
          aria-label="Close modal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
             viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Contenuto dinamico -->
      <div class="p-6 sm:p-8 pt-12 pr-12 overflow-scroll">
        <component
            :is="modalState.component"
            v-bind="modalState.props"
            @close="ModalService.close"
        />
      </div>
    </div>
  </div>
</template>
