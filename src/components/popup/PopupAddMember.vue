<template>
  <div>
    <BasePopup
      :width="660"
      :title="
        step == addMemberStep.SelectMember
          ? t('AddMemberTitle')
          : t('Authorization')
      "
      :isVisible="isVisible"
      @onHidden="onHidden"
      @onContentReady="onContentReady"
    >
      <template v-slot:content>
        <!-- Bước 1: Thêm thành viên vào dự án/nhóm -->
        <div class="popup-content" v-show="step == addMemberStep.SelectMember">
          <BaseSearchInput
            class="mb-px-16"
            :placeHolder="t('MemberSearch')"
            :width="300"
          ></BaseSearchInput>
          <div
            class="d-flex align-items-center mb-px-4"
            v-if="listSelectedData.length"
          >
            <div class="mr-px-12">
              <span class="bold">{{ listSelectedData.length }}</span>
              {{ t("IsSelecting") }}
            </div>
            <div class="primary-color pointer" @click="unSelectedAll">
              {{ t("UnSelected") }}
            </div>
          </div>
          <BaseDataGrid
            :class="!listSelectedData.length ? 'pt-px-23' : ''"
            :data-source="data"
            :columns="gridColumns"
            :height="272"
            :selectionMode="SelectionMode.Multiple"
            :keyExpr="'id'"
            :showPaging="true"
            :totalData="totalData"
            :selectedRowKeysProps="listSelectedID"
            @getData="getUser"
            @onSelectionChanged="onSelectionChanged"
          >
          </BaseDataGrid>
        </div>

        <!-- Bước 2: Phân vai trò -->
        <div class="popup-content" v-show="step == addMemberStep.Authorization">
          <div
            class="d-flex align-items-center primary-color pointer hover-underline mb-px-24"
            @click="
              () => {
                step = addMemberStep.SelectMember;
              }
            "
          >
            <div class="primary-back-icon mr-px-4"></div>
            {{ t("ReturnSelectMemberStep") }}
          </div>
          <BaseDataGrid
            :data-source="listSelectedData"
            :columns="gridColumns"
            :height="240"
            :alowDelete="true"
            :selectionMode="SelectionMode.Single"
            :keyExpr:="'id'"
            @onDeleteRow="onDeleteRow"
          >
          </BaseDataGrid>
          <div class="mt-px-24 bold d-flex align-items-center pr-px-24">
            <div class="pr-px-48">
              {{ t("Role") }}
            </div>
            <BaseRadioGroup
              class="w-40"
              :dataSource="roleOption"
              :value="selectedRole.ID"
              :value-expr="'ID'"
              :display-expr="'Name'"
              @onValueChange="onValueChange"
            ></BaseRadioGroup>
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
            @onClick="onHidden"
          ></BaseButton>
          <BaseButton
            v-if="addMemberStep.SelectMember == step"
            :class="listSelectedID.length ? '' : 'disable'"
            :text="t('Next')"
            :type="ButtonType.PriButton"
            :height="40"
            @onClick="
              () => {
                if (listSelectedID.length) {
                  step++;
                }
              }
            "
          ></BaseButton>
          <BaseButton
            :text="t('Accept')"
            v-if="addMemberStep.Authorization == step"
            :class="listSelectedID.length ? '' : 'disable'"
            :type="ButtonType.PriButton"
            :height="40"
            @onClick="saveListAssignee"
          ></BaseButton>
        </div>
      </template>
    </BasePopup>
  </div>
</template>
<script setup>
import BasePopup from "@/components/base/BasePopup.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import { addMemberStep } from "@/commons/enums/add-member-step.js";
import { ButtonType } from "@/commons/contants/button-type";
import BaseDataGrid from "@/components/base/BaseDataGrid.vue";
import BaseSearchInput from "../base/BaseSearchInput.vue";
import { SelectionMode } from "@/commons/contants/selection-mode";
import BaseRadioGroup from "../base/BaseRadioGroup.vue";
import { getFilterUser } from "@/apis/user-service/user-service.js";
import { computed, onBeforeMount, ref, watch } from "vue";
import i18n from "@/plugins/i18n";
import { responseStatus } from "@/commons/enums/api-response-status";
import { showToast } from "@/utils/toast-message/toastMessage.js";
import { AuthorizationSelection } from "@/commons/contants/authorization-selection.js";
import Users from "@/commons/models/Users";

var { t } = i18n.global;
var step = ref(addMemberStep.SelectMember);

// let filterParams = ref({
//   Status: 1,
//   Keyword: "",
//   Offset: pageIndex.value * pageSize.value,
//   Limit: pageSize.value,
// });
const listSelectedData = ref(Array < Users > []);
const listSelectedID = ref(Array < String > []);
const roleOption = ref(AuthorizationSelection);
const selectedRole = ref(roleOption.value[0]);
const data = ref(Array < Users > []);
const totalData = ref(0);

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
]);

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  listSelected: {
    type: Array,
  },
});

const emit = defineEmits();

/**
 * Đổi giá trị Vai trò
 * @param {*} value
 */
function onValueChange(value) {
  if (value) {
    selectedRole.value = roleOption.value.find((item) => item.ID == value);
  }
}

/**
 * Lưu danh sách thành viên thêm mới vào dự án
 */
function saveListAssignee() {
  if (listSelectedData.value.length) {
    emit("onChangedMember", listSelectedData.value, selectedRole.value);
    onHidden();
  }
}

/**
 * Xóa thành viên được chọn
 * @param {*} row
 */
function onDeleteRow(row) {
  listSelectedID.value = listSelectedData.value?.map((item) => item.id);
}

/**
 * Đổi tích chọn thành viên
 * @param {*} event
 */
function onSelectionChanged(event) {
  if (event) {
    listSelectedData.value = event;
    listSelectedID.value = listSelectedData.value.map((item) => item.id);
  }
}
/**
 * Đổi tích chọn thành viên
 * @param {*} event
 */
function unSelectedAll() {
  listSelectedData.value = [];
  listSelectedID.value = [];
}

/**
 * Khởi tạo
 */
function onContentReady() {}

/**
 * Lọc thành viên
 */
async function getUser(pageIndex, pageSize) {
  const filterParams = {
    Status: 1,
    Keyword: "",
    Offset: pageIndex * pageSize,
    Limit: pageSize,
  };
  try {
    const res = await getFilterUser(filterParams);
    if (res && res.data && res.status && res.status == responseStatus.Success) {
      if (res.data.PageData) {
        data.value = res.data.PageData;
      }
      if (res.data.Total) {
        totalData.value = res.data.Total;
      }
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Đóng popup
 */
function onHidden() {
  step.value = addMemberStep.SelectMember;
  unSelectedAll();
  emit("onHidden");
}
</script>
<style lang="scss" scope>
.pt-px-23 {
  padding-top: 23px;
}

.popup-content {
  // min-height: 400px;
  padding: 0 24px;
}

.disable {
  cursor: auto !important;
  opacity: 0.3;
}
</style>
