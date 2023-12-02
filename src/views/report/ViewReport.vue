<template lang="">
  <div class="report-container">
    <div class="report-menu">
      <div v-for="(item, index) in menuItem" :key="index">
        <div
          class="report-menu-item"
          :class="index == selectedTab.ID ? 'item-active' : ''"
          @click="
            () => {
              selectedTab = item;
            }
          "
        >
          <div
            :title="item.Name"
            class="line-clamp-1"
            :style="{ maxWidth: '280px', height: '18px', overflow: 'hidden' }"
          >
            {{ item.Name }}
          </div>
        </div>
      </div>
    </div>
    <div class="report-content flex-1">
      <div class="d-flex align-items-center justify-content-between w-100">
        <div class="sub-title">
          {{ selectedTab.Name }}
        </div>
        <div
          class="d-flex align-items-center"
          :style="{ paddingRight: '64px' }"
        >
          <div class="bold mr-px-12">{{ t("Project") }}</div>
          <PopoverSelectList
            :width="224"
            :target="'selectStatus'"
            :title="t('SelectProject')"
            :listData="listData"
            :isVisible="showSelectionStatus"
            :selectedItem="selectedItem"
            @onValueChanged="selectProject"
            @onHidden="
              () => {
                showSelectionStatus = false;
              }
            "
          ></PopoverSelectList>
        </div>
      </div>

      <div v-if="selectedTab.ID == 0">
        <BaseEisenhower
          :reloadListProject="reloadListProject"
          :selectedProject="selectedItem"
        ></BaseEisenhower>
      </div>
      <div v-if="selectedTab.ID == 1">
        <UsersReport
          :reloadListProject="reloadListProject"
          :selectedProject="selectedItem"
        ></UsersReport>
      </div>
      <div v-if="selectedTab.ID == 2">
        <ProjectReport
          :reloadListProject="reloadListProject"
          :selectedProject="selectedItem"
        ></ProjectReport>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import BaseEisenhower from "@/components/base/BaseEisenhower.vue";
import PopoverSelectList from "@/components/popover/PopoverSelectList.vue";
import { getProjectByUserID } from "@/apis/project-service/project-service.js";
import BaseEisenhowerVue from "@/components/base/BaseEisenhower.vue";
import UsersReport from "@/components/report/UsersReport.vue";
import ProjectReport from "@/components/report/ProjectReport.vue";
import i18n from "@/plugins/i18n";
import { responseStatus } from "@/commons/enums/api-response-status";
var { t } = i18n.global;

const listData = ref([]);
const listProject = ref([]);
const selectedItem = ref();

const showSelectionStatus = ref(false);
const menuItem = [
  {
    ID: 0,
    Name: t("Eisenhower"),
  },
  {
    ID: 1,
    Name: t("ClassifyByAssignee"),
  },
  {
    ID: 2,
    Name: t("ProjectSituation"),
  },
];
const selectedTab = ref(menuItem[0]);
const props = defineProps({
  reloadListProject: Boolean,
});

onBeforeMount(async () => {
  await getProject();
  listData.value =
    listProject.value?.map((item) => ({
      ID: item.ProjectID,
      ColumnName: item.ProjectName,
    })) || [];
  listData.value.unshift({
    ID: -1,
    ColumnName: t("All"),
  });
  selectedItem.value = listData.value[0];
});

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
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    console.log(error);
  }
}

function selectProject(item) {
  selectedItem.value = item;
}
</script>
<style lang="scss" scoped>
.report-container {
  width: 100%;
  height: 100vh;
  padding-top: 48px;
  display: flex;
  .report-menu {
    min-width: 304px;
    border-right: 1px solid #ccc;
    .report-menu-item {
      height: 38px;
      padding: 8px 8px 8px 24px;
      cursor: pointer;
      background-color: #fff;
      border-left: 4px solid transparent;
    }

    .item-active {
      border-color: var(--app-color-primary);
      color: #2196f3;
      background-color: #edf8ff;
    }

    .report-menu-item:hover {
      background-color: var(--app-items-hover);
    }
  }

  .report-content {
    padding: 16px;
    width: calc(100% - 304px);
  }
}
</style>
