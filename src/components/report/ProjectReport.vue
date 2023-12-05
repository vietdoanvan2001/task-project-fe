<template>
  <div class="project-report-container">
    <div class="chart-wrap">
      <DxPieChart
        id="pie"
        :data-source="populationByRegions"
        :inner-radius="0.7"
        type="doughnut"
        :palette="customColors"
        diameter="0.8"
        :width="600"
        :height="250"
        startAngle="90"
        center-template="centerTemplate"
      >
        <DxSeries argument-field="region">
          <!-- <DxLabel :visible="true" :customize-text="customizeText">
            <DxConnector :visible="true" />
          </DxLabel> -->
        </DxSeries>
        <DxExport :enabled="false" />
        <DxLegend
          :margin="40"
          horizontal-alignment="right"
          vertical-alignment="top"
        />
        <DxTooltip :enabled="true" :customize-tooltip="customizeText">
        </DxTooltip>
        <template #centerTemplate="data">
          <svg>
            <text
              :style="{ fontSize: 20, fill: '#494949', fontWeight: 700 }"
              text-anchor="middle"
              x="100"
              y="80"
            >
              {{ allTask ? allTask.length : 0 }}
            </text>
            <text
              :style="{ fontSize: 14, fill: '#494949' }"
              text-anchor="middle"
              x="100"
              y="100"
            >
              {{ t("Task") }}
            </text>
          </svg>
        </template>
      </DxPieChart>
    </div>
    <div class="grid-wrap">
      <div class="selection-tab d-flex align-items-center">
        <div
          v-for="(item, index) in tabSelection"
          :key="index"
          @click="selectGrid(item)"
        >
          <div
            class="tab-item"
            :class="index == selectedGrid.ID ? 'active-item' : ''"
          >
            {{ item.Name }}
            <div class="item-amount">
              {{ item.Amount }}
            </div>
          </div>
        </div>
      </div>
      <BaseDataGrid
        :dataSource="selectedGrid.Data"
        :columns="TaskSubColumnDefault"
        :pageSize="9"
        @onRowClick="selectedRow"
      >
        <template v-slot:StartDateTemplate="{ data }">
          <div>{{ formatDate(data.data.startDate) }}</div>
        </template>
        <template v-slot:EndDateTemplate="{ data }">
          <div>{{ formatDate(data.data.endDate) }}</div>
        </template>
        <template v-slot:ProcessTemplate="{ data }">
          <div v-if="data.data.process == 0">{{ t("TaskDoing") }}</div>
          <div v-else-if="data.data.process < 100">
            {{ t("Done") }} {{ data.data.process }}%
          </div>
          <div v-else>{{ t("DoneJob") }}</div>
        </template>
      </BaseDataGrid>
    </div>
  </div>
  <PopupDetailTask
    :isVisible="isShowDetailPopup"
    :taskSelectedID="taskSelectedID"
    @reloadData="getTask(selectedProject.ID)"
    @closePopup="
      () => {
        isShowDetailPopup = false;
        taskSelectedID = '';
      }
    "
  ></PopupDetailTask>
</template>
<script setup>
import { ref, onBeforeMount, watch } from "vue";
import Project from "@/commons/models/Project.js";
import i18n from "@/plugins/i18n";
import { showToast } from "@/utils/toast-message/toastMessage";
import { responseStatus } from "@/commons/enums/api-response-status";
import { TaskSubColumnDefault } from "@/commons/contants/task-column-default.js";
import BaseDataGrid from "../base/BaseDataGrid.vue";
import { formatDate } from "@/utils/functions/commonFns";
import { getTaskType } from "@/apis/task-service/task-service.js";
import PopupDetailTask from "../popup/PopupDetailTask.vue";
import DxPieChart, {
  DxLegend,
  DxSeries,
  DxTooltip,
  DxFormat,
  DxLabel,
  DxConnector,
  DxExport,
} from "devextreme-vue/pie-chart";
import { length } from "@/assets/font/fontawesome-5.15.1/js/v4-shims";
var { t } = i18n.global;
const props = defineProps({
  reloadListProject: Boolean,
  selectedProject: Project,
});
const isShowDetailPopup = ref(false);
const taskSelectedID = ref();
const doneTask = ref([]);
const dueSoonTask = ref([]);
const noProblemTask = ref([]);
const todayTask = ref([]);
const outOfDateTask = ref([]);
const allTask = ref([]);
const listTask = ref([]);
const hoveredRegion = ref();

const populationByRegions = ref([
  {
    region: t("OutOfDate"),
    val: outOfDateTask.value?.length,
  },
  {
    region: t("ToDay"),
    val: todayTask.value?.length,
  },
  {
    region: t("DueSoon"),
    val: dueSoonTask.value?.length,
  },
  {
    region: t("DoingJob"),
    val: noProblemTask.value?.length,
  },
  {
    region: t("DoneJob"),
    val: doneTask.value?.length,
  },
]);
const customColors = ["#dc3545", "#ffc107", "#fd7e14", "#0073e6", "#28a745"];
const tabSelection = ref([
  { ID: 0, Name: t("All"), Amount: allTask.value.length, Data: allTask.value },
  {
    ID: 1,
    Name: t("OutOfDate"),
    Amount: outOfDateTask.value.length,
    Data: outOfDateTask.value,
  },
  {
    ID: 2,
    Name: t("ToDay"),
    Amount: todayTask.value.length,
    Data: todayTask.value,
  },
  {
    ID: 3,
    Name: t("DueSoon"),
    Amount: dueSoonTask.value.length,
    Data: dueSoonTask.value,
  },
  {
    ID: 4,
    Name: t("DoingJob"),
    Amount: noProblemTask.value.length,
    Data: noProblemTask.value,
  },
  {
    ID: 5,
    Name: t("DoneJob"),
    Amount: doneTask.value.length,
    Data: doneTask.value,
  },
]);

