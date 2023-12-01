<template lang="">
  <div class="content">
    <BaseKanban
      v-if="currentType == 1"
      :data="kanbanData"
      @reloadData="reloadKanbanData"
      @onOpenTaskEditForm="onOpenTaskEditForm"
    ></BaseKanban>
    <TaskGrid v-else :data="data"></TaskGrid>
    <router-view></router-view>
  </div>
</template>
<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { RouterName } from "@/commons/contants/router-name.js";
import { useRoute } from "vue-router";
import TaskGrid from "@/components/grid/TaskGrid.vue";
import BaseKanban from "@/components/base/BaseKanban.vue";
import { getTaskByProjectID } from "@/apis/task-service/task-service.js";
import { getKanbanByProjectID } from "@/apis/kanban-service/kanban-service";
import { responseStatus } from "@/commons/enums/api-response-status";
const emit = defineEmits();
const props = defineProps({
  reloadListProject: Boolean,
});
const route = useRoute();
const data = ref([]);
const kanbanData = ref([]);
onBeforeMount(() => {
  emit("onChangedView", RouterName.TheProject);
});
let currentType = ref(1);

watch(
  () => route.query,
  (newValue) => {
    if (newValue && newValue.Type) {
      currentType.value = newValue.Type;
    }
    if (newValue && newValue.ProjectID) {
      getTask(newValue.ProjectID);
      getKanban(newValue.ProjectID);
    }
  },
  { immediate: true }
);

watch(
  () => props.reloadListProject,
  () => {
    getKanban(route.query.ProjectID);
  }
);

function onOpenTaskEditForm(id) {
  emit("onOpenTaskEditForm", id);
}

function reloadKanbanData() {
  getKanban(route.query.ProjectID);
}

/**
 * Lấy Kanban theo id dự án
 * @param {*} id
 */
async function getKanban(id) {
  try {
    const res = await getKanbanByProjectID(id);
    if (res && res.status && res.status == responseStatus.Success && res.data) {
      kanbanData.value = res.data;
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Lấy công việc theo id dự án
 * @param {*} id
 */
async function getTask(id) {
  try {
    const res = await getTaskByProjectID(id);
    if (res && res.status && res.status == responseStatus.Success && res.data) {
      data.value = res.data;
    }
  } catch (error) {
    console.log(error);
  }
}
</script>
<style lang="scss">
.content {
  padding-top: 48px;
  height: calc(100vh);
  background: url("../../assets/images/dashboard03.jpg") no-repeat;
  background-size: cover;
}
</style>
