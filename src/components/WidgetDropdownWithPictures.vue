<template>
  <select :id="currentId" v-model="value">
    <option v-if="data.defaultOption" :value="-1" selected disabled>Select...</option>
    <option v-for="[i, value] of data.options.entries()" :value="i" :key="i">{{ value }}</option>
  </select>
  <img :src="showImg" />
</template>

<script setup lang="ts">
import { useWidgetsStore } from "@/common/stores";
import { Widget, WidgetDropdownWithPictures } from "@/config";

const props = defineProps<{
  data: Widget & WidgetDropdownWithPictures,
  currentId: string
}>();

const showImg = $computed(() => {return value > -1 && value < props.data.files.length ? `${import.meta.env.BASE_URL}assets/${props.data.files[value]}` : ''});

const value = $ref(props.data.defaultOption ? -1 : 0);
defineExpose({ index: useWidgetsStore().addWidgetValue(props.data, $$(value)) });
</script>
