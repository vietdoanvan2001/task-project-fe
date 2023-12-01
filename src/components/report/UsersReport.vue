<template lang="">
  <div class="users-report-container">
    <DxChart id="chart" :data-source="dataSource" :width="'100%'">
      <DxCommonSeriesSettings argument-field="AssigneeName" type="stackedbar" />
      <DxValueAxis position="left">
        <DxTitle :text="t('TaskAmount')" />
      </DxValueAxis>
      <DxSeries value-field="DoneTask" :name="t('Done')" :bar-width="40" />
      <DxSeries
        value-field="UnDoneTask"
        :name="t('TaskDoing')"
        :bar-width="40"
      />
      <DxLegend
        vertical-alignment="bottom"
        horizontal-alignment="center"
        item-text-position="top"
      />
      <DxExport :enabled="false" />
      <DxTooltip
        :enabled="true"
        :customize-tooltip="customizeTooltip"
        location="edge"
      />
    </DxChart>
  </div>
</template>
<script setup>
import {
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxValueAxis,
  DxTitle,
  DxLegend,
  DxExport,
  DxTooltip,
} from "devextreme-vue/chart";
import { ref, onBeforeMount, watch } from "vue";
import Project from "@/commons/models/Project.js";
import { getProjectByID } from "@/apis/project-service/project-service.js";
import {
  getTaskByProjectID,
  GetUsersAmountTask,
} from "@/apis/task-service/task-service.js";
import { getAllUsers } from "@/apis/user-service/user-service.js";
import i18n from "@/plugins/i18n";
import { showToast } from "@/utils/toast-message/toastMessage";
import { responseStatus } from "@/commons/enums/api-response-status";
var { t } = i18n.global;

const dataSource = ref([]);
const taskAmount = ref();
const props = defineProps({
  reloadListProject: Boolean,
  selectedProject: Project,
});
const allUser = ref([]);

onBeforeMount(() => {
  getAllAsignee();
  if (props.selectedProject && props.selectedProject.ID) {
    getData();
    if (props.selectedProject?.ID != -1) {
      getProject(props.selectedProject?.ID);
    }
  }
});

watch(
  () => props.selectedProject,
  async () => {
    if (!props.selectedProject || !props.selectedProject.ID) {
      return;
    }
    await getData();

    if (props.selectedProject?.ID == -1) {
      getAllAsignee();
    } else {
      getProject(props.selectedProject?.ID);
    }
  },
  { immediate: true }
);

watch(
  () => props.reloadListProject,
  async () => {
    console.log(132);
    if (!props.selectedProject || !props.selectedProject.ID) {
      return;
    }
    await getData();

    if (props.selectedProject?.ID == -1) {
      getAllAsignee();
    } else {
      getProject(props.selectedProject?.ID);
    }
  },
  { immediate: true }
);

async function getAllAsignee() {
  try {
    const res = await getAllUsers();
    dataSource.value = [];
    if (res && res.status && res.status == responseStatus.Success && res.data) {
      allUser.value = res.data;
      res.data.forEach((element) => {
        taskAmount.value?.forEach((item) => {
          if (item.AssigneeID == element.id) {
            dataSource.value.push(item);
          } else {
            if (
              dataSource.value.findIndex(
                (temp) => temp.AssigneeID == element.id
              ) == -1
            ) {
              dataSource.value.push({
                AssigneeID: element.id,
                AssigneeName: element.fullName,
                DoneTask: 0,
                UnDoneTask: 0,
              });
            }
          }
        });
      });
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    showToast.error(t("Error"));
    console.log(error);
  }
}

/**
 * Lấy dự án theo id
 * @param {*} id
 */
async function getProject(id) {
  try {
    const res = await getProjectByID(id);
    if (res && res.status && res.status == responseStatus.Success && res.data) {
      dataSource.value = [];
      const listAssignee = JSON.parse(res.data.listAssignee);
      const listID = listAssignee.map((item) => item.ID);
      const listUser = allUser.value.filter((item) => listID.includes(item.id));
      listUser.forEach((element) => {
        taskAmount.value?.forEach((item) => {
          if (item.AssigneeID == element.id) {
            dataSource.value.push(item);
          } else {
            if (
              dataSource.value.findIndex(
                (temp) => temp.AssigneeID == element.id
              ) == -1
            ) {
              dataSource.value.push({
                AssigneeID: element.id,
                AssigneeName: element.fullName,
                DoneTask: 0,
                UnDoneTask: 0,
              });
            }
          }
        });
      });
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    showToast.error(t("Error"));
    console.log(error);
  }
}

/**
 * Lấy dự án theo id
 * @param {*} id
 */
async function getData() {
  try {
    const res = await GetUsersAmountTask(props.selectedProject.ID);
    if (res && res.status && res.status == responseStatus.Success && res.data) {
      taskAmount.value = res.data;
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    showToast.error(t("Error"));
    console.log(error);
  }
}

function customizeTooltip(pointInfo) {
  return {
    text: `${pointInfo.seriesName}: ${pointInfo.value} Công việc (${pointInfo.percentText}) `,
  };
}
</script>
<style lang="scss" scoped>
.users-report-container {
  display: flex;
  width: 100%;
  height: calc(100vh - 130px);
  padding: 48px;
}
</style>
