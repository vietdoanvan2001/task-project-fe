<template lang="">
  <div>
    <BasePopup
      :width="620"
      :title="
        method == methodStatus.Add
          ? t('AddNewProjectTitle')
          : t('UpdateProjectTitle')
      "
      :isVisible="isVisible"
      @onHidden="closePopup"
    >
      <template v-slot:content>
        <div class="popup-content">
          <div class="row">
            <div class="row-item">
              <div class="item-label">
                {{ t("ProjectName") }}<span class="bold error-color">*</span>
              </div>
              <div class="item-content d-flex">
                <div
                  class="select-icon"
                  id="selectIcon"
                  @click="showIconSelection"
                >
                  <div
                    class="background-selected"
                    :class="`project-background-${backgroundIndex}`"
                  ></div>
                  <div
                    class="icon-selected"
                    :class="`white-project-icon-${iconIndex}`"
                  ></div>
                </div>
                <BaseTextBox
                  class="flex-1"
                  :placeHolder="t('ProjectName')"
                  :height="38"
                  :isForm="true"
                  :fieldName="t('ProjectName')"
                  :focusWhenReady="true"
                  :errorMessage="projectData.NameErrorMsg"
                  :value="
                    selectedProject && selectedProject.projectName
                      ? selectedProject.projectName
                      : ''
                  "
                  @onFocusIn="
                    () => {
                      projectData.NameErrorMsg = '';
                    }
                  "
                  @onValueChanged="
                    (event) => {
                      projectData.ProjectName = event;
                    }
                  "
                ></BaseTextBox>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="row-item flex-1 mr-px-16">
              <div class="item-label">
                {{ t("FromDate") }}<span class="bold error-color">*</span>
              </div>
              <div class="item-content">
                <BaseDateBox
                  :height="38"
                  :placeholder="t('FromDate')"
                  :fieldName="t('ToDateFieldName')"
                  :errorMessage="projectData.StartDateErrorMsg"
                  :value="
                    selectedProject && selectedProject.startDate
                      ? selectedProject.startDate
                      : ''
                  "
                  @onFocusIn="
                    () => {
                      projectData.StartDateErrorMsg = '';
                    }
                  "
                  @onValueChanged="
                    (event) => {
                      projectData.StartDate = event;
                    }
                  "
                ></BaseDateBox>
              </div>
            </div>
            <div class="row-item flex-1">
              <div class="item-label">
                {{ t("ToDate") }}<span class="bold error-color">*</span>
              </div>
              <div class="item-content">
                <BaseDateBox
                  :height="38"
                  :placeholder="t('ToDate')"
                  :fieldName="t('EndDateFieldName')"
                  :errorMessage="projectData.EndDateErrorMsg"
                  :value="
                    selectedProject && selectedProject.endDate
                      ? selectedProject.endDate
                      : ''
                  "
                  @onFocusIn="
                    () => {
                      projectData.EndDateErrorMsg = '';
                    }
                  "
                  @onValueChanged="
                    (event) => {
                      projectData.EndDate = event;
                    }
                  "
                ></BaseDateBox>
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
                    selectedProject && selectedProject.description
                      ? selectedProject.description
                      : ''
                  "
                  @onValueChanged="
                    (event) => {
                      projectData.Description = event;
                    }
                  "
                ></BaseTextArea>
              </div>
            </div>
          </div>
          <div class="row" v-if="method == methodStatus.Add">
            <div class="row-item">
              <div
                class="item-label d-flex align-items-center justify-content-between"
              >
                {{ t("Member") }}
                <div
                  class="d-flex center-center pointer"
                  @click="
                    () => {
                      isShowAddMemberPopup = true;
                    }
                  "
                >
                  <div class="add-member-icon mr-px-4"></div>
                  <div class="primary-color">{{ t("AddMember") }}</div>
                </div>
              </div>
              <div class="wrap-item" v-if="listAssignee.length">
                <div
                  class="item-content"
                  v-for="(item, index) in listAssignee"
                  :key="index"
                >
                  <div
                    class="d-flex align-items-center justify-content-between pd-px-8"
                  >
                    <div class="d-flex align-items-center">
                      <div
                        class="avatar-32 bold"
                        :style="{
                          backgroundColor: item.background,
                          color: '#ffffff',
                        }"
                      >
                        {{ getAvatar(item).Text }}
                      </div>
                      <div class="ml-px-8">
                        <div class="bold">{{ item.fullName }}</div>
                        <div>{{ item.email }}</div>
                      </div>
                    </div>
                    <div class="d-flex align-items-center">
                      <PopoverSelectList
                        :width="224"
                        :title="t('SelectStatus')"
                        :listData="listDataSelect"
                        :selectedItem="
                          projectData.ListAssigneeClone[index].Role
                        "
                        :target="`target-${index}`"
                        @onValueChanged="
                          (selected) => {
                            projectData.ListAssigneeClone[index].Role =
                              selected;
                          }
                        "
                      ></PopoverSelectList>
                      <div
                        class="delete-icon ml-px-24 pointer"
                        @click="deleteAssignee(index)"
                      ></div>
                    </div>
                  </div>
                </div>
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
            @onClick="onCancelPopupForm"
          ></BaseButton>
          <BaseButton
            :text="t('Save')"
            :type="ButtonType.PriButton"
            :height="40"
            @onClick="onSavePopupForm"
          ></BaseButton>
        </div>
      </template>
    </BasePopup>
  </div>

  <!-- popover chọn icon dự án -->
  <BasePopover
    :target="'selectIcon'"
    :isVisible="isShowIconSelection"
    @onHidden="
      () => {
        isShowIconSelection = false;
      }
    "
  >
    <template v-slot:content>
      <div class="icon-select-area">
        <div class="icon mr-px-12">
          <div class="bold pb-px-8">{{ t("Icon") }}</div>
          <div class="d-flex flex-wrap mt-px-16">
            <div v-for="index in 15" :key="index" class="wrap-icon">
              <div
                class="icon-background"
                :class="
                  index == iconIndex
                    ? `project-background-${backgroundIndex}`
                    : ''
                "
              >
                <div
                  :class="
                    index == iconIndex
                      ? `white-project-icon-${index}`
                      : `project-icon-${index}`
                  "
                  class="icon-content pointer"
                  @click="
                    () => {
                      iconIndex = index;
                    }
                  "
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="color">
          <div class="bold">{{ t("Color") }}</div>
          <div class="d-flex flex-wrap mt-px-16">
            <div v-for="index in 9" :key="index" class="wrap-background">
              <div
                class="icon-background"
                :class="`project-background-${index}`"
                @click="
                  () => {
                    backgroundIndex = index;
                  }
                "
              >
                <div class="tick-icon" v-if="index == backgroundIndex"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BasePopover>

  <!-- popup thêm thành viên -->
  <PopupAddNewMember
    v-if="isShowAddMemberPopup"
    :isVisible="isShowAddMemberPopup"
    :listSelected="listAssignee"
    @onChangedMember="onChangedMember"
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
import { AuthorizationSelection } from "@/commons/contants/authorization-selection.js";
import PopoverSelectList from "@/components/popover/PopoverSelectList.vue";
import { getUsersByListID } from "@/apis/user-service/user-service.js";
import {
  addNewProject,
  getProjectByID,
  updateProject,
} from "@/apis/project-service/project-service.js";
import Project from "@/commons/models/Project.js";
import { ref, watch } from "vue";
import i18n from "@/plugins/i18n";
import Users from "@/commons/models/Users";
import { isNullOrEmpty, getAvatar } from "@/utils/functions/commonFns";
import { responseStatus } from "@/commons/enums/api-response-status";
import { showToast } from "@/utils/toast-message/toastMessage";
import { useRoute } from "vue-router";
import { methodStatus } from "@/commons/contants/method-status";
var { t } = i18n.global;

