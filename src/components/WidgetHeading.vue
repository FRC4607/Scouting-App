<template>
  <p style="text-align: center">{{ data.name }}</p>
</template>

<script setup lang="ts">
import { WidgetData } from "@/common/types";

defineProps<{
  data: WidgetData,
  currentId: string
}>();
</script>
