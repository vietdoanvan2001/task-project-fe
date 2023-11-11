<template lang="">
  <div class="table-container">
    <div class="table-header"></div>
    <div class="table-content">
      <BaseDataGrid :dataSource="listTask" :columns="TaskColumnDefault">
        <template v-slot:EndDateTemplate="{ data }">
          <div>{{ data.data.EndDate }}</div>
        </template>
      </BaseDataGrid>
    </div>
  </div>
</template>
<script setup>
import { onBeforeMount, ref, watch } from "vue";
import BaseDataGrid from "@/components/base/BaseDataGrid.vue";
import { TaskColumnDefault } from "@/commons/contants/task-column-default.js";
import i18n from "@/plugins/i18n";
var { t } = i18n.global;
const props = defineProps({
  data: Array,
});
const emit = defineEmits();
const listTask = ref([]);
onBeforeMount(() => {
  if (props.data && props.data.length) {
    props.data.forEach((element) => {
      if (element.Tasks && element.Tasks.length) {
        element.Tasks.forEach((item) => {
          listTask.value.push(item);
        });
      }
    });
  }
  console.log(listTask.value);
});
</script>
<style lang="scss" scoped>
.table-container {
  margin: 16px;
  background-color: var(--app-color-white);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  padding-top: 6px;
  height: calc(100vh - 90px);
  width: calc(100vw - 96px);
  .table-header {
    height: 48px;
    padding: 8px;
    border-radius: 8px 8px 0 0;
  }
}
</style>
