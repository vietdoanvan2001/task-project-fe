<template lang="">
  <div class="header-class d-flex align-items-center justify-content-between">
    <div
      class="d-flex align-items-center pointer"
      v-if="view == RouterName.DashBoard"
    >
      <div class="app-icon ml-px-40"></div>
      <div class="app-name">{{ t("Task") }}</div>
    </div>
    <div class="d-flex align-items-center" v-if="view == RouterName.TheProject">
      <div class="home-icon ml-px-40 mr-px-24 pointer"></div>
      <div class="project-infor">
        <div class="icon-project"></div>
        <div class="project-name">Công việc cá nhân</div>
        <div class="arrow-down-icon"></div>
        <div class="setting-icon ml-px-24 mr-px-8"></div>
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
        class="add-button mr-px-32"
        :type="ButtonType.AddButton"
        :text="t('AddNewTask')"
        @itemSelected="onOpenAddNewProject"
        @onClick="onOpenAddNewTask"
      ></BaseButton>

      <PopoverUserInfor></PopoverUserInfor>
    </div>
  </div>
</template>
<script setup>
import PopoverUserInfor from "@/components/popover/PopoverUserInfor.vue";
import { ButtonType } from "@/commons/contants/button-type";
import BaseButton from "@/components/base/BaseButton.vue";
import { RouterName } from "@/commons/contants/router-name.js";
import { TheProjectTab } from "@/commons/contants/the-project-tab.js";
import router from "@/router/index.js";
import { ref, watch } from "vue";
import i18n from "@/plugins/i18n";
var { t } = i18n.global;
const props = defineProps({
  view: String,
});
const emit = defineEmits();
const selectedTab = ref(2);

/**
 * Mở popup thêm dự án/nhóm
 */
function onOpenAddNewProject() {
  emit("onOpenAddNewProject");
}

/**
 * Mở popup thêm công việc
 */
function onOpenAddNewTask() {
  emit("onOpenAddNewTask");
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
      TaskID: query.TaskID,
    },
  });
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
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
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
</style>
