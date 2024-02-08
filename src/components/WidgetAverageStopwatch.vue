<template>
  <div class="stopwatch-controls-container">
    <span>{{ trunc(time) }}</span>
    <button @click="start">{{ data.startLabel ?? "Start" }}</button>
    <button @click="stop">{{ data.stopLabel ?? "Stop" }}</button>
    <button @click="undo">{{ data.undoLabel ?? "Undo" }}</button>
  </div>
  <span>Average: {{ averageTime }}</span>
</template>

<script setup lang="ts">
import { useWidgetsStore } from "@/common/stores";
import { Widget, WidgetAverageStopwatch } from "@/config";

const props = defineProps<{
  data: Widget & WidgetAverageStopwatch,
  currentId: string
}>();

let time = $ref(0);
let startTime = 0;
let updateHandle: number | null = null; // The variable used to stop the timer counting
const times = $ref(new Array<number>());

const averageTime = $computed(() => times.length > 0 ? trunc(times.reduce((prev, current) => prev + current) / times.length) : "0.000")
// The exported value - reverse laps, then add the total elapsed time
defineExpose({ index: useWidgetsStore().addWidgetValue(props.data, $$(averageTime)) });

// Truncates a floating-point number for display.
const trunc = (n: number) => n.toFixed(3);

function start() {
  // Start timer counting (explicit `window` reference used to avoid conflicts with Node.js functions)
  if (updateHandle === null) {
    startTime = Date.now();
    updateHandle = window.setInterval(() => time = (Date.now() - startTime) / 1000, 1);
  }
}

function stop() {
  // Stop timer counting
  if (updateHandle !== null) {
    window.clearInterval(updateHandle);
    times.push((Date.now() - startTime) / 1000);
    time = 0;
    updateHandle = null;
  }
}

function undo() {
  times.pop(); // Remove last item
}
</script>

<style>
.stopwatch-controls-container>button {
  margin: 4px;
}

.lap-table-container {
  overflow-y: auto;
  width: max-content;
  max-height: 200px;
  padding: 2px;
}
</style>