const selectedGrid = ref({
  ID: 0,
  Name: t("All"),
  Amount: allTask.value.length,
  Data: allTask.value,
});

onBeforeMount(() => {
  if (props.selectedProject && props.selectedProject.ID) {
    getTask(props.selectedProject.ID);
  }
});

watch(
  () => props.selectedProject,
  () => {
    if (props.selectedProject && props.selectedProject.ID) {
      getTask(props.selectedProject.ID);
    }
  },
  { immediate: true }
);

function customizeText(event) {
  return {
    text: `<span class="bold">${event.value}</span> ${t(
      "Task"
    )} <span class="bold">${event.argumentText}</span><br> (${
      event.percentText
    })`,
  };
}

function onPointHoverChanged(e) {
  if (e.target) {
    hoveredRegion.value = e.target.originalArgument;
  } else {
    hoveredRegion.value = null;
  }
}

/**
 * Chọn bảng
 * @param {*} item
 */
function selectGrid(item) {
  selectedGrid.value = item;
}

/**
 * Lấy công việc theo phân loại
 */
async function getTask(projectID) {
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const param = {
      projectID: projectID,
      userID: currentUser?.id
    }
    const res = await getTaskType(param);
    if (res && res.status && res.data && res.status == responseStatus.Success) {
      doneTask.value = [...res.data.Done];
      dueSoonTask.value = [...res.data.DueSoon];
      noProblemTask.value = [...res.data.NoProblem];
      todayTask.value = [...res.data.ToDay];
      outOfDateTask.value = [...res.data.OutOfDate];
      allTask.value = [];
      allTask.value.push(...doneTask.value);
      allTask.value.push(...dueSoonTask.value);
      allTask.value.push(...noProblemTask.value);
      allTask.value.push(...todayTask.value);
      allTask.value.push(...outOfDateTask.value);
      listTask.value = [...allTask.value];

      populationByRegions.value = [
        {
          region: t("OutOfDate"),
          val: outOfDateTask.value?.length,
        },
        {
          region: t("ToDay"),
          val: todayTask.value?.length,
        },
        {
          region: t("DueSoon"),
          val: dueSoonTask.value?.length,
        },
        {
          region: t("DoingJob"),
          val: noProblemTask.value?.length,
        },
        {
          region: t("DoneJob"),
          val: doneTask.value?.length,
        },
      ];

      tabSelection.value = [
        {
          ID: 0,
          Name: t("All"),
          Amount: allTask.value.length,
          Data: allTask.value,
        },
        {
          ID: 1,
          Name: t("OutOfDate"),
          Amount: outOfDateTask.value.length,
          Data: outOfDateTask.value,
        },
        {
          ID: 2,
          Name: t("ToDay"),
          Amount: todayTask.value.length,
          Data: todayTask.value,
        },
        {
          ID: 3,
          Name: t("DueSoon"),
          Amount: dueSoonTask.value.length,
          Data: dueSoonTask.value,
        },
        {
          ID: 4,
          Name: t("DoingJob"),
          Amount: noProblemTask.value.length,
          Data: noProblemTask.value,
        },
        {
          ID: 5,
          Name: t("DoneJob"),
          Amount: doneTask.value.length,
          Data: doneTask.value,
        },
      ];
      selectedGrid.value = {
        ID: 0,
        Name: t("All"),
        Amount: allTask.value.length,
        Data: allTask.value,
      };
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    console.log(error);
    showToast.error(t("Error"));
  }
}

function selectedRow(event) {
  if (event && event.data && event.data.taskID) {
    taskSelectedID.value = event.data.taskID;
    isShowDetailPopup.value = true;
  }
}
</script>
<style lang="scss" scoped>
.project-report-container {
  display: flex;
  flex-flow: column;
  //   height: calc(100vh - 100px);
  width: 100%;
  .chart-wrap {
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    margin-top: 12px;
  }
  .grid-wrap {
    flex: 1;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: auto;

    .selection-tab {
      padding: 12px;
      border-bottom: 1px solid #ccc;

      .tab-item {
        display: flex;
        align-items: center;
        // padding: 4px 0;
        margin: 0 16px;
        cursor: pointer;
        border-bottom: 4px solid transparent;
        .item-amount {
          margin-left: 8px;
          width: 26px;
          height: 25px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--app-color-white);
          font-weight: 700;
          background: #ccc;
          border-radius: 50%;
        }
      }
      .active-item {
        font-weight: 700;
        color: var(--app-color-primary);
        padding-bottom: 8px;
        border-color: var(--app-color-primary);
        .item-amount {
          background: var(--app-color-primary);
        }
      }
    }
  }
}
</style>
