<template>
  <h1>C.I.S Scouting</h1>
  <RouterLink :to="{ name: 'home' }"><img :src="logoPath" /></RouterLink>
  <h2>Form Selection</h2>
  <ul v-if="list.length > 0" class="link-list">
    <li v-for="[i, name] of list.entries()" :key="i">
      <RouterLink :to="{ name: 'form', query: { name } }">{{
        name.split(' ').map((s) => s.charAt(0).toUpperCase() +
          s.substring(1)).join(' ')
      }}</RouterLink>
    </li>
  </ul>
  <p v-else>No configurations specified.</p>
  <h2>Tools</h2>
  <ul class="link-list">
    <li>
      <RouterLink :to="{ name: 'inspector' }">Data Inspector</RouterLink>
    </li>
  </ul>
  <p style="margin-top: 50px">Version: {{ version }}</p>
</template>

<script setup lang="ts">
// Logo
const logoPath = import.meta.env.BASE_URL + 'assets/logo.png';
import { FetchError } from "@/common/shared";

const version = APP_VERSION;

// Fetch configurations list
const fetchResult = await fetch(`${import.meta.env.BASE_URL}assets/configurations.txt`);
console.log(`${import.meta.env.BASE_URL}assets/configurations.txt`);

if (!fetchResult.ok) throw new FetchError("Configuration list", fetchResult);

// Get text data, then convert to array
const textData = await fetchResult.text();
const list = $ref(textData.split("\n").map(value => value.trim()).filter(value => value.length > 0));
console.log(list)
</script>

<style lang="postcss">
.link-list {
  margin: 0;

  li {
    margin: 6px 0;
    list-style: none;
  }
}

img {
  margin: auto;
  max-width: 300px; /* Limit the logo size to 300px wide */
  width: 100%; /* Ensure responsiveness */
}
</style>
