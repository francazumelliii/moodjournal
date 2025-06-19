<script setup>
import JournalModal from "@/components/modals/JournalModal.vue"
import modalService from "@/services/ModalService.js"

function openModal() {
  const modal = modalService.open(JournalModal)
}

</script>

<template>
  <button
    @click="openModal"
    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
  >
    OPEN MODAL
  </button>

</template>
