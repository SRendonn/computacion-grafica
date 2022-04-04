<script setup lang="ts">
import Cover from '@/components/Cover.vue';
import { ref } from 'vue';
import Museum from './components/Museum.vue';

const showMuseum = ref(false);
</script>

<template>
  <main>
    <Transition name="cover">
      <Cover v-if="!showMuseum" @show-museum="showMuseum = true" />
      <Museum v-else />
    </Transition>
  </main>
</template>

<style>
* {
  box-sizing: border-box;
}

html,
body,
#app,
main {
  font-family: 'Dosis', sans-serif;
  margin: 0;
  width: 100%;
  height: 100%;
}

.cover-enter-active,
.cover-leave-active {
  transition: opacity 0.5s ease;
}

.cover-enter-from,
.cover-leave-to {
  opacity: 0;
  position: fixed;
  inset: 0;
}
</style>
