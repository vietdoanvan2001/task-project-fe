<template lang="">
  <div>
    <BasePopup
      :width="480"
      :title="method == methodStatus.Add ? t('AddNewMember') : t('EditMember')"
      :isVisible="isVisible"
      @onHidden="closePopup"
    >
      <template v-slot:content>
        <div class="popup-content">
          <div class="error-area" v-if="serviceError && serviceError.length">
            <div class="icon-false"></div>
            <div class="error-area-text">
              <div v-for="(item, index) in serviceError" :key="index">
                {{ t(item.errorField) + " " + item.userMsg + "!" }}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="row-item">
              <div class="item-label">
                {{ t("FullName") }}<span class="bold error-color">*</span>
              </div>
              <div
                class="item-content d-flex align-items-center"
                @click="showIconSelection"
              >
                <BaseTextBox
                  class="flex-1"
                  :placeHolder="t('FullName')"
                  :height="38"
                  :isForm="true"
                  :fieldName="t('FullName')"
                  :focusWhenReady="true"
                  :errorMessage="memberData.FullNameErrorMsg"
                  :value="
                    selectedMember && selectedMember.fullName
                      ? selectedMember.fullName
                      : ''
                  "
                  @onFocusIn="
                    () => {
                      memberData.FullNameErrorMsg = '';
                    }
                  "
                  @onValueChanged="
                    (event) => {
                      memberData.FullName = event;
                    }
                  "
                ></BaseTextBox>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="row-item">
              <div class="item-label">
                {{ t("Email") }}<span class="bold error-color">*</span>
              </div>
              <div
                class="item-content d-flex align-items-center"
                @click="showIconSelection"
              >
                <BaseTextBox
                  class="flex-1"
                  :placeHolder="t('Email')"
                  :height="38"
                  :isForm="true"
                  :fieldName="t('Email')"
                  :focusWhenReady="true"
                  :errorMessage="memberData.EmailErrorMsg"
                  :value="
                    selectedMember && selectedMember.email
                      ? selectedMember.email
                      : ''
                  "
                  @onFocusIn="
                    () => {
                      memberData.EmailErrorMsg = '';
                    }
                  "
                  @onValueChanged="
                    (event) => {
                      memberData.Email = event;
                    }
                  "
                ></BaseTextBox>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="row-item">
              <div class="item-label">
                {{ t("PhoneNumber") }}<span class="bold error-color">*</span>
              </div>
              <div
                class="item-content d-flex align-items-center"
                @click="showIconSelection"
              >
                <BaseTextBox
                  class="flex-1"
                  :placeHolder="t('PhoneNumber')"
                  :height="38"
                  :isForm="true"
                  :fieldName="t('PhoneNumber')"
                  :focusWhenReady="true"
                  :errorMessage="memberData.PhoneNumberErrorMsg"
                  :value="
                    selectedMember && selectedMember.phoneNumber
                      ? selectedMember.phoneNumber
                      : ''
                  "
                  @onFocusIn="
                    () => {
                      memberData.PhoneNumberErrorMsg = '';
                    }
                  "
                  @onValueChanged="
                    (event) => {
                      memberData.PhoneNumber = event;
                    }
                  "
                ></BaseTextBox>
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
import {
  addNewUser,
  getAllUsers,
  getUserById,
  updateUserInfor,
} from "@/apis/user-service/user-service.js";
import { getAllProject } from "@/apis/project-service/project-service";
import { useRoute } from "vue-router";
import { JobStatus } from "@/commons/contants/job-status.js";
import { onBeforeMount, ref, watch } from "vue";
import i18n from "@/plugins/i18n";
import Project from "@/commons/models/Project";
import Task from "@/commons/models/Task.js";
import { responseStatus } from "@/commons/enums/api-response-status";
import { showToast } from "@/utils/toast-message/toastMessage.js";
import {
  isNullOrEmpty,
  getAvatar,
  isEmailValid,
  containsOnlyNumbers,
  getRandomColor,
} from "@/utils/functions/commonFns";
import {
  addNewTask,
  getTaskByID,
  updateTask,
} from "@/apis/task-service/task-service.js";
import { methodStatus } from "@/commons/contants/method-status";
import PopoverTaskProcess from "@/components/popover/PopoverTaskProcess.vue";
import Users from "@/commons/models/Users";
import ServiceError from "@/commons/models/ServiceError";
var { t } = i18n.global;

