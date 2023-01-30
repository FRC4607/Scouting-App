<template>
  <div id="selectGrid" :style="{ backgroundImage: `url(${imagePath}`, aspectRatio: aspectRatio, padding: offsets }">
    <div v-for="i in width * height" :key="i">
      <input type="checkbox" v-model="grid[i % 3][Math.floor(i / 3)]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWidgetsStore } from "@/common/stores";
import { WidgetData } from "@/common/types";

const props = defineProps<{
  data: WidgetData,
  currentId: string
}>();


let width = props.data.columns ?? 0;
let height = props.data.rows ?? 0;

let gridConstruct: boolean[][] = [];
for (let c = 0; c < width; c++) {
  let column: boolean[] = []
  column.length = height;
  column.fill(false);
  gridConstruct.push(column);
}

const grid = $ref(gridConstruct);

// The exported value
const value = $computed(() => exportData());
useWidgetsStore().addWidgetValue(props.data, $$(value));

function exportData() {
  let scored = 0;
  for (let column = 0; column < grid.length; column++) {
    for (let row = 0; row < grid[column].length; row++) {
      const cell = grid[column][row]
      if (cell) {
        scored |= Math.pow(2, (column * 9 + row));
      }
    }
  }
  return scored;
}

const imagePath = $computed(() => `${import.meta.env.BASE_URL}assets/${props.data.file}`);

function getImgSize(): Promise<{ width: number, height: number }> {
  return new Promise((resolve, reject) => {
    const newImg = new Image();

    newImg.onload = function () {
      const height = newImg.height;
      const width = newImg.width;
      resolve({ width, height });
    };

    newImg.src = imagePath; // this must be done AFTER setting onload
  });
}

const dimensions = await getImgSize();
const aspectRatio = dimensions.width / dimensions.height

const offsets = (props.data.topOffset ?? 0) * (200 / dimensions.height) + "px " + 
                (props.data.rightOffset ?? 0) * (200 / dimensions.width) + "px " +
                (props.data.bottomOffset ?? 0) * (200 / dimensions.height) + "px " + 
                (props.data.leftOffset ?? 0) * (200 / dimensions.width) + "px";

</script>

<style scoped>
#selectGrid {
  display: inline-grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-count: 3;
  background-color: #404040;
  background-repeat: no-repeat;
  background-size: cover;
  width: 200px;
  margin: 0 calc(50% - 100px);
}

#selectGrid div {
  align-self: center;
  text-align: center;
  color: black;
}

#selectGrid div input {
  width: 32px;
  height: 32px;
  accent-color: #1b8e2d;
}
</style>