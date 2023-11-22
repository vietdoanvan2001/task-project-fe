<template lang="">
  <div class="table-container">
    <div class="table-header"></div>
    <div class="table-content">
      <BaseDataGrid :dataSource="listTask" :columns="TaskColumnDefault">
        <template v-slot:StartDateTemplate="{ data }">
          <div>{{ formatDate(data.data.StartDate) }}</div>
        </template>
        <template v-slot:EndDateTemplate="{ data }">
          <div>{{ formatDate(data.data.EndDate) }}</div>
        </template>
        <template v-slot:ProcessTemplate="{ data }">
          <div v-if="data.data.Process == 0">{{ t("TaskDoing") }}</div>
          <div v-else-if="data.data.Process < 100">
            {{ t("Done") }} {{ data.data.Process }}%
          </div>
          <div v-else>{{ t("DoneJob") }}</div>
        </template>
      </BaseDataGrid>
    </div>
  </div>
</template>
<script setup>
import { onBeforeMount, ref, watch } from "vue";
import BaseDataGrid from "@/components/base/BaseDataGrid.vue";
import { TaskColumnDefault } from "@/commons/contants/task-column-default.js";
import { formatDate } from "@/utils/functions/commonFns";
import i18n from "@/plugins/i18n";
var { t } = i18n.global;
const props = defineProps({
  data: Array,
});
const emit = defineEmits();
const listTask = ref([]);
onBeforeMount(() => {});

watch(
  () => props.data,
  () => {
    if (props.data && props.data.length) {
      listTask.value = [...props.data];
    }
    console.log(listTask.value);
  }
);
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
