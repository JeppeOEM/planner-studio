<template>
  <div class="z-10">
    <transition name="slide">
      <div v-if="isOpen" class="fixed top-0 right-0 h-full w-[500px] bg-gray-100 shadow-lg">
        <div class="p-4">
          <h2 class="text-xl font-bold">Side Panel</h2>

          <button @click="$emit('toggle')" class="mt-4 p-2 bg-red-500 text-white rounded">
            Close Panel
          </button>
        </div>
        <!-- <div v-for="component in components" :key="component.id" class="bg-white p-4 rounded shadow">
                <h2 class="text-xl font-bold">{{ component.filename }}</h2>
                <p class="text-gray-600">{{ component.category }}</p>
                <a :href="component.url" class="text-blue-500">View Component</a>
            </div> -->

      </div>
    </transition>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isOpen: Boolean
});


</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}
</style>