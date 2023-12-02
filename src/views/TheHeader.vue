<template lang="">
  <div class="header-class d-flex align-items-center justify-content-between">
    <div
      class="d-flex align-items-center pointer"
      v-if="
        view == RouterName.DashBoard ||
        route.fullPath == '/user-management' ||
        route.fullPath == '/report' ||
        route.fullPath == '/permistion'
      "
      @click="backToHome"
    >
      <div class="app-icon ml-px-40"></div>
      <div class="app-name">{{ t("Task") }}</div>
      <div class="report-text" v-if="route.fullPath == '/report'">
        {{ t("Report") }}
      </div>
    </div>
    <div
      class="d-flex align-items-center"
      v-if="
        view == RouterName.TheProject &&
        route.fullPath != '/user-management' &&
        route.fullPath != '/report' &&
        route.fullPath != '/permistion'
      "
    >
      <div
        class="home-icon ml-px-40 mr-px-24 pointer"
        @click="backToHome"
      ></div>
      <div class="project-infor">
        <PopoverChoseProject
          :width="300"
          :target="'theHeader'"
          :maxWidthText="120"
          :dataSource="listProject"
          :selectedItem="selectedProject"
          @onSelectedItem="onSelectedProject"
        ></PopoverChoseProject>
        <div
          class="setting-icon ml-px-24 mr-px-8 pointer"
          id="projectSetting"
          @click="showProjectSettingSelection"
        ></div>
        <BasePopover
          v-if="isShowProjectSetting"
          :isVisible="isShowProjectSetting"
          :target="'projectSetting'"
          :width="280"
          @onHidden="
            () => {
              isShowProjectSetting = false;
            }
          "
        >
          <template v-slot:content>
            <div class="setting-selection">
              <div
                class="setting-item"
                v-for="(item, index) in settingSelection"
                :key="index"
                @click="onSelectSettingItem(item)"
              >
                <div :class="item.Icon" class="mr-px-12"></div>
                {{ item.Text }}
              </div>
            </div>
          </template>
        </BasePopover>
      </div>
      <div v-for="(item, index) in TheProjectTab" :key="index">
        <div
          class="tab-item"
          :class="index + 1 == selectedTab ? 'tab-underline' : ''"
          @click="selectTab(item)"
        >
          {{ item.Name }}
        </div>
      </div>
    </div>
    <div class="d-flex align-items-center">
      <BaseButton
        v-if="
          route.fullPath != '/user-management' &&
          route.fullPath != '/permistion'
        "
        class="add-button mr-px-32"
        :type="ButtonType.AddButton"
        :text="t('AddNewTask')"
        @itemSelected="onOpenAddNewProject(methodStatus.Add)"
        @onClick="onOpenAddNewTask"
      ></BaseButton>
      <div v-if="!user">Đăng nhập|Đăng ký</div>
      <PopoverUserInfor :user="user" v-else></PopoverUserInfor>
    </div>
  </div>
  <PopupConfirmDelete
    :text="t('DeleteProjectConfirm')"
    :isVisible="isShowDeleteConfirm"
    @confirmDelete="DeleteProject"
    @onHiddenPopup="
      () => {
        isShowDeleteConfirm = false;
      }
    "
  ></PopupConfirmDelete>
