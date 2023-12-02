<template lang="">
  <div id="kanban">
    <DxScrollView
      class="scrollable-board"
      show-scrollbar="onScroll"
      direction="horizontal"
    >
      <div class="d-flex">
        <DxSortable
          class="sortable-lists"
          item-orientation="horizontal"
          handle=".list-title"
          @reorder="onListReorder"
        >
          <div v-for="(list, index) in data" :key="index" class="list">
            <div
              class="list-title dx-theme-text-color"
              v-if="!list?.ShowInput"
              :title="list?.ColumnName"
              :style="{ background: list?.HeaderColor }"
            >
              <div
                class="list-title-text"
                @click="
                  () => {
                    list.ShowInput = true;
                  }
                "
              >
                {{ list?.ColumnName }}
              </div>

              <div
                class="d-flex center-center pointer"
                :style="{ width: '24px', height: '24px' }"
                @click="openKanbanSetting(index)"
              >
                <div
                  :id="'kanban-' + index"
                  class="white-arrow-down-icon column-setting"
                  :style="isShowKanbanSetting ? { opacity: 1 } : ''"
                  v-if="!list?.IsNewColumn"
                ></div>
              </div>
              <div class="task-amount" v-if="!list?.IsNewColumn">
                {{ list?.Tasks?.length }}
              </div>
            </div>
            <div
              class="list-title"
              v-if="list?.ShowInput"
              :style="{ background: list.HeaderColor }"
            >
              <BaseTextbox
                :height="40"
                :width="250"
                :value="list?.ColumnName"
                :newInput="list?.IsNewColumn"
                :focusWhenReady="true"
                @onEnterKey="(event) => saveColumnName(index, event)"
                @onFocusOut="(event) => saveColumnName(index, event)"
              ></BaseTextbox>
            </div>
            <DxScrollView class="scrollable-list" show-scrollbar="onScroll">
              <DxSortable
                :data="list"
                class="sortable-cards"
                group="tasksGroup"
                @drag-start="onTaskDragStart($event)"
                @reorder="onTaskDrop($event)"
                @add="onTaskDrop($event)"
              >
                <div
                  v-for="(task, index) in list?.Tasks"
                  :key="index"
                  class="card dx-card dx-theme-text-color dx-theme-background-color"
                  @click="onSelectTask(task)"
                  @ondrag="onSelectedTask(task)"
                >
                  <div
                    class="card-header"
                    :style="
                      task?.Process == 100
                        ? { backgroundColor: 'var(--green-100)' }
                        : {
                            backgroundColor: validateDate(
                              task.EndDate,
                              task.FinishDate
                            ).Background,
                          }
                    "
                    v-if="
                      DateStatus.NoProblem !=
                      validateDate(task?.EndDate, task?.FinishDate)
                    "
                  >
                    <div
                      class="mr-px-8 pt-px-2"
                      :class="
                        task?.Process == 100
                          ? 'done-date-icon'
                          : validateDate(task?.EndDate, task?.FinishDate).Icon
                      "
                    ></div>
                    <div
                      class="bold"
                      :style="
                        task?.Process == 100
                          ? { color: 'var(--app-color-success)' }
                          : {
                              color: validateDate(
                                task?.EndDate,
                                task?.FinishDate
                              ).Color,
                            }
                      "
                    >
                      {{
                        task?.Process == 100
                          ? t("Done")
                          : validateDate(task?.EndDate, task?.FinishDate).Name
                      }}
                    </div>
                  </div>
                  <div class="card-content">
                    <div :style="{ opacity: 0, height: 0 }">
                      id-{{ task?.TaskID }}
                    </div>
                    <div class="pb-px-16">
                      {{ task?.TaskName }}
                    </div>
                    <div class="d-flex align-items-center pt-px-8">
                      <div
                        class="task-assignee assignee-icon"
                        v-if="!task?.AssigneeName"
                      ></div>
                      <div
                        class="task-assignee bold"
                        :style="{ background: task?.Background }"
                        v-else
                      >
                        {{ getName(task?.AssigneeName) }}
                      </div>
                      <div class="task-deadline">
                        <div
                          class="mr-px-8"
                          :class="
                            task?.Process == 100
                              ? 'done-date-icon'
                              : 'celendar-default-icon'
                          "
                          v-if="task?.Process == 100"
                        ></div>
                        <div
                          v-else
                          class="mr-px-8"
                          :class="
                            task?.EndDate
                              ? validateDate(task?.EndDate, task?.FinishDate)
                                  .Icon
                              : 'celendar-default-icon'
                          "
                        ></div>
                        <div
                          v-if="task?.EndDate"
                          class="bold"
                          :style="{
                            color:
                              task?.Process == 100
                                ? 'var(--app-color-success)'
                                : validateDate(task?.EndDate, task?.FinishDate)
                                    .Color,
                          }"
                        >
                          {{ formatDate(task?.EndDate) }}
                        </div>
                      </div>
                    </div>
                    <div
                      class="d-flex align-items-center mt-px-12"
                      v-if="task?.Process"
                    >
                      <div class="task-completion-icon mr-px-8 ml-px-2"></div>
                      {{ task?.Process }}
                    </div>
                  </div>
                </div>
              </DxSortable>
            </DxScrollView>
          </div>
        </DxSortable>
        <div class="addNewColumn">
          <div
            class="d-flex align-items-center"
            v-if="!showInputAddColumn"
            @click="
              () => {
                showInputAddColumn = true;
              }
            "
          >
            <div class="primary-add-icon mr-px-8 mt-px-2"></div>
            {{ t("AddNewColumn") }}
          </div>
          <div v-else>
            <BaseTextbox
              :height="40"
              :width="250"
              :value="''"
              :newInput="true"
              :focusWhenReady="true"
              @onEnterKey="(event) => addNewColumn(event)"
              @onFocusOut="(event) => addNewColumn(event)"
            ></BaseTextbox>
          </div>
        </div>
      </div>
    </DxScrollView>
  </div>
  <BasePopover
    v-if="isShowKanbanSetting"
    :isVisible="isShowKanbanSetting"
    :target="idKanban"
    :width="160"
    @onHidden="
      () => {
        isShowKanbanSetting = false;
      }
    "
  >
    <template v-slot:content>
      <div
        class="d-flex align-items-center pointer pl-px-12 error-color"
        :style="{ height: '36px' }"
        @click="deleteKanban"
      >
        {{ t("DeleteKanban") }}
      </div>
    </template>
  </BasePopover>
