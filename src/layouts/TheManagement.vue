<template>
  <TheHeader
    :view="view"
    :user="currentUser"
    :reloadListProject="reloadListProject"
    @onOpenAddNewProject="onOpenAddProject"
    @onOpenAddNewTask="onOpenPopupAddNewTask"
  ></TheHeader>
  <router-view
    :reloadListProject="reloadListProject"
    :currentUser="currentUser"
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
    @alertNoProject="alertNoProject"
  ></PopupAddNewJob>
  <PopupDetailTask
    :isVisible="isShowDetailPopup"
    :taskSelectedID="taskSelectedID"
    @reloadData="reloadData"
    @closePopup="
      () => {
        isShowDetailPopup = false;
        taskSelectedID = '';
      }
    "
  ></PopupDetailTask>
  <PopupNotifyCation
  :isVisible="showNotifyPopup"
  :text="t('NoProject')"
  @confirm="()=>{
    showNotifyPopup = false
  }"
  @onHiddenPopup="()=>{
    showNotifyPopup = false
  }"
  >

  </PopupNotifyCation>
</template>
<script setup>
import TheHeader from "@/views/TheHeader.vue";
import PopupAddProject from "@/components/popup/PopupAddProject.vue";
import PopupNotifyCation from "@/components/popup/PopupNotifycation.vue"
import PopupAddNewJob from "@/components/popup/PopupAddNewJob.vue";
import { onBeforeMount, ref, watch } from "vue";
import { methodStatus } from "@/commons/contants/method-status";
import { getUserInfor, isNullOrEmpty } from "@/utils/functions/commonFns.js";
import PopupDetailTask from "@/components/popup/PopupDetailTask.vue";
import Users from "@/commons/models/Users";
import router from "@/router/index.js";
const isShowDetailPopup = ref(false);
const isShowAddProjectPopup = ref(false);
const isShowAddNewTask = ref(false);
const view = ref("");
const reloadListProject = ref(false);
const projectFormMethod = ref(0);
const taskFormMethod = ref(0);
const taskSelectedID = ref();
const showNotifyPopup = ref(false);
import i18n from "@/plugins/i18n";
var { t } = i18n.global;
function onChangedView(string) {
  view.value = string;
}
const currentUser = ref(new Users());

onBeforeMount(async () => {
  // console.log(this.$store.getters.user);
  const id = localStorage.getItem("currentUserID");
  if (id && !isNullOrEmpty(id)) {
    currentUser.value = await getUserInfor(id);
    if(currentUser.value.DeleteType == 1|| currentUser.value.Status == 0|| currentUser.value.Status == 2){
      router.push("/permistion");
    }
  } else {
    router.push("/login");
  }
});

watch(()=>currentUser.value.DeleteType,()=>{
  if(currentUser.value.DeleteType == 1|| currentUser.value.Status == 0|| currentUser.value.Status == 2){
      router.push("/permistion");
    }
},{immediate:true})

/**
 * Báo chưa có dự án
 */
function alertNoProject(){
  showNotifyPopup.value = true
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
    isShowDetailPopup.value = true;
    taskSelectedID.value = id;
  } else {
    taskFormMethod.value = methodStatus.Add;
    isShowAddNewTask.value = true;
  }
}

/**
 * Đóng popup thêm mới công việc
 */
function closePopupAddNewTask() {
  isShowAddNewTask.value = false;
  taskSelectedID.value = "";
}
</script>
<style lang="scss"></style>
