<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'
import ModalHost from '@/components/modals/ModalHost.vue'

const isSidebarOpen = ref(true)
const route = useRoute()

// Mostra sidebar solo se la rotta NON è la login
const showSidebar = computed(() => route.path !== '/')

function updateSidebarState(value) {
  isSidebarOpen.value = value
}
</script>

<template>
  <div class="app-layout flex">
    <!-- Mostro sidebar solo se showSidebar è true -->
    <Sidebar v-if="showSidebar" v-model:isOpen="isSidebarOpen" />

    <main
        :class="[
        'transition-all duration-300 p-6 bg-gray-900 min-h-screen w-full h-[100vh] overflow-scroll',
        showSidebar && isSidebarOpen ? 'ml-64' : 'ml-0'
      ]"
    >
      <router-view />
    </main>

    <ModalHost />
  </div>
</template>

<style scoped>
.app-layout {
  height: 100vh;
}
</style>
