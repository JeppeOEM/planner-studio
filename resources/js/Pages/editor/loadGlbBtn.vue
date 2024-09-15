<template>
    <button @click="handleClick" class="btn">
      <slot>Click Me</slot>
    </button>
  </template>
  
  <script setup>
  import { defineEmits } from 'vue';
  
  const emit = defineEmits(['click']);
  
  const handleClick = () => {
    emit('click');
  };
  </script>
 
