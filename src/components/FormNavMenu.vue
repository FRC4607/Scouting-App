<template>
  <nav>
    <div id="button-container">
      <button @click="switchPage(shown - 1)" :disabled="shown === 0">&#10096; Prev</button>
      <button @click="switchPage(shown + 1)" :disabled="shown === pages.length - 1">Next &#10095;</button>
    </div>
    <div v-for="[i, page] of pages.entries()" :key="i" :class="{ link: true, active: i === shown }"
      @click="switchPage(i)">
      {{ unref(page).title }}
    </div>
    <button id="home-button" @click="goHome">Home</button>
  </nav>
</template>

<script setup lang="ts">
import FormPage from "./FormPage.vue";
import { range } from "lodash";
import { unref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useValidationStore, useWidgetsStore } from "@/common/stores";

const props = defineProps<{
  pages: InstanceType<typeof FormPage>[]
}>();

const router = useRouter();
const validation = useValidationStore();
const widgets = useWidgetsStore();

let shown = $ref(0);
let target = $ref(0);

// If the index of the shown page changes, iterate through each page object and update their states
watchEffect(() => {
  for (const [i, page] of props.pages.entries()) unref(page).setShown(i === shown);
});

// If validation is successful, go to the target page
// Otherwise, go to the page with the widget(s) that failed validation
watchEffect(() => {
  if (validation.triggerPages.length == 0)
    shown = (validation.failedPage == -1) ? target : validation.failedPage;
});

function switchPage(n: number) {
  // Skip validation if going backward
  if (n < shown) {
    shown = n;
    return;
  }

  // Submit the range of pages from the current (inclusive) to the target (exclusive) for validation
  validation.triggerPages = range(shown, n);
  target = n;
}

function goHome() {
  // Check if user has started scouting (past first page or has entered data)
  const hasData = widgets.values.some(v => v.value !== "" && v.value !== false && v.value !== 0);
  if (shown > 0 || hasData) {
    if (!confirm("Are you sure you want to abandon the current scouting session? All unsaved data will be lost.")) {
      return;
    }
  }
  router.push({ name: "home" });
}
</script>

<style>
@media (pointer:none),
(pointer:coarse) {

  .link {
    font-size: 120%;
  }
}

nav {
  width: min(400px, 100%);
  background-color: #222;
}

button:disabled {
  opacity: 0.5;
  cursor: unset;
}

#button-container {
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.active {
  background-color: #424242;
}

.link {
  user-select: none;
  text-align: center;
  padding: 4px;
  transition: background-color 0.3s;
  cursor: pointer;
}

.link:not(.active):hover {
  background-color: #3d3d3d;
}

#home-button {
  width: 100%;
  margin-top: 16px;
  padding: 10px;
  background-color: #444;
  border: none;
  color: white;
  font-size: 100%;
  cursor: pointer;
  transition: background-color 0.3s;
}

#home-button:hover {
  background-color: #555;
}
</style>
