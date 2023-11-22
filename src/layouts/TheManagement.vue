<template>
  <TheHeader
    :view="view"
    :reloadListProject="reloadListProject"
    @onOpenAddNewProject="onOpenAddProject"
    @onOpenAddNewTask="onOpenPopupAddNewTask"
  ></TheHeader>
  <router-view
    :reloadListProject="reloadListProject"
    @onChangedView="onChangedView"
    @onOpenTaskEditForm="onOpenPopupAddNewTask"
  ></router-view>
  <PopupAddProject
    v-if="isShowAddProjectPopup"
    :isVisible="isShowAddProjectPopup"
    :method="projectFormMethod"
    @saveNewProjectSuccess="reloadData"
    @onHiddenPopup="closeAddProjectPopup"
  ></PopupAddProject>
  <PopupAddNewJob
    v-if="isShowAddNewTask"
    :isVisible="isShowAddNewTask"
    :method="taskFormMethod"
    :taskSelectedID="taskSelectedID"
    @saveNewTaskSuccess="reloadData"
    @onHiddenPopup="closePopupAddNewTask"
  ></PopupAddNewJob>
</template>
<script setup>
import TheHeader from "@/views/TheHeader.vue";
import PopupAddProject from "@/components/popup/PopupAddProject.vue";
import PopupAddNewJob from "@/components/popup/PopupAddNewJob.vue";
import { ref } from "vue";
import { methodStatus } from "@/commons/contants/method-status";

const isShowAddProjectPopup = ref(false);
const isShowAddNewTask = ref(false);
const view = ref("");
const reloadListProject = ref(false);
const projectFormMethod = ref(0);
const taskFormMethod = ref(0);
const taskSelectedID = ref();
function onChangedView(string) {
  view.value = string;
}

/**
 * thêm mới dự án thành công
 */
function reloadData() {
  reloadListProject.value = !reloadListProject.value;
}

/**
 * Mở popup thêm mới dự án
 */
function onOpenAddProject(method) {
  isShowAddProjectPopup.value = true;
  projectFormMethod.value = method;
}

/**
 * Đóng popup thêm mới dự án
 */
function closeAddProjectPopup() {
  isShowAddProjectPopup.value = false;
}

/**
 * Mở popup thêm mới công việc
 */
function onOpenPopupAddNewTask(id) {
  if (id) {
    taskFormMethod.value = methodStatus.Update;
  } else {
    taskFormMethod.value = methodStatus.Add;
  }
  taskSelectedID.value = id;
  isShowAddNewTask.value = true;
}

/**
 * Đóng popup thêm mới công việc
 */
function closePopupAddNewTask() {
  isShowAddNewTask.value = false;
}
</script>
<style lang="scss"></style>
