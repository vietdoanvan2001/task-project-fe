<template lang="">
  <div class="detail-container">
    <BasePopup
      :width="900"
      :isVisible="isVisible"
      :showTitle="false"
      :position="position"
      @onHidden="closePopup"
    >
      <template v-slot:header>
        <div class="detail-header">
          <PopoverTaskProcess
            :id="selectedTask.taskID"
            :process="selectedTask.process"
            @saveNewTaskSuccess="reloadData"
            @onValueChanged="
              (event) => {
                selectedTask.process = event;
              }
            "
          ></PopoverTaskProcess>
          <div class="d-flex align-items-center">
            <div
              class="header-button"
              @click="
                () => {
                  isShowAddNewTask = true;
                }
              "
            >
              <div class="pencil-icon mr-px-4"></div>
              {{ t("Edit") }}
            </div>
            <div
              class="header-button delete-button"
              @click="
                () => {
                  isShowDeleteConfirm = true;
                }
              "
            >
              <div class="white-trash-icon mr-px-4"></div>
              {{ t("Delete") }}
            </div>
            <div class="close-icon pointer" @click="closePopup"></div>
          </div>
        </div>
      </template>
      <template v-slot:content>
        <div class="detail-content">
          <div class="row">
            <div class="row-item">
              <div class="item-label">
                {{ t("TaskName") }}
              </div>
              <div class="item-content d-flex align-items-center">
                <div>
                  {{ selectedTask.taskName }}
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="row-item">
              <div class="item-label">
                {{ t("ProjectName") }}
              </div>
              <div class="item-content d-flex align-items-center">
                <div>
                  {{ selectedTask.projectName }}
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="row-item">
              <div class="item-label">
                {{ t("KanbanName") }}
              </div>
              <div class="item-content d-flex align-items-center">
                <div>
                  {{ selectedTask.columnName }}
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="row-item flex-1 mr-px-64">
              <div class="item-label">
                {{ t("StartDate") }}
              </div>
              <div class="item-content">
                <div>
                  {{
                    selectedTask.startDate
                      ? formatDate(selectedTask.startDate)
                      : ""
                  }}
                </div>
              </div>
            </div>
            <div class="row-item flex-1">
              <div class="item-label">
                {{ t("EndDate") }}
              </div>
              <div class="item-content">
                <div>
                  {{
                    selectedTask.endDate ? formatDate(selectedTask.endDate) : ""
                  }}
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="row-item">
              <div class="item-label">{{ t("AssigneeName") }}</div>
              <div class="item-content">
                <div>
                  {{ selectedTask.assigneeName }}
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="row">
            <div class="row-item">
              <div class="item-label">{{ t("TaskProcess") }}</div>
              <div class="item-content">
                <div>
                  {{ selectedTask.process }}
                </div>
              </div>
            </div>
          </div> -->
          <div class="row">
            <div class="row-item">
              <div class="item-label">{{ t("Description") }}</div>
              <div class="item-content">
                <div>
                  {{ selectedTask.description }}
                </div>
              </div>
            </div>
          </div>
          <div class="detail-funtion">
            <div
              class="method-item mr-px-24"
              :class="selectedMethod == 1 ? 'active-method' : ''"
              @click="selectedMethod = 1"
            >
              <div
                class="mt-px-2 mr-px-8"
                :class="
                  selectedMethod == 1 ? 'primary-comment-icon' : 'comment-icon'
                "
              ></div>
              {{ t("Comment") }}
            </div>
            <div
              class="method-item"
              :class="selectedMethod == 2 ? 'active-method' : ''"
              @click="selectedMethod = 2"
            >
              <div
                class="mt-px-2 mr-px-8"
                :class="
                  selectedMethod == 2
                    ? 'primary-activity-icon'
                    : 'activity-icon '
                "
              ></div>

              {{ t("Activity") }}
            </div>
          </div>
          <div class="method-content">
            <div class="italic-font d-flex center-center w-100">
              {{ t("FunctionIsBuilding") }}
            </div>
          </div>
        </div>
      </template>
    </BasePopup>
  </div>
  <PopupAddNewJob
    v-if="isShowAddNewTask"
    :isVisible="isShowAddNewTask"
    :method="1"
    :taskSelectedID="taskSelectedID"
    @saveNewTaskSuccess="reloadData"
    @onHiddenPopup="closePopupAddNewTask"
  ></PopupAddNewJob>
  <PopupConfirmDelete
    :text="t('DeleteTaskConfirm')"
    :isVisible="isShowDeleteConfirm"
    @confirmDelete="deleteTaskByID"
    @onHiddenPopup="
      () => {
        isShowDeleteConfirm = false;
      }
    "
  ></PopupConfirmDelete>
