<template>
    <button @click="handleClick" class="btn">
      <slot>Click Me</slot>
    </button>
  </template>
  
  <script setup>
  
  const emit = defineEmits(['click']);
  
  const handleClick = () => {
    emit('click');
  };
  </script>
 
