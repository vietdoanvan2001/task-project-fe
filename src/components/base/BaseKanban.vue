<template lang="">
  <div id="kanban">
    <DxScrollView
      class="scrollable-board"
      direction="horizontal"
      show-scrollbar="always"
    >
      <DxSortable
        class="sortable-lists"
        item-orientation="horizontal"
        handle=".list-title"
        @reorder="onListReorder"
      >
        <div v-for="(list, index) in data" :key="index" class="list">
          <div
            class="list-title dx-theme-text-color"
            v-if="!list.ShowInput"
            :style="{ background: list.HeaderColor }"
          >
            <div
              class="list-title-text"
              @click="
                () => {
                  list.ShowInput = true;
                }
              "
            >
              {{ list.ColumnName }}
            </div>
            <div
              class="white-arrow-down-icon column-setting"
              v-if="!list.IsNewColumn"
            ></div>
            <div class="task-amount" v-if="!list.IsNewColumn">
              {{ list.Tasks.length }}
            </div>
          </div>
          <div
            class="list-title"
            v-if="list.ShowInput"
            :style="{ background: list.HeaderColor }"
          >
            <BaseTextbox
              :height="40"
              :width="250"
              :value="list.ColumnName"
              :newInput="list.IsNewColumn"
              :focusWhenReady="true"
              @onEnterKey="(event) => saveColumnName(index, event)"
              @onFocusOut="(event) => saveColumnName(index, event)"
            ></BaseTextbox>
          </div>
          <DxScrollView class="scrollable-list" show-scrollbar="always">
            <DxSortable
              :data="list"
              class="sortable-cards"
              group="tasksGroup"
              @drag-start="onTaskDragStart($event)"
              @reorder="onTaskDrop($event)"
              @add="onTaskDrop($event)"
            >
              <div
                v-for="(task, index) in list.Tasks"
                :key="index"
                class="card dx-card dx-theme-text-color dx-theme-background-color"
              >
                <div
                  class="card-header"
                  :style="{
                    backgroundColor: validateDate(task.EndDate, task.FinishDate)
                      .Background,
                  }"
                  v-if="
                    DateStatus.NoProblem !=
                    validateDate(task.EndDate, task.FinishDate)
                  "
                >
                  <div
                    class="mr-px-8 pt-px-2"
                    :class="validateDate(task.EndDate, task.FinishDate).Icon"
                  ></div>
                  <div
                    class="bold"
                    :style="{
                      color: validateDate(task.EndDate, task.FinishDate).Color,
                    }"
                  >
                    {{ validateDate(task.EndDate, task.FinishDate).Name }}
                  </div>
                </div>
                <div class="card-content">
                  <div class="pb-px-16">
                    {{ task.TaskName }}
                  </div>
                  <div class="d-flex align-items-center pt-px-8">
                    <div class="task-assignee assignee-icon"></div>
                    <div class="task-deadline">
                      <div
                        class="mr-px-8"
                        :class="
                          task.EndDate
                            ? validateDate(task.EndDate, task.FinishDate).Icon
                            : 'celendar-default-icon'
                        "
                      ></div>
                      <div
                        v-if="task.EndDate"
                        class="bold"
                        :style="{
                          color: validateDate(task.EndDate, task.FinishDate)
                            .Color,
                        }"
                      >
                        {{ formatDate(task.EndDate) }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="d-flex align-items-center mt-px-12"
                    v-if="task.Process"
                  >
                    <div class="task-completion-icon mr-px-8 ml-px-2"></div>
                    {{ task.Process }}
                  </div>
                </div>
              </div>
            </DxSortable>
          </DxScrollView>
        </div>
      </DxSortable>
    </DxScrollView>
  </div>
</template>
<script setup>
import { DxScrollView } from "devextreme-vue/scroll-view";
import { DxSortable } from "devextreme-vue/sortable";
import BaseTextbox from "./BaseTextbox.vue";
import { onBeforeMount, ref } from "vue";
import {
  getRandomColor,
  formatDate,
  validateDate,
  isNullOrEmpty,
} from "@/utils/functions/commonFns";
import { JobStatus } from "@/commons/contants/job-status";
import { DateStatus } from "@/commons/contants/date-status";
import i18n from "@/plugins/i18n";
var { t } = i18n.global;

const props = defineProps({
  data: Array,
});
const emit = defineEmits();
const newColumn = {
  ColumnName: t("AddNewColumn"),
  HeaderColor: getRandomColor(),
  Tasks: [],
  IsNewColumn: true,
};
const data = ref([...props.data]);

onBeforeMount(() => {
  data.value.push(newColumn);
});

/**
 * Đổi tên cột
 */
function saveColumnName(listIndex, newName) {
  if (!isNullOrEmpty(newName)) {
    data.value[listIndex].ColumnName = newName;
  }
  data.value[listIndex].ShowInput = false;
}

/**
 * Đổi vị trí cột
 * @param {*} e
 */
function onListReorder(e) {
  const temp = data.value[e.fromIndex];
  data.value[e.fromIndex] = data.value[e.toIndex];
  data.value[e.toIndex] = temp;
}

/**
 * Kéo công việc
 * @param {*} e
 */
function onTaskDragStart(e) {
  e.itemData = e?.fromData?.Tasks[e.fromIndex];
}

/**
 * Thả công việc
 * @param {*} e
 */
function onTaskDrop(e) {
  e?.fromData?.Tasks?.splice(e.fromIndex, 1);
  e?.toData?.Tasks?.splice(e.toIndex, 0, e.itemData);
}
</script>
<style lang="scss" scoped>
#kanban {
  white-space: nowrap;
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

.dx-sortable {
  display: block;
  height: calc(100vh - 56px);
}
</style>
