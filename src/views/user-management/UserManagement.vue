<template>
  <div class="user-management-container">
    <div class="user-management-menu">
      <div
        class="menu-item"
        :class="selectedTab == 1 ? 'active-item' : ''"
        @click="
          () => {
            selectedTab = 1;
            getUsers();
          }
        "
      >
        {{ t("Member") }}
      </div>
      <div
        class="menu-item"
        :class="selectedTab == 2 ? 'active-item' : ''"
        @click="
          () => {
            selectedTab = 2;
            getUsersInTrash();
          }
        "
      >
        {{ t("Trash") }}
      </div>
    </div>
    <div class="user-management-content">
      <div class="sub-title mb-px-24">
        {{ selectedTab == 1 ? t("UserSetting") : t("Trash") }}
      </div>
      <div class="d-flex align-items-center justify-content-between">
        <BaseSearchInput
          :placeHolder="t('MemberSearch')"
          :width="250"
        ></BaseSearchInput>
        <div
          class="add-member-btn"
          @click="
            () => {
              method = methodStatus.Add;
              isShowAddMemberPopup = true;
            }
          "
        >
          <div class="white-add-icon mt-px-2 mr-px-4"></div>
          <div>
            {{ t("AddMember") }}
          </div>
        </div>
      </div>
      <div class="selected-infor">
        <div
          v-if="listSelectedUser && listSelectedUser.length && showTotal"
          class="d-flex align-items-center"
        >
          <span>{{ t("IsSelecting") }}:</span>
          <span class="bold ml-px-4 mr-px-24">{{
            listSelectedUser.length
          }}</span>
          <div
            v-if="isShowSetActive && selectedTab == 1"
            class="method-button pointer mr-px-12"
            :style="{ borderColor: 'var(--app-color-success)' }"
            @click="updateStatus(1)"
          >
            <div class="active-icon mr-px-8"></div>
            <span :style="{ color: 'var(--app-color-success)' }">{{
              t("SetActive")
            }}</span>
          </div>
          <div
            v-if="isShowSetInActive && selectedTab == 1"
            class="method-button pointer"
            :style="{ borderColor: 'var(--app-color-danger)' }"
            @click="updateStatus(2)"
          >
            <div class="inactive-icon mr-px-8"></div>
            <span :style="{ color: 'var(--app-color-danger)' }">{{
              t("SetInActive")
            }}</span>
          </div>
          <div
            v-if="selectedTab == 2"
            class="method-button pointer"
            :style="{
              borderColor: 'var(--app-color-success)',
              background: 'var(--app-color-success)',
            }"
            @click="mutipleRestore"
          >
            <div class="white-restore-icon mr-px-8"></div>
            <span class="bold" :style="{ color: 'var(--app-color-white)' }">{{
              t("Restore")
            }}</span>
          </div>
          <div
            class="method-button pointer ml-px-12"
            :style="{
              borderColor: 'var(--app-color-danger)',
              background: 'var(--app-color-danger)',
            }"
            @click="
              () => {
                isShowDeleteConfirm = true;
                showTotal = false;
              }
            "
          >
            <div class="white-trash-icon mr-px-8"></div>
            <span class="bold" :style="{ color: 'var(--app-color-white)' }">{{
              selectedTab == 2 ? t("DeleteAll") : t("PutToTrash")
            }}</span>
          </div>
        </div>
      </div>
      <BaseDataGrid
        :data-source="selectedTab == 1 ? listData : listTrashData"
        :columns="selectedTab == 1 ? gridColumns : trashColumns"
        :alowDelete="false"
        :alowUpdate="false"
        :selectionMode="SelectionMode.Multiple"
        :keyExpr:="'id'"
        :pageSize="13"
        :selectedRowKeysProps="listSelectedUser"
        @onSelectionChanged="onSelectionChanged"
      >
        <template v-slot:StatusTemplate="{ data }">
          <BaseUserStatus
            :status="selectedTab == 1 ? data.data.status : 4"
          ></BaseUserStatus>
        </template>
        <template v-slot:MethodTemplate="{ data }" v-if="selectedTab == 1">
          <div class="d-flex center-center method-function">
            <div
              class="mr-px-12 big-pencil-icon pointer"
              @click="
                () => {
                  userSelectedID = data.data.id;
                  method = methodStatus.Update;
                  isShowAddMemberPopup = true;
                }
              "
            ></div>
            <div class="trash-icon pointer" @click="AddUserToTrash(data)"></div>
          </div>
        </template>
      </BaseDataGrid>
    </div>
  </div>
  <PopupAddUser
    v-if="isShowAddMemberPopup"
    :isVisible="isShowAddMemberPopup"
    :method="method"
    :taskSelectedID="userSelectedID"
    @onHiddenPopup="closeAddMemberPopup"
    @reloadData="reloadData"
  ></PopupAddUser>
  <PopupConfirmDelete
    :isVisible="isShowDeleteConfirm"
    :text="selectedTab == 1 ? t('AddtoTrashConfirm') : t('DeleteMemberConfirm')"
    @confirmDelete="multipleDelete"
    @onHiddenPopup="
      () => {
        isShowDeleteConfirm = false;
      }
    "
  >
  </PopupConfirmDelete>
