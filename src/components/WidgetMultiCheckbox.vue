<template>
  <div class="checkbox-container">
    <label v-for="[i, name] of data.options.entries()" :key="i">
      <input type="checkbox" v-model="value" :value="i" />{{ name }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { useWidgetsStore } from "@/common/stores";
import { Widget, WidgetMultiCheckbox } from "@/config";

const props = defineProps<{
  data: Widget & WidgetMultiCheckbox,
  currentId: string
}>();

const value = $ref([]);
defineExpose({ index: useWidgetsStore().addWidgetValue(props.data, $$(value)) });
</script>

<style scoped>
.checkbox-container {
  display: flex;
  flex-direction: column;
}

input[type="checkbox"] {
  width: 24px;
  height: 24px;
  cursor: pointer;
  vertical-align: middle;
  margin-right: 8px;
}

label {
  display: flex;
  align-items: center;
  margin: 8px 0;
}
</style>
