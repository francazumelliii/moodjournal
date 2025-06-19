<template>
  <aside
      :class="[
      'bg-gray-800 text-white fixed top-0 left-0 h-full z-40 w-64 transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div class="p-4 pt-20">
      <h2 class="text-lg font-bold mb-4">Sidebar</h2>
      <nav class="flex-col items-between h-full">
        <ul>
          <li class="mb-2 hover:bg-gray-700 p-2 rounded cursor-pointer">
            <router-link to="/home">Dashboard</router-link>
          </li>
          <li class="mb-2 hover:bg-gray-700 p-2 rounded cursor-pointer">
            <router-link to="/calendar">Calendar</router-link>
          </li>
          <li class="mb-2 hover:bg-gray-700 p-2 rounded cursor-pointer">
            <p @click="showModal()">+ Journal</p>
          </li>
        </ul>
        <div class="mb-2 hover:bg-gray-700 p-2 rounded cursor-pointer absolute bottom-0">
          <p @click="logout()">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"/>
            </svg>
            <small>Logout</small>
          </p>
        </div>
      </nav>
    </div>
  </aside>

  <button
      @click="toggleSidebar"
      class="fixed top-4 left-4 z-50 p-3 bg-gray-800 text-white rounded focus:outline-none"
      aria-label="Toggle Sidebar"
  >
    ☰
  </button>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import router from "@/router/index.js";
import JournalModal from "@/components/modals/JournalModal.vue";
import ModalService from "@/services/ModalService.js";

const emit = defineEmits(['update:isOpen'])
const isOpen = ref(true)

function logout(){
  localStorage.clear()
  router.push('/')
}

function showModal() {
  ModalService.open(JournalModal, {
    onSubmit: async () => {
      console.log('Journal submitted, refreshing data...')
      router.push('/home')
    }
  })
}


function toggleSidebar() {
  isOpen.value = !isOpen.value
  emit('update:isOpen', isOpen.value)
}
</script>
