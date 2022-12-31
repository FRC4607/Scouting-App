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
      <button @click="showCameraModal">Import from QR Codes</button>
      <button @click="uploadData">Upload Data</button>
      <button @click="clearData">Clear All</button>
    </template>
  </div>
  <Teleport to="body">
    <Modal :show="qrModal" @close="qrModal = false">
      <template #body>
        <p>Scan the following QR codes in order on the target device:</p>
        <div class="centered" v-for="index in qrStrings.length" :key="index">
            <qrcode-vue :value=qrStrings[index-1] :size=windowSize/3 :margin=2 />
            <p>QR Code {{ index }}/{{ qrStrings.length }}</p>
        </div>
        <!--
          <carousel ref="qrCarousel">
          <slide class="carousel__item" v-for="index in qrStrings" :key="index">
            <qrcode-vue :value=index :size=windowSize/3 :margin=2 />
          </slide>
          </carousel>
        -->
      </template>
      <template #footer>
        <p></p>
      </template>
    </Modal>
  </Teleport>
  <Teleport to="body">
    <Modal :show="cameraModal" @close="closeCameraModal()">
      <template #body>
        <p>Use the camera to scan the QR codes in order:</p>
        <div id="camera-container" class="centered">
          <qrcode-stream @decode="onDecode"/>
          <p class="centered" v-if="showQrCount">Scanning code {{ currentCode + 1 }}/{{ totalCodes }}</p>
          <p class="centered" v-if="showErrorMessage">Invalid QR Code scanned. Please try again.</p>
        </div>
      </template>
    </Modal>
  </Teleport>
  <div class="table-container">
    <span v-if="selectedEntry === undefined">No Data</span>
    <InspectorTable v-else v-model="selectedRecords" :data="selectedEntry" />
  </div>
  <a :hidden="true" :download="entries[selectedIdx]" ref="downloadLink"></a>
</template>

<script setup lang="ts">
import InspectorTable from "./InspectorTable.vue";
import { useWidgetsStore } from "@/common/stores.js";
import Modal from "./ModalComponent.vue";

import QrcodeVue from "qrcode.vue"
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

let decodedJSON = "";
let table = "";
let header = [""];

let showQrCount = $ref(false);
let showErrorMessage = $ref(false);
let currentCode = $ref(0);
let totalCodes = $ref(0);

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
  const blob = JSON.stringify(filterRecords(true));
  const qrSize = 512;
  let substr = 0;
  for (let i = 0; i < Math.floor(blob.length / qrSize); i++) {
    const element = blob.slice(substr, substr + qrSize);
    qrStrings.push(element);
    substr = substr + qrSize;
  }
  const element = blob.slice(substr);
  qrStrings.push(element);
  const header: QRData = {
    config: entries[selectedIdx],
    codes: qrStrings.length,
    header: selectedEntry.header
  };
  qrStrings = [JSON.stringify(header)].concat(qrStrings);
  qrModal = true;
}

function showCameraModal() {
  cameraModal = true;
}

function closeCameraModal() {
  cameraModal = false;
  showQrCount = false;
  showErrorMessage = false;
  currentCode = 0;
  totalCodes = 0;
  table = "";
  decodedJSON = "";
  header = [""];
}

function onDecode(s: string) {
  // If we haven't set up yet
  if (!showQrCount) {
    let data: QRData;
    try {
      data = JSON.parse(s);
    }
    catch {
      showErrorMessage = true;
      return;
    }
    if (data.codes === undefined) {
      showErrorMessage = true;
      return;
    }
    if (data.config === undefined) {
      showErrorMessage = true;
      return;
    }
    if (data.header === undefined) {
      showErrorMessage = true;
      return;
    }
    // Set data for the count text.
    currentCode = 0;
    totalCodes = data.codes;

    // Show the count text
    showQrCount = true;

    // Update table and header
    table = data.config;
    header = data.header;

    // Remove error message
    showErrorMessage = false;
  }
  // If we have
  else {
    decodedJSON += s;
    currentCode += 1;
    if (currentCode === totalCodes) {
      let data:string[][];
      try {
        data = JSON.parse(decodedJSON);
      }
      catch {
        // If something went wrong, reset.
        showErrorMessage = true;
        showQrCount = false;
        currentCode = 0;
        totalCodes = 0;
        table = "";
        decodedJSON = "";
        header = [""];
        return;
      }
      data.forEach(row => {
        widgets.save(header, row, table);
      });
      closeCameraModal();
      return;
    }
  }
}

function clearData() {
  if (!confirm("Clear all saved entries in local storage permanently?")) return;

  widgets.savedData.clear();
  selectedIdx = 0; // Reset selected index
}

function uploadData() {
  if (selectedEntry == undefined) return;

  // Generate the download link for the selected records, then trigger the download
  // If there are no records selected, they will all be included in the generated file
  widgets.uploadData({ header: selectedEntry.header, values: filterRecords(true) });
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
}

.centered {
  margin: 0 auto;
  text-align: center;
}

</style>
