<template>
  <div class="dashboard-container d-flex">
    <div class="menu">
      <div v-for="(item, index) in RootSelection" :key="index">
        <div class="menu-item pointer" @click="onSelectTab(item)">
          <div :class="item.Icon" class="mr-px-16"></div>
          {{ item.Name }}
        </div>
      </div>
      <!-- <div class="mb-px-12 bold white-color pl-px-24">
        {{ t("ListProject") }}
      </div> -->
      <BaseSearchInput
        class="mt-px-8 mb-px-12"
        :mode="'specialSearch'"
        :placeHolder="t('Search')"
        @onValueChanged="searchProject"
      ></BaseSearchInput>

      <div
        class="project-area"
        v-for="(item, index) in listProjectClone"
        :key="index"
      >
        <div class="project-item" @click="openTask(item.ProjectID)">
          <div class="item-icon" :class="item.Background">
            <div :class="item.Icon"></div>
          </div>
          <div class="item-text">
            {{ item.ProjectName }}
          </div>
        </div>
      </div>

      <div
        class="italic-font white-color pl-px-24 pt-px-12"
        v-if="!listProjectClone.length"
      >
        {{ t("NoneProject") }}
      </div>
      <!-- <div
        :style="{ color: '#ffffff', margin: '24px', cursor: 'pointer' }"
        @click="openTask(12, 2)"
      >
        Công việc Fake
      </div> -->
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
import { ref, onBeforeMount, watch } from "vue";
import {
  getRandomFromArray,
  getCurrentTime,
} from "@/utils/functions/commonFns.js";
import { Quotations } from "@/commons/contants/quotations";
import { RootSelection } from "@/commons/contants/root-selection.js";
import router from "@/router/index.js";
import BaseSearchInput from "@/components/base/BaseSearchInput.vue";
import { RouterName } from "@/commons/contants/router-name.js";
import { getProjectByUserID } from "@/apis/project-service/project-service.js";
import i18n from "@/plugins/i18n";
import Project from "@/commons/models/Project";
import { showToast } from "@/utils/toast-message/toastMessage";
import { responseStatus } from "@/commons/enums/api-response-status";
import { useRoute } from "vue-router";
var { t } = i18n.global;

const quotation = getRandomFromArray(Quotations);
const currentTime = ref("");
const emit = defineEmits();

const props = defineProps({
  reloadListProject: {
    type: Boolean,
  },
});

watch(
  () => props.reloadListProject,
  () => {
    getProject();
  }
);

onBeforeMount(() => {
  emit("onChangedView", RouterName.DashBoard);
  currentTime.value = getCurrentTime();
  setInterval(() => {
    currentTime.value = getCurrentTime();
  }, 1000);
  getProject();
});
const route = useRoute();
const listProject = ref(Array < Project > []);
const listProjectClone = ref(Array < Project > []);

/**
 * Chọn tab
 * @param {*} item
 */
function onSelectTab(item) {
  router.push(item.Root);
}

/**
 * Lọc dự án theo tên
 * @param {*} keyWord
 */
function searchProject(keyWord) {
  listProjectClone.value = [];
  listProject.value?.forEach((element) => {
    if (
      element.projectName &&
      element.projectName
        .trim()
        .toLowerCase()
        .includes(keyWord.trim().toLowerCase())
    ) {
      listProjectClone.value.push(element);
    }
  });
}

/**
 * Lấy dự án
 */
async function getProject() {
  try {
    // const res = await getAllProject();
    const id = localStorage.getItem("currentUserID");
    const res = await getProjectByUserID(id);
    if (res && res.status && res.status == responseStatus.Success && res.data) {
      listProject.value = res.data;
      listProjectClone.value = [...listProject.value];
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Mở Danh sách công việc
 * @param {*} taskID
 * @param {*} departmentID
 */
function openTask(ProjectID) {
  router.push({
    path: "/project",
    query: {
      Type: 1,
      ProjectID: ProjectID,
    },
  });
}
</script>
<style lang="scss" scoped>
.dashboard-container {
  .menu {
    background-color: rgba(0, 0, 0, 0.7);
    min-width: 268px;
    height: 100vh;
    position: absolute;
    padding-top: 72px;

    .project-area {
      padding: 0 24px;
      cursor: pointer;
      .project-item {
        height: 42px;
        display: flex;
        align-items: center;
        color: var(--app-color-white);

        .item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          margin-right: 12px;
        }

        .item-text {
          max-width: 184px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }

    .project-area:hover {
      background: #212121;
    }

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
