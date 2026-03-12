<template>
  <FormPage title="Download Data" ref="page">
    <FormGroup :label-type="LabelType.None" :colspan="2" align="center">
      <button @click="clearForm">Save and Clear Form</button>
    </FormGroup>
    <FormGroup :label-type="LabelType.None">
      <div style="height: 20px;"></div>
    </FormGroup>
    <FormGroup :label-type="LabelType.None" :colspan="2" align="center">
      <span v-if="widgets.downloadLink === null">No Saved Data</span>
      <a v-else :download="`scouted-${config.name}.csv`" :href="widgets.downloadLink">Download Saved CSV</a>
    </FormGroup>
    <FormGroup :label-type="LabelType.None" :colspan="2" align="center">
      <RouterLink :to="{ name: 'inspector' }">Data Inspector</RouterLink>
    </FormGroup>
    <FormGroup :label-type="LabelType.None" :colspan="2" align="center">
      <RouterLink :to="{ name: 'home' }">Home</RouterLink>
    </FormGroup>
  </FormPage>
</template>

<script setup lang="ts">
import FormPage from "./FormPage.vue";
import FormGroup from "./FormGroup.vue";
import { LabelType } from "@/common/shared";
import { computed } from "vue";
import { useConfigStore, useWidgetsStore } from "@/common/stores";
import { useRouter } from "vue-router";

const config = useConfigStore();
const widgets = useWidgetsStore();

const router = useRouter();

const page = $ref<InstanceType<typeof FormPage>>();

async function clearForm() {
  // Save current form data to localStorage
  widgets.save();

  // Get the saved data bucket for this config
  const data = widgets.savedData.get(config.name);

  if (data && data.values.length > 0) {
    const lastRow = data.values[data.values.length - 1];
    const uploadPayload = {
      title: data.title,
      header: data.header,
      values: [lastRow]
    };

    try {
      // Attempt to upload only the newly saved row immediately
      await widgets.uploadData(uploadPayload);

      // On success, remove only the uploaded row and keep any older unsent rows
      data.values.pop();
      if (data.values.length === 0) {
        widgets.savedData.delete(config.name);
      }

      console.log("Data uploaded successfully and cleared from local storage");
    } catch (error) {
      // If upload fails, keep the data in localStorage for later
      console.log("Upload failed, data retained locally:", error);
    }
  }

  // Reload the page to show fresh form
  location.reload();
}

defineExpose({ title: computed(() => page?.title), setShown: computed(() => page?.setShown) });
</script>

<style lang="postcss">
#qr-dialog-contents {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;

  button {
    align-self: flex-end;
  }

  label {
    color: black;
  }
}
</style>