const serviceError = ref(Array < ServiceError > []);
const allowSave = ref(false);
const memberData = ref(new Users());
const selectedMember = ref(new Users());
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  method: Number,
  taskSelectedID: Number,
});
const emit = defineEmits();

watch(
  () => props.taskSelectedID,
  () => {
    if (props.taskSelectedID && !isNullOrEmpty(props.taskSelectedID)) {
      getUser(props.taskSelectedID);
    }
  },
  { immediate: true }
);

/**
 * Lấy người dùng theo id
 * @param {} id
 */
async function getUser(id) {
  try {
    const res = await getUserById(id);
    if (res && res.status && res.status == responseStatus.Success && res.data) {
      selectedMember.value = res.data;
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    console.log(error);
    showToast.error(t("Error"));
  }
}

/**
 * validate
 */
function validateForm() {
  allowSave.value = true;
  if (!memberData.value) {
    allowSave.value = false;
    return;
  }
  //Không được để trống
  if (!memberData.value.FullName || isNullOrEmpty(memberData.value.FullName)) {
    memberData.value.FullNameErrorMsg = t("NotEmpty");
    allowSave.value = false;
  }
  if (!memberData.value.Email || isNullOrEmpty(memberData.value.Email)) {
    memberData.value.EmailErrorMsg = t("NotEmpty");
    allowSave.value = false;
  }
  if (
    !memberData.value.PhoneNumber ||
    isNullOrEmpty(memberData.value.PhoneNumber)
  ) {
    memberData.value.PhoneNumberErrorMsg = t("NotEmpty");
    allowSave.value = false;
  }

  //Định dạng mail
  if (
    memberData.value.Email &&
    !isNullOrEmpty(memberData.value.Email) &&
    !isEmailValid(memberData.value.Email)
  ) {
    memberData.value.EmailErrorMsg = t("WrongFormat");
    allowSave.value = false;
  }

  //Định dạng sđt
  if (
    memberData.value.PhoneNumber &&
    !isNullOrEmpty(memberData.value.PhoneNumber) &&
    !containsOnlyNumbers(memberData.value.PhoneNumber)
  ) {
    memberData.value.PhoneNumberErrorMsg = t("WrongFormat");
    allowSave.value = false;
  }
}

/**
 * Xử lý trước khi lưu
 */
function beforeSave() {
  serviceError.value = [];
  validateForm();
  if (allowSave.value) {
    memberData.value.Password = "123456";
    memberData.value.Status = 1;
    memberData.value.Background = getRandomColor();
    memberData.value.PrePassword = "123456";
  }
}

/**
 * Lưu form
 */
async function saveForm() {
  beforeSave();
  if (!allowSave.value) {
    return;
  }
  if (props.method == methodStatus.Add) {
    try {
      const res = await addNewUser(memberData.value);
      if (res && res.status && res.status == responseStatus.InsertSuccess) {
        showToast.success(t("AddNewMemberSuccess"));
        emit("reloadData");
        closePopup();
      } else {
        showToast.error(t("Error"));
      }
    } catch (error) {
      console.log(error);
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.length
      ) {
        serviceError.value = error.response.data;
      } else {
        showToast.error(t("Error"));
      }
    }
  } else {
    try {
      memberData.value.Id = props.taskSelectedID;
      const res = await updateUserInfor(props.taskSelectedID, memberData.value);
      if (res && res.status && res.status == responseStatus.Success) {
        showToast.success(t("EditMemberSuccess"));
        emit("reloadData");
        closePopup();
      } else {
        showToast.error(t("Error"));
      }
    } catch (error) {
      console.log(error);
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.length
      ) {
        serviceError.value = error.response.data;
      } else {
        showToast.error(t("Error"));
      }
    }
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
  .error-area {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    border: 1px solid var(--app-color-danger);
    border-radius: 4px;
    padding: 8px 12px;
    background-color: #fff9fa;
    .error-area-text {
      margin-top: 2px;
      margin-left: 8px;
      font-size: 12px;
      color: var(--app-color-danger);
    }
  }
}
</style>
