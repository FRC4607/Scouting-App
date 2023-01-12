<template>
  <ErrorList :errors="errors" />
  <RouterView />
</template>

<script setup lang="ts">
import ErrorList from "@/components/ErrorList.vue";
import { onErrorCaptured } from "vue";

const errors = $ref(new Array<string>());

// Set handler to capture errors and push them to an array
onErrorCaptured(e => {
  errors.push(`${e.name}: ${e.message}`);
  return false;
});
</script>

<style>

@font-face {
  font-family: Toxigenesis;
  src: url("/public/assets/fonts/toxigenesis.ttf");
}

:root {
  --text-color: #ddd;
  --bg-color: #292929;
  --button-color: #3e3e3e;
  --input-color: #1c1c1c;
}

* {
  color: var(--text-color);
  box-sizing: border-box;
}

img {
  display: block;
  user-select: none;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  background-color: var(--bg-color);
  margin: 0;
}

button {
  background-color: var(--button-color);
  user-select: none;
  cursor: pointer;
  min-width: 40px;
  touch-action: manipulation;
  -ms-touch-action: manipulation;
}

input+button {
  border-radius: 0 15px 15px 0;
}
.widget button:first-child:nth-last-of-type(2) {
  border-radius: 15px 0 0 15px;
}

input, select, textarea {
  background-color: var(--input-color);
}

button, input, select, textarea {
  font-size: 100%;
  border: none;
  padding: 10px;
}

table {
  border-collapse: collapse;
}

td, th {
  border: 1px solid var(--text-color);
  padding: 2px;
}

h1, h2 {
  font-family: Toxigenesis;
}

h1 {
  font-size: 45px;
}

h2 {
  font-size: 30px;
}

.widget, .label, nav, input, td, th, button, select, a {
  font-size: 20px
}

input, button, select {
  font-family: inherit;
}

</style>