</template>
<script setup>
import { DxScrollView } from "devextreme-vue/scroll-view";
import { DxSortable, DxRowDragging } from "devextreme-vue/sortable";
import BasePopover from "./BasePopover.vue";
import BaseTextbox from "./BaseTextbox.vue";
import { onBeforeMount, ref, watch } from "vue";
import {
  getRandomColor,
  formatDate,
  validateDate,
  isNullOrEmpty,
} from "@/utils/functions/commonFns";
import { JobStatus } from "@/commons/contants/job-status";
import { DateStatus } from "@/commons/contants/date-status";
import { updateTaskKanban } from "@/apis/task-service/task-service.js";
import {
  insertKanban,
  deleteKanbanByIntID,
  updateKanbanByID,
  updateKanbanSortOrder,
} from "@/apis/kanban-service/kanban-service.js";
import i18n from "@/plugins/i18n";
import { showToast } from "@/utils/toast-message/toastMessage";
import { responseStatus } from "@/commons/enums/api-response-status";
var { t } = i18n.global;
const idKanban = ref("");
const isShowKanbanSetting = ref(false);
const props = defineProps({
  data: Array,
  column: Array,
});
const emit = defineEmits();
const data = ref([...props.data]);
const showInputAddColumn = ref(false);
// const newColumn = {
//   ColumnName: t("AddNewColumn"),
//   HeaderColor: getRandomColor(),
//   Tasks: [],
//   IsNewColumn: true,
// };
onBeforeMount(() => {
  // for (let i = 0; i < 10; i++) {
  //   data.value.push(newColumn);
  // }
});

watch(
  () => props.data,
  () => {
    data.value = [...props.data];
  },
  { immediate: true },
  { deep: true }
);

/**
 * Chọn công việc
 */
function onSelectTask(task) {
  if (task && task.TaskID) {
    emit("onOpenTaskEditForm", task.TaskID);
  }
}

/**
 * Mở popup cài đặt cột
 * @param {*} index
 */
function openKanbanSetting(index) {
  idKanban.value = "kanban-" + index;
  isShowKanbanSetting.value = true;
}

/**
 * Xóa cột
 */