const route = useRoute();
const isShowIconSelection = ref(false);
const isShowAddMemberPopup = ref(false);
const iconIndex = ref(1);
const backgroundIndex = ref(1);
const listDataSelect = ref(AuthorizationSelection);
const selectedListAssignee = ref();
const selectedProject = ref(new Project());
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  method: Number,
});
const emit = defineEmits();
const allowSave = ref(false);
const projectData = ref(new Project());
const listAssignee = ref(Array < Users > []);
const listAssigneeID = ref([]);

watch(
  () => props.method,
  async () => {
    if (props.method == methodStatus.Update) {
      await getProject(route.query.ProjectID);
      const arr = selectedProject.value.background?.split("-");
      const arr1 = selectedProject.value.icon?.split("-");
      iconIndex.value = arr1[arr1.length - 1];
      backgroundIndex.value = arr[arr.length - 1];
    }
  },
  { immediate: true }
);

/**
 * Lấy nhân viên theo listID
 */
async function getListUsers(params) {
  try {
    const res = await getUsersByListID(params);
    if (res && res.status && res.status == responseStatus.Success && res.data) {
      listAssignee.value = res.data;
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Lấy dự án theo id
 * @param {*} id
 */
async function getProject(id) {
  try {
    const res = await getProjectByID(id);
    if (res && res.status && res.status == responseStatus.Success && res.data) {
      selectedProject.value = res.data;
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    showToast.error(t("Error"));
    console.log(error);
  }
}

/**
 * Xóa người liên quan
 * @param {*} index
 */
function deleteAssignee(index) {
  if (listAssignee && listAssignee.value.length && index > -1) {
    listAssignee.value.splice(index, 1);
    projectData.value.ListAssigneeClone.splice(index, 1);
  }
}

/**
 * Thay đổi người tham gia công việc
 */
function onChangedMember(members, role) {
  if (members && members.length) {
    listAssignee.value = members;
    projectData.value.ListAssigneeClone = [];
    listAssignee.value.forEach((element) => {
      projectData.value.ListAssigneeClone.push({ ID: element.id, Role: role });
    });
  }
}

/**
 * Hiển thị popover chọn item
 */
function showIconSelection() {
  isShowIconSelection.value = !isShowIconSelection.value;
}

/**
 * Đóng popup
 */
function closePopup() {
  listAssignee.value = [];
  emit("onHiddenPopup");
}

/**
 * Hủy form
 */
function onCancelPopupForm() {
  closePopup();
}

/**
 * Validate form
 */
function validateForm() {
  allowSave.value = true;
  if (!projectData.value) {
    allowSave.value = false;
    return;
  }
  //Không được để trống
  if (
    !projectData.value.ProjectName ||
    isNullOrEmpty(projectData.value.ProjectName)
  ) {
    projectData.value.NameErrorMsg = t("NotEmpty");
    allowSave.value = false;
  }
  if (!projectData.value.StartDate) {
    projectData.value.StartDateErrorMsg = t("NotEmpty");
    allowSave.value = false;
  }
  if (!projectData.value.EndDate) {
    projectData.value.EndDateErrorMsg = t("NotEmpty");
    allowSave.value = false;
  }
  //ngày bắt đầu không được lớn hơn
  if (
    projectData.value.EndDate &&
    projectData.value.StartDate &&
    projectData.value.EndDate < projectData.value.StartDate
  ) {
    projectData.value.EndDateErrorMsg = t("EndDateWrong");
    allowSave.value = false;
  }
}

/**
 * Xử lý trước khi lưu form
 */
function beforeSaveForm() {
  validateForm();
  if (allowSave.value) {
    projectData.value.Icon = "white-project-icon-" + iconIndex.value;
    projectData.value.Background =
      "project-background-" + backgroundIndex.value;
    const currentUserID = localStorage.getItem("currentUserID");
    projectData.value.ListAssigneeClone
      ? projectData.value.ListAssigneeClone.push({
          ID: currentUserID,
          Role: {
            ID: 0,
            Name: t("Member"),
          },
        })
      : (projectData.value.ListAssigneeClone = [
          {
            ID: currentUserID,
            Role: {
              ID: 0,
              Name: t("Member"),
            },
          },
        ]);
    projectData.value.ListAssignee = JSON.stringify(
      projectData.value.ListAssigneeClone
    );
  }
}

/**
 * Lưu form
 * @param {*} params
 */
async function onSavePopupForm(params) {
  beforeSaveForm();
  if (allowSave.value) {
    try {
      //Thêm mới
      if (props.method == methodStatus.Add) {
        const res = await addNewProject(projectData.value);
        if (res && res.status && res.status == responseStatus.InsertSuccess) {
          showToast.success(t("AddNewProjectSuccess"));
          projectData.value = new Project();
          emit("saveNewProjectSuccess");
          onCancelPopupForm();
        } else {
          showToast.error(t("Error"));
        }
      }
      //Sửa
      else {
        projectData.value.ProjectID = route.query.ProjectID;
        const res = await updateProject(
          route.query.ProjectID,
          projectData.value
        );
        if (res && res.status && res.status == responseStatus.Success) {
          showToast.success(t("UpdateProjectSuccess"));
          projectData.value = new Project();
          emit("saveNewProjectSuccess");
          onCancelPopupForm();
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
</script>
<style lang="scss" scope>
.popup-footer {
  // position: absolute;
  // bottom: 0;
  // right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 24px;
}
.popup-content {
  padding: 0 24px;
  .row {
    display: flex;
    padding-bottom: 16px;
    .row-item {
      width: 100%;
      .item-label {
        font-weight: 600;
        font-size: 15px;
        padding-bottom: 8px;
      }

      .wrap-item {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 0 16px;
        max-height: 200px;
        overflow: auto;
      }
      .item-content {
        width: 100%;
        .assignee-avatar {
          width: 32px;
          height: 32px;
          background-color: aqua;
        }
        .select-icon {
          position: relative;
          height: 40px;
          width: 40px;
          margin-right: 12px;
          border-radius: 8px;
          background-color: #f2f2f2;
          cursor: pointer;

          .background-selected {
            margin-top: 8px;
            margin-left: 8px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
          }

          .icon-selected {
            position: absolute;
            top: 12px;
            left: 12px;
          }
        }
      }
    }
  }
}

.icon-select-area {
  display: flex;
  padding: 24px;
  .icon {
    width: 200px;
    .wrap-icon {
      min-width: 40px;
      min-height: 40px;
      .icon-background {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        position: relative;
      }
      .icon-content {
        position: absolute;
        left: 4px;
        top: 4px;
      }
    }
  }

  .color {
    width: 120px;
    .wrap-background {
      min-width: 40px;
      min-height: 40px;
      padding-top: 8px;
      .icon-background {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        position: relative;

        .tick-icon {
          position: absolute;
          top: 7px;
          left: 5px;
          width: 13px !important;
          height: 9px !important;
          -webkit-mask-image: url("../../assets/images/ICON.svg");
          -webkit-mask-position: -585px -108px;
          -webkit-mask-repeat: no-repeat;
          background-color: var(--app-color-white);
        }
      }
    }
  }
}
</style>