</template>
<script setup>
import BaseSearchInput from "@/components/base/BaseSearchInput.vue";
import BaseDataGrid from "@/components/base/BaseDataGrid.vue";
import {
  getAllUsers,
  updateStatusByListID,
  deleteByListID,
  addToTrash,
  getListUsersInTrash,
} from "@/apis/user-service/user-service.js";
import i18n from "@/plugins/i18n";
import { showToast } from "@/utils/toast-message/toastMessage";
import { responseStatus } from "@/commons/enums/api-response-status";
import { SelectionMode } from "@/commons/contants/selection-mode";
import BaseUserStatus from "@/components/base/BaseUserStatus.vue";
import Users from "@/commons/models/Users.js";
import { onBeforeMount, ref } from "vue";
import BaseUserStatusVue from "@/components/base/BaseUserStatus.vue";
import PopupAddUser from "@/components/popup/PopupAddUser.vue";
import { methodStatus } from "@/commons/contants/method-status";
import PopupConfirmDelete from "@/components/popup/PopupConfirmDelete.vue";
var { t } = i18n.global;
const selectedTab = ref(1);
const isShowAddMemberPopup = ref(false);
const method = ref(methodStatus.Add);
const userSelectedID = ref("");
const isShowDeleteConfirm = ref(false);
const showTotal = ref(true);
const gridColumns = ref([
  {
    DataField: "fullName",
    Caption: t("FullName"),
  },
  {
    DataField: "email",
    Caption: t("Email"),
  },
  {
    DataField: "phoneNumber",
    Caption: t("PhoneNumber"),
  },
  {
    DataField: "status",
    Caption: t("Status"),
    Alignment: "left",
    CellTemplate: "StatusTemplate",
  },
  {
    Width: 120,
    Alignment: "center",
    CellTemplate: "MethodTemplate",
  },
]);

const trashColumns = ref([
  {
    DataField: "FullName",
    Caption: t("FullName"),
  },
  {
    DataField: "Email",
    Caption: t("Email"),
  },
  {
    DataField: "PhoneNumber",
    Caption: t("PhoneNumber"),
  },
  {
    DataField: "Status",
    Caption: t("Status"),
    Alignment: "left",
    CellTemplate: "StatusTemplate",
  },
  {
    Width: 120,
    Alignment: "Center",
    CellTemplate: "MethodTemplate",
  },
]);
const listData = ref(Array < Users > []);
const listTrashData = ref(Array < Users > []);
const listSelectedUser = ref(Array < Users > []);
const isShowSetActive = ref(false);
const isShowSetInActive = ref(false);
onBeforeMount(() => {
  getUsers();
});

function onSelectionChanged(event) {
  showTotal.value = true;
  isShowSetActive.value = isShowSetInActive.value = false;
  listSelectedUser.value = event;
  if (
    listSelectedUser.value.find((item) => item.status == 0 || item.status == 2)
  ) {
    isShowSetActive.value = true;
  }
  if (
    listSelectedUser.value.find((item) => item.status == 0 || item.status == 1)
  ) {
    isShowSetInActive.value = true;
  }
}

function reloadData() {
  getUsers();
  selectedTab.value = 1;
}

