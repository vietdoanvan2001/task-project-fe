<template>
  <TheHeader
    :view="view"
    @onOpenAddNewProject="onOpenAddProject"
    @onOpenAddNewTask="onOpenPopupAddNewTask"
  ></TheHeader>
  <router-view @onChangedView="onChangedView"></router-view>
  <PopupAddProject
    :isVisible="isShowAddProjectPopup"
    @onHiddenPopup="closeAddProjectPopup"
  ></PopupAddProject>
  <PopupAddNewJob
    :isVisible="isShowAddNewTask"
    @onHiddenPopup="closePopupAddNewTask"
  ></PopupAddNewJob>
</template>
<script setup>
import TheHeader from "@/views/TheHeader.vue";
import PopupAddProject from "@/components/popup/PopupAddProject.vue";
import PopupAddNewJob from "@/components/popup/PopupAddNewJob.vue";
import { ref } from "vue";

const isShowAddProjectPopup = ref(false);
const isShowAddNewTask = ref(false);
const view = ref("");

function onChangedView(string) {
  view.value = string;
}

/**
 * Mở popup thêm mới dự án
 */
function onOpenAddProject() {
  isShowAddProjectPopup.value = true;
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
function onOpenPopupAddNewTask() {
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
