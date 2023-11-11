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
    >
      <template v-slot:content>
        <div class="popup-content" v-show="step == addMemberStep.SelectMember">
          <BaseSearchInput
            class="mb-px-16"
            :placeHolder="t('MemberSearch')"
            :width="300"
          ></BaseSearchInput>
          <div class="d-flex align-items-center mb-px-4">
            <div class="mr-px-12">
              <span class="bold">3</span> {{ t("IsSelecting") }}
            </div>
            <div class="primary-color pointer">
              {{ t("UnSelected") }}
            </div>
          </div>
          <BaseDataGrid
            :data-source="data"
            :columns="gridColumns"
            :height="272"
            :selectionMode="SelectionMode.Multiple"
          >
            <template v-slot:ProductCellTemplate="{ data }">
              <div>{{ data.data.Product }}</div>
            </template>
            <template v-slot:23="{ data }">
              <div>Cúc cu</div>
            </template>
          </BaseDataGrid>
          <div
            class="d-flex align-items-center justify-content-between mt-px-16"
          >
            <div>
              {{ t("Amount") }} <span class="bold">100</span> {{ t("Record") }}
            </div>
            <div>
              <span class="bold">1</span> {{ t("To") }}
              <span class="bold">10</span>
            </div>
          </div>
        </div>
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
            :data-source="data"
            :columns="gridColumns"
            :height="240"
            :alowDelete="true"
            :selectionMode="SelectionMode.Single"
          >
            <template v-slot:ProductCellTemplate="{ data }">
              <div>{{ data.data.Product }}</div>
            </template>
            <template v-slot:23="{ data }">
              <div>Cúc cu</div>
            </template>
          </BaseDataGrid>
          <div class="mt-px-24 bold d-flex align-items-center pr-px-24">
            <div class="pr-px-48">
              {{ t("Role") }}
            </div>
            <BaseRadioGroup
              class="w-40"
              :dataSource="roleOption"
              :value="1"
              :value-expr="'ID'"
              :display-expr="'Name'"
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
          ></BaseButton>
          <BaseButton
            v-if="addMemberStep.SelectMember == step"
            :text="t('Next')"
            :type="ButtonType.PriButton"
            :height="40"
            @onClick="
              () => {
                step++;
              }
            "
          ></BaseButton>
          <BaseButton
            :text="t('Accept')"
            v-if="addMemberStep.Authorization == step"
            :type="ButtonType.PriButton"
            :height="40"
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
import { addMemberStep } from "@/commons/enums/add-member-step.js";
import { ButtonType } from "@/commons/contants/button-type";
import BaseDataGrid from "@/components/base/BaseDataGrid.vue";
import BaseSearchInput from "../base/BaseSearchInput.vue";
import { SelectionMode } from "@/commons/contants/selection-mode";
import BaseRadioGroup from "../base/BaseRadioGroup.vue";
import { ref } from "vue";
import i18n from "@/plugins/i18n";
var { t } = i18n.global;
var step = ref(addMemberStep.Authorization);

const roleOption = ref([
  { Name: "Thành viên", ID: 1 },
  { Name: "Hạn chế", ID: 2 },
]);

const data = ref([
  {
    ID: 0,
    Product: "Product A",
    Amount: 100,
    Discount: 0.1,
    SaleDate: "2023-10-01",
  },
  {
    ID: 1,
    Product: "Product B",
    Amount: 200,
    Discount: 0.2,
    SaleDate: "2023-10-02",
  },
  {
    ID: 2,
    Product: "Product B",
    Amount: 200,
    Discount: 0.2,
    SaleDate: "2023-10-02",
  },
  {
    ID: 3,
    Product: "Product B",
    Amount: 200,
    Discount: 0.2,
    SaleDate: "2023-10-02",
  },
  {
    ID: 4,
    Product: "Product B",
    Amount: 200,
    Discount: 0.2,
    SaleDate: "2023-10-02",
  },
  {
    ID: 5,
    Product: "Product B",
    Amount: 200,
    Discount: 0.2,
    SaleDate: "2023-10-02",
  },
  {
    ID: 6,
    Product: "Product A",
    Amount: 100,
    Discount: 0.1,
    SaleDate: "2023-10-01",
  },
  {
    ID: 7,
    Product: "Product B",
    Amount: 200,
    Discount: 0.2,
    SaleDate: "2023-10-02",
  },
  {
    ID: 8,
    Product: "Product B",
    Amount: 200,
    Discount: 0.2,
    SaleDate: "2023-10-02",
  },
  {
    ID: 9,
    Product: "Product B",
    Amount: 200,
    Discount: 0.2,
    SaleDate: "2023-10-02",
  },
  {
    ID: 10,
    Product: "Product B",
    Amount: 200,
    Discount: 0.2,
    SaleDate: "2023-10-02",
  },
  {
    ID: 11,
    Product: "Product B",
    Amount: 200,
    Discount: 0.2,
    SaleDate: "2023-10-02",
  },
]);

const gridColumns = ref([
  {
    DataField: "Product",
    Caption: "Hello",
    DataType: "text",
    Alignment: "center",
    CellTemplate: "ProductCellTemplate",
  },
  { DataField: "Amount", CellTemplate: "23" },
  { DataField: "Discount" },
  { DataField: "SaleDate" },
]);

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits();
/**
 * Đóng popup
 */
function onHidden() {
  emit("onHidden");
}
</script>
<style lang="scss" scope>
.popup-content {
  min-height: 400px;
  padding: 0 24px;
}
</style>
