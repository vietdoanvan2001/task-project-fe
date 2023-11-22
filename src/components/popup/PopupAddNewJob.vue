<template lang="">
  <div>
    <BasePopup
      :width="620"
      :title="
        method == methodStatus.Add ? t('AddNewJob') : t('UpdateTaskTitle')
      "
      :isVisible="isVisible"
      @onHidden="closePopup"
    >
      <template v-slot:content>
        <div class="popup-content">
          <div class="row">
            <div
              class="d-flex align-items-center justify-content-between w-100"
            >
              <div class="d-flex align-items-center">
                <div class="mr-px-16">
                  <PopoverChoseProject
                    :width="300"
                    :target="'popupAddTask'"
                    :dataSource="listProject"
                    :selectedItem="selectedProject"
                    @onSelectedItem="onSelectedProject"
                  ></PopoverChoseProject>
                </div>
                <PopoverSelectList
                  :width="224"
                  :target="'selectStatus'"
                  :title="t('SelectStatus')"
                  :listData="listStatus"
                  :isVisible="showSelectionStatus"
                  :selectedItem="selectedStatus"
                  @onValueChanged="selectStatus"
                  @onHidden="
                    () => {
                      showSelectionStatus = false;
                    }
                  "
                ></PopoverSelectList>
              </div>
              <div class="pl-px-12">
                <PopoverTaskProcess
                  :id="selectedTask.taskID"
                  :process="selectedTask.process"
                  @saveNewTaskSuccess="saveNewTaskSuccess"
                  @onValueChanged="
                    (event) => {
                      selectedTask.process = event;
                    }
                  "
                ></PopoverTaskProcess>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="row-item">
              <div class="item-label">
                {{ t("TaskName") }}<span class="bold error-color">*</span>
              </div>
              <div
                class="item-content d-flex align-items-center"
                @click="showIconSelection"
              >
                <BaseTextBox
                  class="flex-1"
                  :placeHolder="t('TaskName')"
                  :height="38"
                  :isForm="true"
                  :fieldName="t('TaskName')"
                  :focusWhenReady="true"
                  :errorMessage="taskData.TaskNameErrorMsg"
                  :value="
                    selectedTask && selectedTask.taskName
                      ? selectedTask.taskName
                      : ''
                  "
                  @onFocusIn="
                    () => {
                      taskData.TaskNameErrorMsg = '';
                    }
                  "
                  @onValueChanged="
                    (event) => {
                      taskData.TaskName = event;
                    }
                  "
                ></BaseTextBox>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="row-item flex-1 mr-px-16">
              <div class="item-label">
                {{ t("StartDate") }}<span class="bold error-color">*</span>
              </div>
              <div class="item-content">
                <BaseDateBox
                  :height="38"
                  :placeholder="t('StartDate')"
                  :fieldName="t('StartDate')"
                  :errorMessage="taskData.StartDateErrorMsg"
                  :value="
                    selectedTask && selectedTask.startDate
                      ? selectedTask.startDate
                      : ''
                  "
                  @onFocusIn="
                    () => {
                      taskData.StartDateErrorMsg = '';
                    }
                  "
                  @onValueChanged="
                    (event) => {
                      taskData.StartDate = event;
                    }
                  "
                ></BaseDateBox>
              </div>
            </div>
            <div class="row-item flex-1">
              <div class="item-label">
                {{ t("EndDate") }}<span class="bold error-color">*</span>
              </div>
              <div class="item-content">
                <BaseDateBox
                  :height="38"
                  :placeholder="t('EndDate')"
                  :fieldName="t('EndDate')"
                  :errorMessage="taskData.EndDateErrorMsg"
                  :value="
                    selectedTask && selectedTask.endDate
                      ? selectedTask.endDate
                      : ''
                  "
                  @onFocusIn="
                    () => {
                      taskData.EndDateErrorMsg = '';
                    }
                  "
                  @onValueChanged="
                    (event) => {
                      taskData.EndDate = event;
                    }
                  "
                ></BaseDateBox>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="row-item">
              <div class="item-label">{{ t("Implementer") }}</div>
              <div class="item-content">
                <div
                  class="chose-implementer pl-px-16 pointer"
                  id="choseImplementer"
                  @click="showAssigneeSelection"
                >
                  <div class="implementer-icon" v-if="!selectedAssignee"></div>
                  <div
                    class="avatar-32 bold"
                    :style="{
                      backgroundColor: getAvatar(selectedAssignee).Background,
                      color: '#ffffff',
                    }"
                    v-else
                  >
                    {{ getAvatar(selectedAssignee).Text }}
                  </div>
                  <div class="pl-px-8 pr-px-8">
                    <div v-if="!selectedAssignee">
                      {{ t("ChoseImplementer") }}
                    </div>
                    <div v-else>
                      <div class="bold">
                        {{ selectedAssignee.fullName }}
                      </div>
                      <div>
                        {{ selectedAssignee.email }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="row-item">
              <div class="item-label">{{ t("Description") }}</div>
              <div class="item-content">
                <BaseTextArea
                  :placeholder="t('Description')"
                  :value="
                    selectedTask && selectedTask.description
                      ? selectedTask.description
                      : ''
                  "
                  @onValueChanged="
                    (event) => {
                      taskData.Description = event;
                    }
                  "
                ></BaseTextArea>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="popup-footer">
          <BaseButton
            class="mr-px-8"
            :text="t('Cancel')"
            :type="ButtonType.SubButton"
            :height="40"
            @onClick="closePopup"
          ></BaseButton>
          <BaseButton
            :text="t('Save')"
            :type="ButtonType.PriButton"
            :height="40"
            @onClick="saveForm"
          ></BaseButton>
        </div>
      </template>
    </BasePopup>
  </div>

  <PopoverChoseImplementer
    v-if="showSelectionPopup"
    :width="278"
    :target="'choseImplementer'"
    :isVisible="showSelectionPopup"
    :title="t('ChoseImplementer')"
    :searchPlaceHolder="t('MemberSearch')"
    :dataSource="listAssignee"
    @onSelectedItem="selectAssignee"
    @onHidden="
      () => {
        showSelectionPopup = false;
      }
    "
  ></PopoverChoseImplementer>

  <PopupAddNewMember
    :isVisible="isShowAddMemberPopup"
    @onHidden="
      () => {
        isShowAddMemberPopup = false;
      }
    "
  ></PopupAddNewMember>
</template>
<script setup>
import BasePopup from "@/components/base/BasePopup.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseTextBox from "@/components/base/BaseTextbox.vue";
import BaseDateBox from "@/components/base/BaseDateBox.vue";
import BaseTextArea from "@/components/base/BaseTextArea.vue";
import BasePopover from "@/components/base/BasePopover.vue";
import { ButtonType } from "@/commons/contants/button-type";
import PopupAddNewMember from "@/components/popup/PopupAddMember.vue";
import PopoverChoseImplementer from "@/components/popover/PopoverChoseImplementer.vue";
import PopoverSelectList from "@/components/popover/PopoverSelectList.vue";
import PopoverChoseProject from "../popover/PopoverChoseProject.vue";
import { getAllUsers, getUserById } from "@/apis/user-service/user-service.js";
import { getAllProject } from "@/apis/project-service/project-service";
import { getKanbanByProjectID } from "@/apis/kanban-service/kanban-service.js";
import { useRoute } from "vue-router";
import { JobStatus } from "@/commons/contants/job-status.js";
import { onBeforeMount, ref, watch } from "vue";
import i18n from "@/plugins/i18n";
import Project from "@/commons/models/Project";
import Task from "@/commons/models/Task.js";
import { responseStatus } from "@/commons/enums/api-response-status";
import { showToast } from "@/utils/toast-message/toastMessage.js";
import { isNullOrEmpty, getAvatar } from "@/utils/functions/commonFns";
import {
  addNewTask,
  getTaskByID,
  updateTask,
} from "@/apis/task-service/task-service.js";
import { methodStatus } from "@/commons/contants/method-status";
import PopoverTaskProcess from "@/components/popover/PopoverTaskProcess.vue";
import Users from "@/commons/models/Users";
var { t } = i18n.global;

const isShowAddMemberPopup = ref(false);
const showSelectionStatus = ref(false);
const showSelectionPopup = ref(false);
const listProject = ref(Array < Project > []);
const listStatus = ref(JobStatus);
const selectedStatus = ref();
const selectedProject = ref();
const taskData = ref(new Task());
const route = useRoute();
const allowSave = ref(false);
const listAssignee = ref(Array < Users > []);
const selectedAssignee = ref();
const selectedTask = ref(new Task());

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  method: Number,
  taskSelectedID: Number,
});
const emit = defineEmits();