</template>
<script setup>
import PopoverUserInfor from "@/components/popover/PopoverUserInfor.vue";
import { ButtonType } from "@/commons/contants/button-type";
import BaseButton from "@/components/base/BaseButton.vue";
import { RouterName } from "@/commons/contants/router-name.js";
import { TheProjectTab } from "@/commons/contants/the-project-tab.js";
import BasePopover from "@/components/base/BasePopover.vue";
import PopupConfirmDelete from "@/components/popup/PopupConfirmDelete.vue";
import { useRoute } from "vue-router";
import {
  getAllProject,
  deleteProjectByID,
} from "@/apis/project-service/project-service";
import { showToast } from "@/utils/toast-message/toastMessage";
import PopoverChoseProject from "@/components/popover/PopoverChoseProject.vue";
import router from "@/router/index.js";
import { onBeforeMount, ref, watch } from "vue";
import i18n from "@/plugins/i18n";
import Project from "@/commons/models/Project";
import { responseStatus } from "@/commons/enums/api-response-status";
import { methodStatus } from "@/commons/contants/method-status.js";
import Users from "@/commons/models/Users";
var { t } = i18n.global;
const props = defineProps({
  view: String,
  reloadListProject: Boolean,
  user: Users,
});
const emit = defineEmits();
const selectedTab = ref(1);
const listProject = ref(Array < Project > []);
const selectedProject = ref(Array);
const route = useRoute();
const isShowProjectSetting = ref(false);
const isShowDeleteConfirm = ref(false);
const settingSelection = [
  {
    ID: 0,
    Text: t("UpdateProject"),
    Icon: "pencil-icon",
  },
  {
    ID: 1,
    Text: t("DeleteProject"),
    Icon: "trash-icon",
  },
];

onBeforeMount(async () => {
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
  () => route.query,
  async () => {
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
  }
);

watch(
  () => props.reloadListProject,
  async () => {
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
  }
);

/**
 * Chọn setting project item
 * @param {*} item
 */
function onSelectSettingItem(item) {
  if (item.ID == 0) {
    onOpenAddNewProject(methodStatus.Update);
  } else {
    isShowDeleteConfirm.value = true;
  }
  isShowProjectSetting.value = false;
}

/**
 * Xóa dự án theo id
 */
async function DeleteProject() {
  try {
    const res = await deleteProjectByID(selectedProject.value.projectId);
    if (res && res.status && res.status == responseStatus.Success) {
      showToast.success(t("DeleteProjectSuccess"));
      backToHome();
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    console.log(error);
    showToast.error(t("Error"));
  }
  isShowDeleteConfirm.value = false;
}

/**
 * Hiển thị chọn cài đặt project
 */
function showProjectSettingSelection() {
  isShowProjectSetting.value = true;
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
 * Mở popup thêm dự án/nhóm
 */
function onOpenAddNewProject(method) {
  emit("onOpenAddNewProject", method);
}

/**
 * Mở popup thêm công việc
 */
function onOpenAddNewTask() {
  emit("onOpenAddNewTask");
}

/**
 * Chọn dự án
 */
function onSelectedProject(event) {
  router.push({
    path: "/project",
    query: {
      Type: selectedTab.value,
      ProjectID: event.projectId,
    },
  });
}

/**
 * Đổi tab
 * @param {*} item
 */
function selectTab(item) {
  selectedTab.value = item.Type;
  const query = router?.currentRoute?._value?.query;
  router.push({
    path: "/project",
    query: {
      Type: selectedTab.value,
      ProjectID: query.ProjectID,
    },
  });
}

/**
 * Về trang chủ
 */
function backToHome() {
  if (route.fullPath != "/permistion") {
    router.push("/management");
  }
}
</script>
<style lang="scss" scoped>
.header-class {
  background: var(--app-color-white) !important;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  height: 48px;
  width: 100%;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
  padding-right: 24px;
  .app-name {
    font-size: 24px;
    font-weight: 700;
    margin-left: 12px;
  }
  .project-infor {
    display: flex;
    align-items: center;
    padding: 0 16px;
    height: 24px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    .icon-project {
      width: 24px;
      height: 24px;
      background: #000;
    }
    .project-name {
      padding: 0 12px;
      font-weight: 600;
    }
  }
  .tab-item {
    height: 40px;
    display: flex;
    align-items: center;
    margin-left: 24px;
    cursor: pointer;
  }

  .tab-underline {
    color: #2196f3;
    border-bottom: 3px solid #2196f3;
    font-weight: 600;
  }
}

.report-text {
  font-size: 17px;
  padding: 0 24px;
  font-weight: 700;
  margin: 0 32px;
  border-left: 1px solid #ccc;
}
.setting-selection {
  .setting-item {
    height: 36px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    cursor: pointer;
  }
  .setting-item:hover {
    background-color: var(--app-items-hover);
  }
}
</style>
