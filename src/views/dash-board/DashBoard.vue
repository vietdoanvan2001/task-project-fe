<template>
  <div class="dashboard-container d-flex">
    <div class="menu">
      <div v-for="(item, index) in RootSelection" :key="index">
        <div class="menu-item pointer">
          <div :class="item.Icon" class="mr-px-16"></div>
          {{ item.Name }}
        </div>
      </div>
      <BaseSearchInput
        class="mt-px-8"
        :mode="'specialSearch'"
        :placeHolder="t('Search')"
      ></BaseSearchInput>
      <div :style="{ color: '#ffffff', margin: '24px', cursor: 'pointer' }">
        Dự án Fake
      </div>
      <div
        :style="{ color: '#ffffff', margin: '24px', cursor: 'pointer' }"
        @click="openTask(12, 2)"
      >
        Công việc Fake
      </div>
    </div>
    <div class="content">
      <div class="quotations">
        <div>{{ t("Hello") }} <span class="bold">Đoàn Văn Việt</span></div>
        <div class="current-time">
          {{ currentTime }}
        </div>
        <div>
          {{ quotation.Content }}
        </div>
        <div class="mt-px-8 bold">
          {{ quotation.Author }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import {
  getRandomFromArray,
  getCurrentTime,
} from "@/utils/functions/commonFns.js";
import { Quotations } from "@/commons/contants/quotations";
import { RootSelection } from "@/commons/contants/root-selection.js";
import router from "@/router/index.js";
import BaseSearchInput from "@/components/base/BaseSearchInput.vue";
import { RouterName } from "@/commons/contants/router-name.js";
import i18n from "@/plugins/i18n";
var { t } = i18n.global;

const quotation = getRandomFromArray(Quotations);
const currentTime = ref("");
const emit = defineEmits();
onBeforeMount(() => {
  emit("onChangedView", RouterName.DashBoard);
  currentTime.value = getCurrentTime();
  setInterval(() => {
    currentTime.value = getCurrentTime();
  }, 1000);
});

/**
 * Mở Danh sách công việc
 * @param {*} taskID
 * @param {*} departmentID
 */
function openTask(taskID, ProjectID) {
  router.push({
    path: "/project",
    query: {
      Type: 2,
      ProjectID: ProjectID,
      TaskID: taskID,
    },
  });
}
</script>
<style lang="scss">
.dashboard-container {
  .menu {
    background-color: rgba(0, 0, 0, 0.7);
    min-width: 268px;
    height: 100vh;
    position: absolute;
    padding-top: 72px;

    .menu-item {
      display: flex;
      align-items: center;
      width: 100%;
      height: 40px;
      color: var(--app-color-white);
      padding: 0 24px;
    }

    .menu-item:hover {
      background-color: #212121;
    }
  }
  .content {
    padding: 70px 20px 32px 288px;
    width: 100%;
    height: 100vh;
    background: url("../../assets/images/dashboard03.jpg") no-repeat;
    background-size: cover;

    .add-button {
      position: absolute;
      right: 20px;
      top: 72px;
    }

    .quotations {
      width: 310px;
      color: #fff;
      position: absolute;
      bottom: 32px;
      left: 290px;

      .current-time {
        font-size: 60px;
        font-weight: 500;
      }
    }
  }
}
</style>