</template>
<script setup>
import BasePopup from "../base/BasePopup.vue";
import PopoverTaskProcess from "../popover/PopoverTaskProcess.vue";
import PopoverSelectList from "@/components/popover/PopoverSelectList.vue";
import PopoverChoseProject from "../popover/PopoverChoseProject.vue";
import PopupConfirmDelete from "./PopupConfirmDelete.vue";

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  taskSelectedID: {
    type: Number,
  },
});
import { ref, watch } from "vue";
import i18n from "@/plugins/i18n";
import Task from "@/commons/models/Task";
import { showToast } from "@/utils/toast-message/toastMessage";
import { getTaskByID, deleteTask } from "@/apis/task-service/task-service";
import { responseStatus } from "@/commons/enums/api-response-status";
import { getUserById } from "@/apis/user-service/user-service";
import PopupAddNewJob from "./PopupAddNewJob.vue";
import { formatDate } from "@/utils/functions/commonFns";
var { t } = i18n.global;

const selectedMethod = ref(1);
const isShowAddNewTask = ref(false);
const position = ref({
  my: "right top",
  at: "right top",
});
const selectedTask = ref(new Task());
const selectedAssignee = ref();
const isShowDeleteConfirm = ref(false);

const emit = defineEmits();

watch(
  () => props.taskSelectedID,
  () => {
    if (props.taskSelectedID) {
      getSelectedTask(props.taskSelectedID);
    }
  },
  { immediate: true }
);

/**
 * Xóa công việc
 */
async function deleteTaskByID() {
  try {
    const res = await deleteTask(props.taskSelectedID);
    if (res && res.status && res.status == responseStatus.Success) {
      showToast.success(t("DeleteSucess"));
      reloadData();
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    console.log(error);
    showToast.error(t("Error"));
  }
  isShowDeleteConfirm.value = false;
  closePopup();
}

/**
 * reload dữ liệu
 */
function reloadData() {
  getSelectedTask(props.taskSelectedID);
  emit("reloadData");
}

/**
 * Đóng popup chỉnh sửa
 */
function closePopupAddNewTask() {
  isShowAddNewTask.value = false;
}

/**
 * Lấy công việc theo id
 * @param {} id
 */
async function getSelectedTask(id) {
  try {
    const res = await getTaskByID(id);
    if (res && res.status && res.status == responseStatus.Success && res.data) {
      selectedTask.value = res.data;
    }
    if (
      selectedTask.value.assigneeID &&
      selectedTask.value.assigneeID != "00000000-0000-0000-0000-000000000000"
    ) {
      getUserByID(selectedTask.value.assigneeID);
    }
  } catch (error) {
    console.log(error);
    showToast.error(t("Error"));
  }
}

/**
 * Lấy nhân viên theo id
 * @param {*} id
 */
async function getUserByID(id) {
  if (!id && id == "00000000-0000-0000-0000-000000000000") {
    return;
  }
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
 * Đóng popup
 */
function closePopup() {
  emit("closePopup");
}
</script>
<style lang="scss" scoped>
.detail-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #ccc;
  background: #f1f1f1;

  .header-button {
    height: 36px;
    background-color: #fff;
    min-width: 60px;
    display: flex;
    align-items: center;
    width: fit-content;
    padding: 0 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
    margin-right: 12px;
  }

  .delete-button {
    background-color: var(--app-color-danger);
    color: var(--app-color-white);
    margin-right: 28px;
  }
}
.detail-content {
  height: calc(100vh - 60px);
  padding: 12px 36px 12px 24px;

  .detail-funtion {
    margin-top: 42px;
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    .method-item {
      height: 48px;
      display: flex;
      align-items: center;
      border-bottom: 4px solid transparent;
      font-size: 14px;
      cursor: pointer;
    }

    .active-method {
      font-weight: 600;
      color: var(--app-color-primary);
      border-color: var(--app-color-primary);
    }
  }

  .method-content {
    width: 100%;
    height: fit-content;
    min-height: 400px;
    display: flex;
    align-items: center;
  }

  .row {
    width: 100%;
    display: flex;
    align-items: center;
    min-height: 48px;
    margin-bottom: 8px;
    .row-item {
      width: 100%;
      align-items: center;
      display: flex;

      .item-label {
        min-width: 136px;
        font-weight: 600;
      }

      .item-content {
        width: 100%;
        border-bottom: 1px solid #ccc;
        min-height: 38px;
        padding: 8px 12px;
        max-height: 100px;
        overflow: auto;
      }
    }
    .mr-px-64 {
      margin-right: 52px;
    }
  }
}
</style>