async function deleteKanban() {
  const arr = idKanban.value?.split("-");
  const index = arr[arr.length - 1];
  try {
    const res = await deleteKanbanByIntID(data.value[index].KanbanID);
    if (res && res.status && res.status == responseStatus.Success) {
      showToast.success(t("DeleteKanbanSuccess"));
      emit("reloadData");
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    console.log(error);
    showToast.error(t("Error"));
  }
  isShowKanbanSetting.value = false;
}

/**
 * Thêm cột mới
 */
async function addNewColumn(event) {
  if (event && !isNullOrEmpty(event)) {
    const newColumn = {
      ProjectID: data.value[0].ProjectID,
      ColumnName: event,
      HeaderColor: getRandomColor(),
      ShowInput: false,
      SortOrder: data.value.length + 1,
    };
    try {
      const res = await insertKanban(newColumn);
      if (res && res.status && res.status == responseStatus.InsertSuccess) {
        showToast.success(t("AddNewKanbanSuccess"));
        emit("reloadData");
      } else {
        showToast.error(t("Error"));
      }
    } catch (error) {
      console.log(error);
      showToast.error(t("Error"));
    }
  }
  showInputAddColumn.value = false;
}

/**
 * Đổi tên cột
 */
async function saveColumnName(listIndex, newName) {
  if (!isNullOrEmpty(newName)) {
    data.value[listIndex].ColumnName = newName;
    try {
      const res = await updateKanbanByID(
        data.value[listIndex].KanbanID,
        data.value[listIndex]
      );
      if (res && res.status && res.status == responseStatus.Success) {
        showToast.success(t("UpdateKanbanSuccess"));
      } else {
        showToast.error(t("Error"));
      }
    } catch (error) {
      console.log(error);
      showToast.error(t("Error"));
    }
  }
  data.value[listIndex].ShowInput = false;
}

/**
 * Đổi vị trí cột
 * @param {*} e
 */
async function onListReorder(e) {
  if (e.toIndex != e.fromIndex) {
    const param = {
      projectID: data.value[0].ProjectID,
      oldIndex: e.fromIndex + 1,
      newIndex: e.toIndex + 1,
    };
    try {
      const res = await updateKanbanSortOrder(param);
      if (res && res.status && res.status == responseStatus.Success) {
        showToast.success(t("UpdateSortOrderSuccess"));
        emit("reloadData");
      } else {
        showToast.error(t("Error"));
      }
    } catch (error) {
      console.log(error);
      showToast.error(t("Error"));
    }
  }
}

function onSelectedTask(task) {
  console.log(task);
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
  const a = e.itemElement.innerText.split("\n");
  const b = a.find((item) => item.includes("id-"));
  const array = b.split("-");
  const id = array[1];
  if (e.fromData && e.toData && e.fromData != e.toData && id) {
    try {
      const param = {
        TaskID: id,
        Process: e.toData.KanbanID,
      };
      const res = await updateTaskKanban(param);
      if (res && res.status && res.status == responseStatus.Success) {
        showToast.success(t("UpdateTaskSuccess"));
        // emit("reloadData");
      } else {
        showToast.error(t("Error"));
      }
    } catch (error) {
      console.log(error);
      showToast.error(t("Error"));
    }
  }

  const temp = e?.fromData?.Tasks[e.fromIndex];
  e?.fromData?.Tasks?.splice(e.fromIndex, 1);
  e?.toData?.Tasks?.splice(e.toIndex, 0, temp);
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
</script>
<style lang="scss" scoped>
#kanban {
  white-space: nowrap;
}

// .scrollable-list {
//   height: 820px;
// }
.addNewColumn {
  width: 312px;
  height: 64px;
  background-color: #fff;
  padding: 10px 10px 10px 30px;
  display: flex;
  align-items: center;
  color: var(--app-color-primary);
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
}

.list {
  border-right: 1px solid rgba(255, 255, 255, 0.085);
  background-color: rgba(255, 255, 255, 0.067);
  display: inline-block;
  vertical-align: top;
  white-space: normal;
}

.list-title {
  cursor: all-scroll !important;
  width: 312px;
  height: 64px;
  display: flex;
  align-items: center;
  font-size: 16px;
  padding: 10px;
  padding-left: 30px;
  font-weight: bold;
  cursor: pointer;
  .list-title-text {
    width: 230px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: white;
    font-size: 18px;
    cursor: pointer;
  }
  .task-amount {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    min-height: 24px;
    margin-left: 8px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.058823529411764705);
    color: white;
  }

  .column-setting {
    opacity: 0;
    cursor: pointer;
  }
}

.list-title:hover {
  .column-setting {
    opacity: 1;
  }
}

.scrollable-list {
  width: 100%;
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

// .dx-sortable {
//   display: block;
//   height: calc(100vh - 56px);
// }
</style>
