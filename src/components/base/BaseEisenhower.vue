<template lang="">
  <div class="ei-container">
    <div class="title-left">
      <div class="text enmergency01">{{ t("Important") }}</div>
      <div class="text enmergency02">{{ t("UnImportant") }}</div>
    </div>
    <div class="content-right">
      <div class="title-top">
        <div class="text enmergency01">{{ t("Enmergency") }}</div>
        <div class="text enmergency02">{{ t("UnEnmergency") }}</div>
      </div>
      <div class="main-content">
        <div class="d-flex flex-1 h-50">
          <div class="need-do-now">
            <div
              class="d-flex pd-px-16 align-items-center justify-content-between"
            >
              <div class="d-flex">
                <div class="need-do-now-icon mr-px-8"></div>
                <div class="grid-title italic-font">{{ t("NeedDoNow") }}</div>
              </div>
              <div class="grid-title bold">
                {{ needToDoTask.length }} {{ t("Task") }}
              </div>
            </div>
            <div class="list-task">
              <div v-for="(item, index) in needToDoTask" :key="index">
                <div
                  class="task-item"
                  @click="openDetailTask(item)"
                  :title="item.taskName"
                >
                  <div class="task-item-name">
                    {{ item.taskName }}
                  </div>
                  <div
                    class="avatar-32 bold white-color"
                    :style="{ background: item.background }"
                    v-if="item.assigneeName"
                  >
                    {{ getName(item.assigneeName) }}
                  </div>
                  <div v-else class="black-nobody-icon"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="do-after">
            <div
              class="d-flex pd-px-16 align-items-center justify-content-between"
            >
              <div class="d-flex">
                <div class="do-after-icon mt-px-2 mr-px-8"></div>
                <div class="grid-title italic-font">{{ t("CanDoAfter") }}</div>
              </div>
              <div class="grid-title bold">
                {{ canDoAfterTask.length }} {{ t("Task") }}
              </div>
            </div>
            <div class="list-task">
              <div v-for="(item, index) in canDoAfterTask" :key="index">
                <div
                  class="task-item"
                  @click="openDetailTask(item)"
                  :title="item.taskName"
                >
                  <div class="task-item-name">
                    {{ item.taskName }}
                  </div>
                  <div
                    class="avatar-32 bold white-color"
                    :style="{ background: item.background }"
                    v-if="item.assigneeName"
                  >
                    {{ getName(item.assigneeName) }}
                  </div>
                  <div v-else class="black-nobody-icon"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex flex-1 h-50">
          <div class="unassign-yet">
            <div
              class="d-flex pd-px-16 align-items-center justify-content-between"
            >
              <div class="d-flex">
                <div class="unassign-yet-icon mt-px-2 mr-px-8"></div>
                <div class="grid-title italic-font">
                  {{ t("AssignForMember") }}
                </div>
              </div>
              <div class="grid-title bold">
                {{ noneAssigneeTask.length }} {{ t("Task") }}
              </div>
            </div>
            <div class="list-task">
              <div v-for="(item, index) in noneAssigneeTask" :key="index">
                <div
                  class="task-item"
                  @click="openDetailTask(item)"
                  :title="item.taskName"
                >
                  <div class="task-item-name">
                    {{ item.taskName }}
                  </div>
                  <div
                    class="avatar-32 bold white-color"
                    :style="{ background: item.background }"
                    v-if="item.assigneeName"
                  >
                    {{ getName(item.assigneeName) }}
                  </div>
                  <div v-else class="black-nobody-icon"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="review">
            <div
              class="d-flex pd-px-16 align-items-center justify-content-between"
            >
              <div class="d-flex">
                <div class="review-icon mt-px-2 mr-px-8"></div>
                <div class="grid-title italic-font">{{ t("CanReview") }}</div>
              </div>
              <div class="grid-title bold">
                {{ doneTask.length }} {{ t("Task") }}
              </div>
            </div>
            <div class="list-task">
              <div v-for="(item, index) in doneTask" :key="index">
                <div
                  class="task-item"
                  @click="openDetailTask(item)"
                  :title="item.taskName"
                >
                  <div class="task-item-name">
                    {{ item.taskName }}
                  </div>
                  <div
                    class="avatar-32 bold white-color"
                    :style="{ background: item.background }"
                    v-if="item.assigneeName"
                  >
                    {{ getName(item.assigneeName) }}
                  </div>
                  <div v-else class="black-nobody-icon"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <PopupDetailTask
    :isVisible="isShowDetailPopup"
    :taskSelectedID="taskSelectedID"
    @reloadData="getTask(-1)"
    @closePopup="
      () => {
        isShowDetailPopup = false;
        taskSelectedID = '';
      }
    "
  ></PopupDetailTask>
