<template>
  <div class="dashboard-container d-flex">
    <div class="menu">
      <div v-for="(item, index) in RootSelection" :key="index">
        <div class="menu-item pointer" @click="onSelectTab(item)">
          <div :class="item.Icon" class="mr-px-16"></div>
          {{ item.Name }}
        </div>
      </div>
      <!-- <div class="mb-px-12 bold white-color pl-px-24">
        {{ t("ListProject") }}
      </div> -->
      <BaseSearchInput
        class="mt-px-8 mb-px-12"
        :mode="'specialSearch'"
        :placeHolder="t('Search')"
        @onValueChanged="searchProject"
      ></BaseSearchInput>

      <div
        class="project-area"
        v-for="(item, index) in listProjectClone"
        :key="index"
      >
        <div class="project-item" @click="openTask(item.ProjectID)">
          <div class="item-icon" :class="item.Background">
            <div :class="item.Icon"></div>
          </div>
          <div class="item-text">
            {{ item.ProjectName }}
          </div>
        </div>
      </div>

      <div
        class="italic-font white-color pl-px-24 pt-px-12"
        v-if="!listProjectClone.length"
      >
        {{ t("NoneProject") }}
      </div>
      <!-- <div
        :style="{ color: '#ffffff', margin: '24px', cursor: 'pointer' }"
        @click="openTask(12, 2)"
      >
        Công việc Fake
      </div> -->
    </div>
    <div class="content">
      <div class="report-main">
        <div>
          <div class="white-color bold pb-px-8 mb-px-12">
            {{ t("TodayTaskAmount") }}
          </div>
          <div class="report-amount">
            <div v-for="(item, index) in listTaskAmount" :key="index">
              <div class="report-item">
                <div class="d-flex align-items-center">
                  <div class="mr-px-12 mt-px-2" :class="item.Icon"></div>
                  <div :style="{ color: '#666', fontWeight: '700' }">
                    {{ item.Text }}
                  </div>
                </div>
                <div
                  :style="{
                    color: '#666',
                    fontSize: '20px',
                    fontWeight: '700',
                  }"
                >
                  {{ item.Value }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="ml-px-12 mt-px-2">
          <div class="white-color bold pb-px-8 pl-px-12">
            {{ t("NeedToDoJobList") }}
          </div>
          <DxScrollView class="scrollable-list" show-scrollbar="always">
            <DxSortable
              :data="needToDoTask"
              class="sortable-cards"
              group="tasksGroup"
              @drag-start="onTaskDragStart($event)"
              @reorder="onTaskDrop($event)"
              @add="onTaskDrop($event)"
            >
              <div
                v-for="task in needToDoTask"
                :key="task.taskID"
                class="card dx-card dx-theme-text-color dx-theme-background-color"
                @click="onSelectTask(task)"
              >
                <div
                  class="card-header"
                  :style="
                    task?.process == 100
                      ? { backgroundColor: 'var(--green-100)' }
                      : {
                          backgroundColor: validateDate(
                            task.endDate,
                            task.finishDate
                          ).Background,
                        }
                  "
                  v-if="
                    DateStatus.NoProblem !=
                    validateDate(task?.endDate, task?.finishDate)
                  "
                >
                  <div
                    class="mr-px-8 pt-px-2"
                    :class="
                      task?.process == 100
                        ? 'done-date-icon'
                        : validateDate(task?.endDate, task?.finishDate).Icon
                    "
                  ></div>
                  <div
                    class="bold"
                    :style="
                      task?.process == 100
                        ? { color: 'var(--app-color-success)' }
                        : {
                            color: validateDate(task?.endDate, task?.finishDate)
                              .Color,
                          }
                    "
                  >
                    {{
                      task?.Process == 100
                        ? t("Done")
                        : validateDate(task?.endDate, task?.finishDate).Name
                    }}
                  </div>
                </div>
                <div class="card-content">
                  <div :style="{ opacity: 0, height: 0 }">
                    id-{{ task?.taskID }}
                  </div>
                  <div class="pb-px-16">
                    {{ task?.taskName }}
                  </div>
                  <div class="d-flex align-items-center pt-px-8">
                    <div
                      class="task-assignee assignee-icon"
                      v-if="!task?.assigneeName"
                    ></div>
                    <div
                      class="task-assignee bold"
                      :style="{ background: task?.background }"
                      v-else
                    >
                      {{ getName(task?.assigneeName) }}
                    </div>
                    <div class="task-deadline">
                      <div
                        class="mr-px-8"
                        :class="
                          task?.process == 100
                            ? 'done-date-icon'
                            : 'celendar-default-icon'
                        "
                        v-if="task?.process == 100"
                      ></div>
                      <div
                        v-else
                        class="mr-px-8"
                        :class="
                          task?.endDate
                            ? validateDate(task?.endDate, task?.finishDate).Icon
                            : 'celendar-default-icon'
                        "
                      ></div>
                      <div
                        v-if="task?.endDate"
                        class="bold"
                        :style="{
                          color:
                            task?.process == 100
                              ? 'var(--app-color-success)'
                              : validateDate(task?.endDate, task?.finishDate)
                                  .Color,
                        }"
                      >
                        {{ formatDate(task?.endDate) }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="d-flex align-items-center mt-px-12"
                    v-if="task?.process"
                  >
                    <div class="task-completion-icon mr-px-8 ml-px-2"></div>
                    {{ task?.process }}
                  </div>
                </div>
              </div>
            </DxSortable>
          </DxScrollView>
        </div>
      </div>
      <div class="quotations">
        <div>
          {{ t("Hello") }}
          <span class="bold" v-if="currentUser && currentUser.fullName">{{
            currentUser.fullName
          }}</span>
        </div>
        <div class="current-time">
          {{ currentTime }}
        </div>
        <div>
          {{ quotation.Content }}
        </div>
        <div class="mt-px-8 bold">
          {{ quotation.Author }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount, watch } from "vue";
import {
  getRandomFromArray,
  getCurrentTime,
} from "@/utils/functions/commonFns.js";
import { Quotations } from "@/commons/contants/quotations";
import { RootSelection } from "@/commons/contants/root-selection.js";
import router from "@/router/index.js";
import BaseSearchInput from "@/components/base/BaseSearchInput.vue";
import { RouterName } from "@/commons/contants/router-name.js";
import { getProjectByUserID } from "@/apis/project-service/project-service.js";
import { getTaskType } from "@/apis/task-service/task-service.js";
import i18n from "@/plugins/i18n";
import Project from "@/commons/models/Project";
import { showToast } from "@/utils/toast-message/toastMessage";
import { responseStatus } from "@/commons/enums/api-response-status";
import { DateStatus } from "@/commons/contants/date-status";
import {
  getRandomColor,
  formatDate,
  validateDate,
  isNullOrEmpty,
} from "@/utils/functions/commonFns";
import { useRoute } from "vue-router";
import Users from "@/commons/models/Users";
import { DxScrollView } from "devextreme-vue/scroll-view";
import { DxSortable } from "devextreme-vue/sortable";
var { t } = i18n.global;

const quotation = getRandomFromArray(Quotations);
const currentTime = ref("");
const emit = defineEmits();
const listTaskAmount = ref([
  {
    Icon: "outOfDate-icon",
    Text: t("OutOfDate"),
    Value: 0,
  },
  {
    Icon: "toDay-icon",
    Text: t("ToDay"),
    Value: 0,
  },
  {
    Icon: "dueTo-icon",
    Text: t("DueSoon"),
    Value: 0,
  },
  {
    Icon: "noProblem-icon",
    Text: t("TaskDoing"),
    Value: 0,
  },
  {
    Icon: "noneAssignee-icon",
    Text: t("UnAssign"),
    Value: 0,
  },
  {
    Icon: "done-icon",
    Text: t("Done"),
    Value: 0,
  },
]);

const props = defineProps({
  reloadListProject: {
    type: Boolean,
  },
  currentUser: Users,
});

watch(
  () => props.reloadListProject,
  () => {
    getProject();
    getTask(-1);
  }
);

onBeforeMount(() => {
  emit("onChangedView", RouterName.DashBoard);
  currentTime.value = getCurrentTime();
  setInterval(() => {
    currentTime.value = getCurrentTime();
  }, 1000);
  getProject();
  getTask(-1);
});
const route = useRoute();
const listProject = ref(Array < Project > []);
const listProjectClone = ref(Array < Project > []);
const outOfDateTask = ref([]);
const toDayTask = ref([]);
const dueSoonTask = ref([]);
const noProblemTask = ref([]);
const noneAssigneeTask = ref([]);
const doneTask = ref([]);
const needToDoTask = ref([]);
const dataSource = ref([
  {
    ColumnName: "Cần thực hiện",
    CreatedBY: "Đoàn Văn Việt",
    CreatedDate: "2023-11-26T18:10:32",
    HeaderColor: "#EEC300",
    KanbanID: 59,
    ModifiedBy: "Đoàn Văn Việt",
    ModifiedDate: "2023-11-26T18:10:32",
    ProjectID: 46,
    ShowInput: false,
    SortOrder: 1,
    Tasks: [],
  },
]);

function onSelectTask(task) {
  if (task && task.taskID) {
    emit("onOpenTaskEditForm", task.taskID);
  }
}

/**
 * Chọn tab
 * @param {*} item
 */
function onSelectTab(item) {
  router.push(item.Root);
}

function getName(string) {
  if (string && !isNullOrEmpty(string)) {
    const arr = string.toUpperCase().trim().split(" ");
    if (arr.length > 1) {
      return arr[0][0] + arr[arr.length - 1][0];
    }
    return arr[0][0];
  }
}

/**
 * Lọc dự án theo tên
 * @param {*} keyWord
 */
function searchProject(keyWord) {
  listProjectClone.value = [];
  listProject.value?.forEach((element) => {
    if (
      element.projectName &&
      element.projectName
        .trim()
        .toLowerCase()
        .includes(keyWord.trim().toLowerCase())
    ) {
      listProjectClone.value.push(element);
    }
  });
}

/**
 * Lấy công việc theo phân loại
 */
async function getTask(projectID) {
  try {
    const res = await getTaskType(projectID);
    if (res && res.status && res.data && res.status == responseStatus.Success) {
      needToDoTask.value = [];
      outOfDateTask.value = [...res.data.OutOfDate];
      toDayTask.value = [...res.data.ToDay];
      dueSoonTask.value = [...res.data.DueSoon];
      noProblemTask.value = [...res.data.NoProblem];
      doneTask.value = [...res.data.Done];
      noneAssigneeTask.value = [...res.data.NoneAssignee];
      listTaskAmount.value = [
        {
          Icon: "outOfDate-icon",
          Text: t("OutOfDate"),
          Value: outOfDateTask.value.length,
        },
        {
          Icon: "toDay-icon",
          Text: t("ToDay"),
          Value: toDayTask.value.length,
        },
        {
          Icon: "dueTo-icon",
          Text: t("DueSoon"),
          Value: dueSoonTask.value.length,
        },
        {
          Icon: "noProblem-icon",
          Text: t("TaskDoing"),
          Value: noProblemTask.value.length,
        },
        {
          Icon: "noneAssignee-icon",
          Text: t("UnAssign"),
          Value: noneAssigneeTask.value.length,
        },
        {
          Icon: "done-icon",
          Text: t("Done"),
          Value: doneTask.value.length,
        },
      ];
      needToDoTask.value.push(...outOfDateTask.value);
      needToDoTask.value.push(...toDayTask.value);
      needToDoTask.value.push(...dueSoonTask.value);
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    console.log(error);
    showToast.error(t("Error"));
  }
}

/**
 * Lấy dự án
 */
async function getProject() {
  try {
    // const res = await getAllProject();
    const id = localStorage.getItem("currentUserID");
    const res = await getProjectByUserID(id);
    if (res && res.status && res.status == responseStatus.Success && res.data) {
      listProject.value = res.data;
      listProjectClone.value = [...listProject.value];
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Mở Danh sách công việc
 * @param {*} taskID
 * @param {*} departmentID
 */
function openTask(ProjectID) {
  router.push({
    path: "/project",
    query: {
      Type: 1,
      ProjectID: ProjectID,
    },
  });
}

/**
 * Kéo công việc
 * @param {*} e
 */
function onTaskDragStart(e) {
  // e.itemData = e?.fromData?.Tasks[e.fromIndex];
}

/**
 * Thả công việc
 * @param {*} e
 */
async function onTaskDrop(e) {
  // const a = e.itemElement.innerText.split("\n");
  // const b = a.find((item) => item.includes("id-"));
  // const array = b.split("-");
  // const id = array[1];
  // if (e.fromData && e.toData && e.fromData != e.toData && id) {
  //   try {
  //     const param = {
  //       TaskID: id,
  //       Process: e.toData.KanbanID,
  //     };
  //     const res = await updateTaskKanban(param);
  //     if (res && res.status && res.status == responseStatus.Success) {
  //       showToast.success(t("UpdateTaskSuccess"));
  //       // emit("reloadData");
  //     } else {
  //       showToast.error(t("Error"));
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     showToast.error(t("Error"));
  //   }
  // }
  const temp = e?.fromData[e.fromIndex];
  e?.fromData?.splice(e.fromIndex, 1);
  e?.toData?.splice(e.toIndex, 0, temp);
}
</script>
<style lang="scss" scoped>
.dashboard-container {
  .menu {
    background-color: rgba(0, 0, 0, 0.7);
    min-width: 268px;
    height: 100vh;
    position: absolute;
    padding-top: 72px;

    .project-area {
      padding: 0 24px;
      cursor: pointer;
      .project-item {
        height: 42px;
        display: flex;
        align-items: center;
        color: var(--app-color-white);

        .item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          margin-right: 12px;
        }

        .item-text {
          max-width: 184px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }

    .project-area:hover {
      background: #212121;
    }

    .menu-item {
      display: flex;
      align-items: center;
      width: 100%;
      height: 40px;
      color: var(--app-color-white);
      padding: 0 24px;
    }

    .menu-item:hover {
      background-color: #212121;
    }
  }
  .content {
    padding: 70px 20px 32px 288px;
    width: 100%;
    height: 100vh;
    background: url("../../assets/images/dashboard03.jpg") no-repeat;
    background-size: cover;
    display: flex;
    justify-content: flex-end;

    .add-button {
      position: absolute;
      right: 20px;
      top: 72px;
    }

    .quotations {
      width: 310px;
      color: #fff;
      position: absolute;
      bottom: 32px;
      left: 290px;

      .current-time {
        font-size: 60px;
        font-weight: 500;
      }
    }
    .report-main {
      display: flex;
      .report-amount {
        width: 312px;
        border-radius: 8px;
        background: #fff;
        padding: 8px 24px;
        height: fit-content;

        .report-item {
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
  }
}

.dx-sortable-dragging,
.sortable-cards {
  min-height: 380px;
  .card-header {
    height: 40px;
    padding: 0 12px;
    display: flex;
    align-items: center;
  }
  .card-content {
    padding: 12px;
    .task-assignee {
      width: 24px;
      height: 24px;
      min-width: 24px;
      min-height: 24px;
      border-radius: 50%;
      -moz-background-clip: padding;
      -webkit-background-clip: padding-box;
      background-clip: padding-box;
      line-height: 24px;
      color: #fff;
      text-align: center;
    }
    .task-deadline {
      font-size: 13px !important;
      display: flex;
      align-items: center;
      margin-left: 24px;
    }
  }
}

.card {
  position: relative;
  background-color: white;
  box-sizing: border-box;
  width: 278px;
  border-radius: 8px;
  margin: 10px;
  cursor: pointer;
}
</style>
