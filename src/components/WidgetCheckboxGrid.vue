<template>
  <div id="selectGrid" :style="{ backgroundImage: `url(${imagePath}`, aspectRatio: aspectRatio, padding: offsets }">
    <div v-for="i in width * height" :key="i">
      <input type="checkbox" v-model="grid[(i - 1) % width][Math.floor((i - 1) / width)]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWidgetsStore, WidgetValue } from "@/common/stores";
import type { WidgetCheckboxGrid, Widget } from "../config.d.ts";
import { computed } from "@vue/runtime-core";

const props = defineProps<{
  data: WidgetCheckboxGrid,
  currentId: string
}>();


let width = props.data.width ?? 0;
let height = props.data.height ?? 0;

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
useWidgetsStore().addWidgetValue(props.data as Widget, $$(value));


const instanceWidgetStores: Array<WidgetValue> = useWidgetsStore().values;
const stationColor = computed(() => { return instanceWidgetStores.find((widget: WidgetValue) => widget.name === "team_station")?.value.toString().match(/(BLUE)|(RED)/)?.[0] ?? "BLUE"; })

console.log(stationColor);

function exportData() {
  let scored = 0;
  for (let column = 0; column < grid.length; column++) {
    // console.log(column);
    for (let row = 0; row < grid[column].length; row++) {
      const cell = grid[stationColor.value == "BLUE" ? column : (grid.length - column - 1)][row]
      if (cell) {
        scored |= Math.pow(2, (column * 9 + row));
      }
    }
  }
  console.log(scored)
  return scored;
}

const imagePath = $computed(() => `${import.meta.env.BASE_URL}assets/${stationColor.value}-${props.data.file}`);

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

const offsets = computed(() => {
  return (props.data.topOffset ?? 0) * (200 / dimensions.height) + "px " +
    ((stationColor.value == "RED" ? props.data.leftOffset : props.data.rightOffset) ?? 0) * (200 / dimensions.width) + "px " +
    (props.data.bottomOffset ?? 0) * (200 / dimensions.height) + "px " +
    ((stationColor.value == "RED" ? props.data.rightOffset : props.data.leftOffset) ?? 0) * (200 / dimensions.width) + "px"
});

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