onBeforeMount(async () => {
  selectedStatus.value = listStatus.value[0];
  await getProject();
  if (route.query && route.query.ProjectID) {
    const temp = listProject.value?.find(
      (item) => item.projectId == route.query.ProjectID
    );
    if (temp) {
      selectedProject.value = temp;
    } else {
      selectedProject.value = listProject.value[0];
    }
  } else {
    selectedProject.value = listProject.value[0];
  }
});

watch(
  () => props.method,
  () => {
    if (props.taskSelectedID) {
      getSelectedTask(props.taskSelectedID);
    }
  },
  { immediate: true }
);

watch(
  () => selectedProject.value,
  () => {
    if (selectedProject.value && selectedProject.value.projectId) {
      getKanban(selectedProject.value.projectId);
    }
  },
  { immediate: true }
);

async function getSelectedTask(id) {
  try {
    const res = await getTaskByID(id);
    if (res && res.status && res.status == responseStatus.Success && res.data) {
      selectedTask.value = res.data;
    }
    if (selectedTask.value.assigneeID) {
      getUserByID(selectedTask.value.assigneeID);
    }
  } catch (error) {
    console.log(error);
    showToast.error(t("Error"));
  }
}

async function getUserByID(id) {
  try {
    const res = await getUserById(id);
    if (res && res.status && res.status == responseStatus.Success && res.data) {
      selectedAssignee.value = res.data;
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    console.log(error);
    showToast.error(t("Error"));
  }
}

/**
 * Chọn người đại diện
 */
function selectAssignee(user) {
  if (user) {
    selectedAssignee.value = user;
  }
}

/**
 * mở popover chọn người đại diện
 */
async function showAssigneeSelection() {
  await getAllAssignee();
  showSelectionPopup.value = true;
}

async function getAllAssignee() {
  try {
    const result = await getAllUsers();
    if (
      result &&
      result.status &&
      result.status == responseStatus.Success &&
      result.data
    ) {
      listAssignee.value = result.data;
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    console.log(error);
    showToast.error(t("Error"));
  }
}

/**
 * validate form
 */
function validateForm() {
  allowSave.value = true;
  if (!taskData.value) {
    allowSave.value = false;
    return;
  }
  //Không được để trống
  if (!taskData.value.TaskName || isNullOrEmpty(taskData.value.TaskName)) {
    taskData.value.TaskNameErrorMsg = t("NotEmpty");
    allowSave.value = false;
  }
  if (!taskData.value.StartDate) {
    taskData.value.StartDateErrorMsg = t("NotEmpty");
    allowSave.value = false;
  }
  if (!taskData.value.EndDate) {
    taskData.value.EndDateErrorMsg = t("NotEmpty");
    allowSave.value = false;
  }
  //ngày bắt đầu không được lớn hơn
  if (
    taskData.value.EndDate &&
    taskData.value.StartDate &&
    taskData.value.EndDate < taskData.value.StartDate
  ) {
    taskData.value.EndDateErrorMsg = t("EndDateWrong");
    allowSave.value = false;
  }
}

/**
 * Xử lý trước khi lưu
 */
function onBeforeSave() {
  validateForm();
  if (allowSave.value) {
    taskData.value.KanbanId = selectedStatus.value?.KanbanID;
    taskData.value.ProjectId = selectedProject.value?.projectId;
    if (selectedAssignee.value) {
      taskData.value.AssigneeId = selectedAssignee.value.id;
      taskData.value.AssigneeEmail = selectedAssignee.value.email;
      taskData.value.AssigneeName = selectedAssignee.value.fullName;
    }
  }
}

function saveNewTaskSuccess() {
  emit("saveNewTaskSuccess");
}

/**
 * Lưu form thêm mới
 */
async function saveForm() {
  onBeforeSave();
  if (allowSave.value) {
    try {
      //Thêm mới
      if (props.method == methodStatus.Add) {
        const res = await addNewTask(taskData.value);
        if (res && res.status && res.status == responseStatus.InsertSuccess) {
          showToast.success(t("AddNewTaskSuccess"));
          saveNewTaskSuccess();
          closePopup();
        } else {
          showToast.error(t("Error"));
        }
      }
      //Sửa
      else {
        taskData.value.TaskID = props.taskSelectedID;
        taskData.value.Process = selectedTask.value.process;
        console.log(taskData.value);
        const res = await updateTask(taskData.value.TaskID, taskData.value);
        if (res && res.status && res.status == responseStatus.Success) {
          showToast.success(t("UpdateTaskSuccess"));
          saveNewTaskSuccess();
          closePopup();
        } else {
          showToast.error(t("Error"));
        }
      }
    } catch (error) {
      console.log(error);
      showToast.error(t("Error"));
    }
  }
}

/**
 * Chọn dự án
 * @param {*} item
 */
function onSelectedProject(item) {
  selectedProject.value.projectId = item.projectId;
  getKanban(selectedProject.value.projectId);
}

/**
 * Chọn trạng thái
 * @param {} item
 */
function selectStatus(item) {
  console.log(item);
  if (item) {
    selectedStatus.value.KanbanID = item.KanbanID;
  }
}

/**
 * Lấy các cột kanban theo project id
 */
async function getKanban(projectID) {
  try {
    const res = await getKanbanByProjectID(projectID);
    if (res && res.status == responseStatus.Success && res.data) {
      listStatus.value = res.data;
      if (selectedTask.value && selectedTask.value.kanbanID) {
        selectedStatus.value = listStatus.value.find(
          (item) => item.KanbanID == selectedTask.value.kanbanID
        );
      } else {
        selectedStatus.value = listStatus.value[0];
      }
    } else {
      console.log("error");
    }
  } catch (error) {
    console.log(error);
    showToast.error(t("Error"));
  }
}

/**
 * Lấy toàn bộ phòng ban
 */
async function getProject() {
  try {
    const res = await getAllProject();
    if (res && res.status && res.status == responseStatus.Success && res.data) {
      listProject.value = res.data;
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    console.log(error);
    showToast.error(t("Error"));
  }
}

/**
 * Đóng popup
 */
function closePopup() {
  emit("onHiddenPopup");
}
</script>
<style lang="scss" scope>
.popup-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 24px;
}
.popup-content {
  .chose-implementer {
    width: 278px;
    height: 74px;
    background-color: #f5f5f5;
    border-radius: 8px;
    display: flex;
    align-items: center;
  }
  .project-name {
    max-width: 190px;
    height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .status-name {
    max-width: 190px;
    height: 18px;
  }
}
</style>
