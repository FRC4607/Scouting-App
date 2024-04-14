<template>
    <div style="display: table;">
        <div style="display: table-cell;">
            <label :for="currentId+'1'"><p class="alliance-color">Station 1</p></label>
        </div>
        <div style="display: table-cell;">
            <input :id="currentId+'1'" type="number" class="alliance-color" min="1" max="32767" v-model="teamValues[0]" />
        </div>
        <div style="display: table-cell;">
            <select :id="currentId+'2'" v-model="teamResults[0]" class="alliance-color">
                <option :value="1">1st</option>
                <option :value="2">2nd</option>
                <option :value="3">3rd</option>
            </select>
        </div>
        <div style="display: table-cell;">
            <label :for="currentId+'3'"><p class="alliance-color">Incapacitated?</p></label>
        </div>
        <div style="display: table-cell;">
            <input :id="currentId+'3'" type="checkbox" class="alliance-color" v-model="incap[0]" />
        </div>
    </div>
    <div style="display: table;">
        <div style="display: table-cell;">
            <label :for="currentId+'4'"><p class="alliance-color">Station 2</p></label>
        </div>
        <div style="display: table-cell;">
            <input :id="currentId+'4'" type="number" class="alliance-color" min="1" max="32767" v-model="teamValues[1]" />
        </div>
        <div style="display: table-cell;">
            <select :id="currentId+'5'" v-model="teamResults[1]" class="alliance-color">
                <option :value="1">1st</option>
                <option :value="2">2nd</option>
                <option :value="3">3rd</option>
            </select>
        </div>
        <div style="display: table-cell;">
            <label :for="currentId+'6'"><p class="alliance-color">Incapacitated?</p></label>
        </div>
        <div style="display: table-cell;">
            <input :id="currentId+'6'" type="checkbox" class="alliance-color" v-model="incap[1]" />
        </div>
    </div>
    <div style="display: table;">
        <div style="display: table-cell;">
            <label :for="currentId+'7'"><p class="alliance-color">Station 3</p></label>
        </div>
        <div style="display: table-cell;">
            <input :id="currentId+'7'" type="number" class="alliance-color" min="1" max="32767" v-model="teamValues[2]" />
        </div>
        <div style="display: table-cell;">
            <select :id="currentId+'8'" v-model="teamResults[2]" class="alliance-color">
                <option :value="1">1st</option>
                <option :value="2">2nd</option>
                <option :value="3">3rd</option>
            </select>
        </div>
        <div style="display: table-cell;">
            <label :for="currentId+'8'"><p class="alliance-color">Incapacitated?</p></label>
        </div>
        <div style="display: table-cell;">
            <input :id="currentId+'8'" type="checkbox" class="alliance-color" v-model="incap[2]" />
        </div>
    </div>
</template>

<style>
.alliance-color {
    color: v-bind('data.alliance')
}
</style>

<script setup lang="ts">
import { useWidgetsStore } from "@/common/stores";
import { Widget, WidgetTeamRanking } from "@/config";

const props = defineProps<{
data: Widget & WidgetTeamRanking,
currentId: string
}>();

const teamValues = $ref([1, 1, 1]);
const teamResults = $ref([1, 2, 3]);
const incap = $ref([false, false, false]);
const rankings = $computed(() => {
    let result: (number | boolean)[][] = [];
    for (const [a, b] of [[0, 1], [0, 2], [1, 2]]) {
        const better = teamResults[a] <= teamResults[b] ? teamValues[a] : teamValues[b];
        const worse = teamResults[a] <= teamResults[b] ? teamValues[b] : teamValues[a];
        const level = Math.abs(teamResults[a] - teamResults[b]);
        const incapLocal = incap[a] || incap[b];
        result.push([better, worse, level, incapLocal])
    }
    return result;
});
defineExpose({ index: useWidgetsStore().addWidgetValue(props.data, $$(rankings)) });
</script>
