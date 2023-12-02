<template lang="">
  <div class="content">
    <BaseKanban
      v-if="currentType == 1"
      :data="kanbanDataClone"
      @reloadData="reloadKanbanData"
      @onOpenTaskEditForm="onOpenTaskEditForm"
    ></BaseKanban>
    <TaskGrid
      v-else
      :data="dataClone"
      @onOpenTaskEditForm="onOpenTaskEditForm"
    ></TaskGrid>
    <router-view></router-view>
  </div>
  <div class="right-side">
    <div
      class="right-side-item"
      :class="
        selectedID == '11111111-1111-1111-1111-111111111111'
          ? 'item-active'
          : ''
      "
      @click="
        () => {
          selectedID = '11111111-1111-1111-1111-111111111111';
        }
      "
    >
      <div
        class="d-flex center-center mb-px-4"
        :style="
          selectedID == '11111111-1111-1111-1111-111111111111'
            ? {
                width: '32px',
                height: '32px',
                border: '1px solid var(--app-color-secondary-text)',
                borderRadius: '50%',
              }
            : {
                width: '32px',
                height: '32px',
                border: '1px solid #fff',
                borderRadius: '50%',
              }
        "
      >
        <div
          :class="
            selectedID == '11111111-1111-1111-1111-111111111111'
              ? 'black-all-member-icon'
              : 'all-member-icon'
          "
        ></div>
      </div>
      <div>
        {{ t("All") }}
      </div>
    </div>
    <div
      class="right-side-item"
      :class="
        selectedID == '00000000-0000-0000-0000-000000000000'
          ? 'item-active'
          : ''
      "
      @click="
        () => {
          selectedID = '00000000-0000-0000-0000-000000000000';
        }
      "
    >
      <div
        class="mb-px-4"
        :class="
          selectedID == '00000000-0000-0000-0000-000000000000'
            ? 'black-nobody-icon'
            : 'nobody-icon'
        "
      ></div>
      <div>
        {{ t("UnAssign") }}
      </div>
    </div>
    <div
      class="right-side-item"
      :class="selectedID == item.ID ? 'item-active' : ''"
      v-for="(item, index) in listAssignee"
      :key="index"
      @click="
        () => {
          selectedID = item.ID;
        }
      "
    >
      <div
        class="avatar-32 mb-px-4"
        :style="{ background: item.Background, color: '#fff !important' }"
      >
        {{ getName(item.FullName).Text }}
      </div>
      {{ getName(item.FullName).Name }}
    </div>
    <div></div>
  </div>
</template>
<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { RouterName } from "@/commons/contants/router-name.js";
import { useRoute } from "vue-router";
import TaskGrid from "@/components/grid/TaskGrid.vue";
import BaseKanban from "@/components/base/BaseKanban.vue";
import { getTaskByProjectID } from "@/apis/task-service/task-service.js";
import { getKanbanByProjectID } from "@/apis/kanban-service/kanban-service";
import { getProjectByID } from "@/apis/project-service/project-service.js";
import { responseStatus } from "@/commons/enums/api-response-status";
import { getUsersByListID } from "@/apis/user-service/user-service.js";
import i18n from "@/plugins/i18n";
import Project from "@/commons/models/Project";
import { showToast } from "@/utils/toast-message/toastMessage";
import Users from "@/commons/models/Users";
import { isNullOrEmpty } from "@/utils/functions/commonFns";
var { t } = i18n.global;
const emit = defineEmits();
const props = defineProps({
  reloadListProject: Boolean,
});
const route = useRoute();
const data = ref([]);
const dataClone = ref([]);
const kanbanData = ref([]);
const kanbanDataClone = ref([]);
const listID = ref([]);
const listAssignee = ref(Array < Users > []);
const selectedID = ref("11111111-1111-1111-1111-111111111111");

onBeforeMount(() => {
  emit("onChangedView", RouterName.TheProject);
  getProject(route.query.ProjectID);
});
let currentType = ref(1);

watch(
  () => route.query,
  (newValue) => {
    if (newValue && newValue.Type) {
      currentType.value = newValue.Type;
    }
    if (newValue && newValue.ProjectID) {
      selectedID.value = "11111111-1111-1111-1111-111111111111";
      getTask(newValue.ProjectID);
      getKanban(newValue.ProjectID);
      getProject(route.query.ProjectID);
    }
  },
  { immediate: true }
);

watch(
  () => props.reloadListProject,
  () => {
    getKanban(route.query.ProjectID);
    getTask(route.query.ProjectID);
  }
);

watch(
  () => selectedID.value,
  () => {
    getKanban(route.query.ProjectID);
    getTask(route.query.ProjectID);
  },
  { immediate: true }
);

function onOpenTaskEditForm(id) {
  emit("onOpenTaskEditForm", id);
}

function reloadKanbanData() {
  getKanban(route.query.ProjectID);
}

function getName(string) {
  if (string && !isNullOrEmpty(string)) {
    const arr = string.trim().split(" ");
    if (arr && arr.length > 1) {
      return {
        Name: arr[arr.length - 1],
        Text: arr[0][0] + arr[arr.length - 1][0],
      };
    }
    return {
      Name: arr[arr.length - 1],
      Text: arr[0][0],
    };
  }
  return {
    Name: "unknow",
    Text: "U",
  };
}

/**
 * Lấy dự án theo id
 * @param {*} id
 */
async function getProject(id) {
  try {
    const res = await getProjectByID(id);
    if (res && res.status && res.status == responseStatus.Success && res.data) {
      const temp = res.data;
      if (temp.listAssignee) {
        const tempArray = JSON.parse(temp.listAssignee);
        listID.value = tempArray?.map((item) => item.ID);
        getListUsers(listID.value);
      }
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    showToast.error(t("Error"));
    console.log(error);
  }
}

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
 * Lấy Kanban theo id dự án
 * @param {*} id
 */
async function getKanban(id) {
  try {
    const param = {
      idProject: id,
      userID: selectedID.value,
    };
    const res = await getKanbanByProjectID(param);
    if (res && res.status && res.status == responseStatus.Success && res.data) {
      kanbanData.value = res.data;
      kanbanDataClone.value = [...kanbanData.value];
      console.log(kanbanDataClone.value);
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Lấy công việc theo id dự án
 * @param {*} id
 */
async function getTask(id) {
  try {
    const param = {
      projectID: id,
      userID: selectedID.value,
    };
    const res = await getTaskByProjectID(param);
    if (res && res.status && res.status == responseStatus.Success && res.data) {
      data.value = res.data;
      dataClone.value = [...data.value];
    }
  } catch (error) {
    console.log(error);
  }
}
</script>
<style lang="scss">
.content {
  padding-top: 48px;
  width: calc(100% - 64px);
  height: calc(100vh);
  background: url("../../assets/images/dashboard03.jpg") no-repeat;
  background-size: cover;
}

.right-side {
  position: absolute;
  top: 48px;
  right: 0;
  width: 64px;
  height: calc(100% - 48px);
  padding: 4px;
  background-color: rgba(0, 0, 0, 0.7);
  .right-side-item {
    overflow: hidden;
    color: var(--app-color-white);
    font-size: 11px;
    display: flex;
    flex-flow: column;
    align-items: center;
    margin-top: 8px;
    font-weight: 600;
    cursor: pointer;
    padding: 8px 0;
    border-radius: 4px;
  }

  .item-active {
    background-color: #fff;
    color: #000;
  }
}
</style>