/**
 * Đóng popup thêm mới thành viên
 */
function closeAddMemberPopup() {
  isShowAddMemberPopup.value = false;
}

/**
 * Lấy người dùng trong thùng rác
 */
async function getUsersInTrash() {
  try {
    const res = await getListUsersInTrash();
    if (res && res.status && res.status == responseStatus.Success && res.data) {
      listTrashData.value = res.data;
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    console.log(error);
    showToast.error(t("Error"));
  }
}

async function multipleDelete() {
  const listID = listSelectedUser.value?.map((item) => item.id);
  const listID2 = listSelectedUser.value?.map((item) => item.ID);
  // Xóa hẳn
  if (selectedTab.value == 2) {
    try {
      const res = listID[0]? await deleteByListID(listID): await deleteByListID(listID2);
      if (res && res.status && res.status == responseStatus.Success) {
        listSelectedUser.value = [];
        showToast.success(t("DeleteSucess"));
        getUsersInTrash();
      } else {
        showToast.error(t("Error"));
      }
    } catch (error) {
      console.log(error);
      showToast.error(t("Error"));
    }
  }

  //Chuyển vào thùng rác
  else {
    try {
      const res = await addToTrash(listID, 1);
      if (res && res.status && res.status == responseStatus.Success) {
        listSelectedUser.value = [];
        showToast.success(t("AddToTrashSuccess"));
        getUsers();
      } else {
        showToast.error(t("Error"));
      }
    } catch (error) {
      console.log(error);
      showToast.error(t("Error"));
    }
  }
  isShowDeleteConfirm.value = false;
}

/**
 * Chuyển 1 thằng vào thùng rác/xóa
 * @param {*} data
 */
function AddUserToTrash(data) {
  listSelectedUser.value = [data.data];
  isShowDeleteConfirm.value = true;
  showTotal.value = false;
  // multipleDelete();
}

/**
 * Khôi phục
 */
async function mutipleRestore() {
  const listID = listSelectedUser.value.map((item) => item.id);
  try {
    const res = await addToTrash(listID, 0);
    if (res && res.status && res.status == responseStatus.Success) {
      listSelectedUser.value = [];
      showToast.success(t("RestoreSuccess"));
      getUsersInTrash();
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    console.log(error);
    showToast.error(t("Error"));
  }
}

/**
 * Đổi trạng thái
 * @param {*} status
 */
async function updateStatus(status) {
  const listID = listSelectedUser.value.map((item) => item.id);
  try {
    const res = await updateStatusByListID(listID, status);
    if (res && res.status && res.status == responseStatus.Success) {
      listSelectedUser.value = [];
      showToast.success(t("UpdateUserStatusSucess"));
      getUsers();
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    console.log(error);
    showToast.error(t("Error"));
  }
}

/**
 * Lấy người dùng chưa xóa
 */
async function getUsers() {
  try {
    const res = await getAllUsers();
    if (res && res.status && res.status == responseStatus.Success && res.data) {
      listData.value = res.data;
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    console.log(error);
    showToast.error(t("Error"));
  }
}
</script>
<style lang="scss" scoped>
.user-management-container {
  padding-top: 48px;
  height: 100vh;
  display: flex;
  .user-management-menu {
    min-width: 200px;
    border-right: 1px solid #e0e0e0;
    .menu-item {
      height: 56px;
      display: flex;
      align-items: center;
      font-weight: 600;
      padding-left: 25px;
      border-bottom: 1px solid #ccc;
      cursor: pointer;
    }
    .active-item {
      color: #fff;
      background-color: #2193f3;
    }
  }
  .user-management-content {
    padding: 16px;
    .add-member-btn {
      height: 40px;
      cursor: pointer;
      min-width: 80px;
      background: var(--app-color-primary);
      display: flex;
      align-items: center;
      border-radius: 8px;
      color: var(--app-color-white);
      font-weight: 700;
      padding: 8px 12px;
    }
  }

  .method-function {
    opacity: 0;
  }

  .dx-row:hover {
    .method-function {
      opacity: 1;
    }
  }
  .selected-infor {
    height: 56px;
    display: flex;
    align-items: center;
  }

  .method-button {
    height: 36px;
    min-width: 60px;
    width: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
}
</style>