</template>
<script setup>
import { getTaskType } from "@/apis/task-service/task-service.js";
import { responseStatus } from "@/commons/enums/api-response-status";
import { getName } from "@/utils/functions/commonFns.js";
import Task from "@/commons/models/Task";
import i18n from "@/plugins/i18n";
import { showToast } from "@/utils/toast-message/toastMessage";
import PopupDetailTask from "@/components/popup/PopupDetailTask.vue";
import { ref, watch } from "vue";
import { onBeforeMount } from "vue";
import Project from "@/commons/models/Project";
var { t } = i18n.global;
const needToDoTask = ref(Array < Task > []);
const canDoAfterTask = ref(Array < Task > []);
const noneAssigneeTask = ref(Array < Task > []);
const doneTask = ref(Array < Task > []);
const taskSelectedID = ref(0);
const isShowDetailPopup = ref(false);
const props = defineProps({
  reloadListProject: Boolean,
  selectedProject: Project,
});

watch(
  () => props.reloadListProject,
  () => {
    getTask(-1);
  },
  { immediate: true }
);

watch(
  () => props.selectedProject,
  () => {
    if (props.selectedProject && props.selectedProject.ID) {
      getTask(props.selectedProject?.ID);
    }
  },
  { immediate: true }
);

onBeforeMount(() => {
  if (props.selectedProject && props.selectedProject.ID) {
    getTask(props.selectedProject?.ID);
  }
});

/**
 * Mở chi tiết công việc
 * @param {*} item
 */
function openDetailTask(item) {
  taskSelectedID.value = item.taskID;
  isShowDetailPopup.value = true;
}

/**
 * Lấy công việc theo phân loại
 */
async function getTask(projectID) {
  try {
    const res = await getTaskType(projectID);
    if (res && res.status && res.data && res.status == responseStatus.Success) {
      needToDoTask.value = [];
      needToDoTask.value.push(...res.data.OutOfDate);
      needToDoTask.value.push(...res.data.ToDay);
      needToDoTask.value.push(...res.data.DueSoon);
      canDoAfterTask.value = [...res.data.NoProblem];
      noneAssigneeTask.value = [...res.data.NoneAssignee];
      doneTask.value = [...res.data.Done];
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    console.log(error);
    showToast.error(t("Error"));
  }
}
</script>
<style lang="scss" scoped>
.ei-container {
  display: flex;
  width: 100%;
  padding: 32px 64px 32px 0;
  height: calc(100vh - 130px);
  .title-left {
    width: 90px;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-right: 2px solid #ccc;
    margin-top: 40px;
    .text {
      width: 138px;
      height: 50%;
      display: flex;
      align-items: center;
      transform: rotate(-90deg);
    }
  }
  .content-right {
    width: 100%;
    .title-top {
      display: flex;
      width: 100%;
      height: 42px;
      border-bottom: 2px solid #ccc;
      .text {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .main-content {
      height: 100%;
      display: flex;
      flex-flow: column;
      .need-do-now {
        background-image: linear-gradient(89.83deg, #fcf1f2, #fff);
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 50%;
        .grid-title {
          font-size: 16px;
          color: #e8384f;
        }
      }

      .do-after {
        border-left: none;
        background-image: linear-gradient(89.6deg, #ecf3fc, #fff);
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 50%;
        .grid-title {
          font-size: 16px;
          color: #4186e0;
        }
      }

      .unassign-yet {
        border-top: none;
        background-image: linear-gradient(-90deg, #f1f9f6, #fff);
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 50%;
        .grid-title {
          font-size: 16px;
          color: #1faf7e;
        }
      }

      .review {
        border-left: none;
        border-top: none;
        background-image: linear-gradient(269.83deg, #fcf8eb, #fff);
        display: flex;
        height: 100%;
        flex-direction: column;
        flex: 1;
        width: 50%;

        .grid-title {
          font-size: 16px;
          color: #e9b818;
        }
      }
      .list-task {
        height: calc(100% - 54px);
        overflow: auto;
      }

      .task-item {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        padding: 16px;
        font-size: 16px !important;

        .task-item-name {
          width: calc(100% - 40px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .task-item:hover {
        background: var(--app-items-hover);
      }
    }
  }
  .enmergency01 {
    font-size: 16px;
    color: #fd612c;
  }
  .enmergency02 {
    font-size: 16px;
    color: #666666;
  }
}
.h-50 {
  height: 50%;
}
</style>
