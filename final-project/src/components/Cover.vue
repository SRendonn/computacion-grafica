<template>
  <div id="cover">
    <h1>Welcome to the Computer Graphics Museum.</h1>
    <p>
      Here you will see the most important events that defined what computer
      graphics are today.
    </p>
    <button id="go-to-museum" type="button" @click="$emit('show-museum')">
      Continue
    </button>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
#cover {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
}

#go-to-museum {
  appearance: none;
  font-family: inherit;
  font-size: medium;
  padding: 0.75em 1.5em;
  color: white;
  background-color: blueviolet;
  border-radius: 0.5em;
  border: none;
  box-shadow: 0.1em;
  cursor: pointer;
  transition: all linear 0.15s;
}

#go-to-museum:hover {
  background-color: darkviolet;
}

#go-to-museum:focus {
  background-color: purple;
}
</style>
