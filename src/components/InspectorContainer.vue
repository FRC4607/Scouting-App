<!--
Copyright (c) 2019 vuejs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Portions from https://vuejs.org/examples/#modal
-->

<template>
  <div id="controls-container">
    <RouterLink :to="{ name: 'home' }" style="margin-right: 40px;">Home</RouterLink>
    <span v-if="widgets.savedData.size === 0">&lt;No Entries&gt;</span>
    <template v-else>
      <label for="entry-select">Entry</label>
      <select id="entry-select" v-model.number="selectedIdx">
        <option v-for="[i, name] of entries.entries()" :key="i" :value="i">{{ name }}</option>
      </select>
      <button @click="deleteData">Delete</button>
      <button @click="downloadData">Download</button>
      <button @click="showQRExportModal">Show QR Codes</button>
      <button @click="clearData">Clear All</button>
    </template>
  </div>
  <Teleport to="body">
    <Modal :show="qrModal" @close="qrModal = false">
      <template #body>
        <p>Scan the following QR codes in order on the target device:</p>
        <carousel ref="qrCarousel">
          <slide class="carousel__item" v-for="index in qrStrings" :key="index">
            <qrcode-vue :value=index :size=windowSize/3 :margin=2 />
          </slide>
        </carousel>
      </template>
      <template #footer>
        <button @click="updateQrModalWidth()">Fix Slides</button>
      </template>
    </Modal>
  </Teleport>
  <Teleport to="body">
    <Modal :show="cameraModal" @close="cameraModal = false">
      <template #body>
        <p>Use the camera to scan the QR codes in order:</p>
        <div id="camera-container">
          <qrcode-stream @decode="onDecode"/>
        </div>
      </template>
    </Modal>
  </Teleport>
  <div class="table-container">
    <span v-if="selectedEntry === undefined">No Data</span>
    <InspectorTable v-else v-model="selectedRecords" :data="selectedEntry" />
    <button @click="showCameraModal()">Import from QR Codes</button>
  </div>
  <a :hidden="true" :download="entries[selectedIdx]" ref="downloadLink"></a>
</template>

<script setup lang="ts">
import InspectorTable from "./InspectorTable.vue";
import { useWidgetsStore } from "@/common/stores.js";
import Modal from "./Modal.vue";

import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide } from 'vue3-carousel';

import QrcodeVue from 'qrcode.vue'
import { QRData } from "@/common/types";

import { QrcodeStream } from "vue-qrcode-reader"


const windowSize = window.innerWidth
const widgets = useWidgetsStore();
let selectedIdx = $ref(0); // The index of the entry selected in the combobox

const downloadLink = $ref<HTMLAnchorElement>();
const selectedRecords = $ref(new Set<number>());
const hasSelectedRecords = $computed(() => selectedRecords.size > 0);

let qrModal = $ref(false);
let cameraModal = $ref(false);
let qrStrings = $ref([""]);
const qrCarousel = $ref<typeof Carousel>();

const entries = $computed(() => [...widgets.savedData.keys()]); // The entries in local storage
const selectedEntry = $computed(() => widgets.savedData.get(entries[selectedIdx])); // The selected entry

// Filters records in the selected entry based on the user selection.
// If there are no records selected, the filter directly uses the given state, returning either all or no records.
const filterRecords = (state: boolean) => (selectedEntry === undefined)
  ? []
  : selectedEntry.values.filter((_v, i) => hasSelectedRecords ? (selectedRecords.has(i) === state) : state);

function deleteData() {
  if (selectedEntry === undefined) return;

  if (!confirm(`Delete ${hasSelectedRecords ? "the selected" : "all"} records in this entry permanently?`)) return;

  // Discard out the selected records
  // If there are none selected, they are all deleted
  selectedEntry.values = filterRecords(false);

  selectedRecords.clear();
}

function downloadData() {
  if (selectedEntry == undefined) return;

  // Generate the download link for the selected records, then trigger the download
  // If there are no records selected, they will all be included in the generated file
  downloadLink.href = widgets.makeDownloadLink({ header: selectedEntry.header, values: filterRecords(true) });
  downloadLink.click();
}

function showQRExportModal() {
  if (selectedEntry == undefined) return;
  qrStrings = [];
  let blob = JSON.stringify(filterRecords(true));
  const qrSize = 512;
  let substr = 0;
  for (substr; substr < Math.floor(blob.length / qrSize); substr += qrSize) {
    const element = blob.slice(substr, substr + qrSize);
    qrStrings.push(element);
  }
  const element = blob.slice(substr);
  qrStrings.push(element);
  let header: QRData = {
    config: entries[selectedIdx],
    codes: qrStrings.length
  };
  qrStrings = [JSON.stringify(header)].concat(qrStrings);
  qrModal = true;
  // Update slides after 100ms ( magic number :( ))
  new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
    // updateQrModalWidth();
  });
}

function showCameraModal() {
  cameraModal = true;
}

function updateQrModalWidth() {
  qrCarousel?.updateSlideWidth();
}

function onDecode(s: string) {
  console.log(s);
}

function clearData() {
  if (!confirm("Clear all saved entries in local storage permanently?")) return;

  widgets.savedData.clear();
  selectedIdx = 0; // Reset selected index
}
</script>

<style>

.table-container {
  overflow: auto;
}

#controls-container>* {
  margin: 4px;
}

#camera-container {
  width: 50%;
  margin: 0 auto;
}

</style>
