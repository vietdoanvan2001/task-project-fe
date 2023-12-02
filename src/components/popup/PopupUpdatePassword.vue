<template lang="">
  <div>
    <BasePopup
      :width="480"
      :title="t('UpdatePassword')"
      :isVisible="isVisible"
      @onHidden="closePopup"
    >
      <template v-slot:content>
        <div class="popup-content">
          <div class="error-area" v-if="serviceError">
            <div class="icon-false"></div>
            <div class="error-area-text">
              {{ serviceError }}
            </div>
          </div>
          <div class="row">
            <div class="row-item">
              <div class="item-label">
                {{ t("OldPassword") }}<span class="bold error-color">*</span>
              </div>
              <div
                class="item-content d-flex align-items-center"
                @click="showIconSelection"
              >
                <BaseTextBox
                  class="flex-1"
                  :placeHolder="t('OldPassword')"
                  :height="38"
                  :isForm="true"
                  :fieldName="t('OldPassword')"
                  :mode="'password'"
                  :focusWhenReady="true"
                  :errorMessage="memberData.OldPasswordErrorMsg"
                  @onFocusIn="
                    () => {
                      memberData.OldPasswordErrorMsg = '';
                    }
                  "
                  @onValueChanged="
                    (event) => {
                      memberData.OldPassword = event;
                    }
                  "
                ></BaseTextBox>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="row-item">
              <div class="item-label">
                {{ t("NewPassword") }}<span class="bold error-color">*</span>
              </div>
              <div
                class="item-content d-flex align-items-center"
                @click="showIconSelection"
              >
                <BaseTextBox
                  class="flex-1"
                  :placeHolder="t('NewPassword')"
                  :height="38"
                  :isForm="true"
                  :mode="'password'"
                  :fieldName="t('NewPassword')"
                  :focusWhenReady="true"
                  :errorMessage="memberData.NewPasswordErrorMsg"
                  @onFocusIn="
                    () => {
                      memberData.NewPasswordErrorMsg = '';
                    }
                  "
                  @onValueChanged="
                    (event) => {
                      memberData.NewPassword = event;
                    }
                  "
                ></BaseTextBox>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="row-item">
              <div class="item-label">
                {{ t("PrePassword") }}<span class="bold error-color">*</span>
              </div>
              <div
                class="item-content d-flex align-items-center"
                @click="showIconSelection"
              >
                <BaseTextBox
                  class="flex-1"
                  :placeHolder="t('PrePassword')"
                  :height="38"
                  :isForm="true"
                  :fieldName="t('PrePassword')"
                  :mode="'password'"
                  :focusWhenReady="true"
                  :errorMessage="memberData.PrePasswordErrorMsg"
                  @onFocusIn="
                    () => {
                      memberData.PrePasswordErrorMsg = '';
                    }
                  "
                  @onValueChanged="
                    (event) => {
                      memberData.PrePassword = event;
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
import { updateUserPass } from "@/apis/user-service/user-service.js";
import { methodStatus } from "@/commons/contants/method-status";
import PopoverTaskProcess from "@/components/popover/PopoverTaskProcess.vue";
import Users from "@/commons/models/Users";
var { t } = i18n.global;

const serviceError = ref("");
const allowSave = ref(false);
const memberData = ref({});

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  user: Users,
});
const emit = defineEmits();

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
  if (
    !memberData.value.PrePassword ||
    isNullOrEmpty(memberData.value.PrePassword)
  ) {
    memberData.value.PrePasswordErrorMsg = t("NotEmpty");
    allowSave.value = false;
  } else if (memberData.value.PrePassword.length < 8) {
    memberData.value.PrePasswordErrorMsg = t("MinLength8");
    allowSave.value = false;
  }

  if (
    !memberData.value.OldPassword ||
    isNullOrEmpty(memberData.value.OldPassword)
  ) {
    memberData.value.OldPasswordErrorMsg = t("NotEmpty");
    allowSave.value = false;
  } else if (memberData.value.OldPassword.length < 8) {
    memberData.value.OldPasswordErrorMsg = t("MinLength8");
    allowSave.value = false;
  }

  if (
    !memberData.value.NewPassword ||
    isNullOrEmpty(memberData.value.NewPassword)
  ) {
    memberData.value.NewPasswordErrorMsg = t("NotEmpty");
    allowSave.value = false;
  } else if (memberData.value.NewPassword.length < 8) {
    memberData.value.NewPasswordErrorMsg = t("MinLength8");
    allowSave.value = false;
  }

  //Xác nhận mật khẩu
  if (
    memberData.value.PrePassword &&
    memberData.value.NewPassword &&
    !isNullOrEmpty(memberData.value.PrePassword) &&
    !isNullOrEmpty(memberData.value.NewPassword) &&
    memberData.value.NewPassword != memberData.value.PrePassword
  ) {
    memberData.value.PrePasswordErrorMsg = t("ErrorNotMatch");
    allowSave.value = false;
  }
}

/**
 * Xử lý trước khi lưu
 */
function beforeSave() {
  serviceError.value = "";
  validateForm();
}

/**
 * Lưu form
 */
async function saveForm() {
  beforeSave();
  if (!allowSave.value) {
    return;
  }
  const param = {
    Id: props.user.id,
    UserName: props.user.email,
    oldPassword: memberData.value.OldPassword,
    newPassword: memberData.value.NewPassword,
  };
  try {
    const res = await updateUserPass(param);
    if (res && res.status && res.status == responseStatus.Success) {
      showToast.success(t("UpdatePasswordSuccess"));
      closePopup();
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.userMsg) {
      serviceError.value = error.response.data.userMsg;
    } else {
      console.log(error);
      showToast.error(t("Error"));
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
