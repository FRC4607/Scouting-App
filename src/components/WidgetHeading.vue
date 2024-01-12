<template>
  <p style="text-align: center">{{ data.name }}</p>
</template>

<script setup lang="ts">
import { Widget, WidgetHeading } from "@/config";

defineProps<{
  data: Widget & WidgetHeading,
  currentId: string
}>();
</script>
