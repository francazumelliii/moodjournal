<script setup>
const props = defineProps({
  customStyle: {
    type: String,
    default: 'bg-blue-200'
  },
  icon: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'w-10 h-10'
  },
  imgTitle: {
    type: String,
    default: 'title'
  }
})
</script>

<template>
  <div
      :class="props.customStyle, props.size"
      class="rounded-full flex items-center justify-center overflow-hidden"
  >
    <button>
    <i :class="icon" v-if="props.icon"></i>
      <img v-if="props.image" :src="props.image" :class="props.size" :alt="props.imgTitle"/>
    </button>
  </div>

</template>
