<template lang="">
  <div>
    <DxDataGrid
      :key-expr="keyExpr"
      :data-source="dataSource"
      :noDataText="t('NoData')"
      :showBorders="false"
      :showRowLines="true"
      :showColumnLines="false"
      :width="width"
      :height="height"
      :hover-state-enabled="true"
      :selectedRowKeys="selectedItems"
      @selectionChanged="onSelectionChanged($event)"
      @row-removed="onDeleteRow($event)"
    >
      <DxSelection
        :select-all-mode="allMode"
        :show-check-boxes-mode="checkBoxesMode"
        :mode="selectionMode"
      />
      <DxColumn
        v-for="(item, index) in columns"
        :caption="item.Caption"
        :key="item.DataField"
        :data-field="item.DataField"
        :width="item.Width"
        :data-type="item.DataType"
        :alignment="item.Alignment"
        :cell-template="item.CellTemplate"
      >
      </DxColumn>
      <template v-for="slot in celltemplate" v-slot:[slot]="{ data }">
        <slot :name="slot" :data="data"></slot>
      </template>
      <DxEditing
        :width="50"
        :allow-updating="alowUpdate"
        :allow-deleting="alowDelete"
        :confirmDelete="false"
        :texts="{
          deleteRow: '',
        }"
        mode="row"
      />
    </DxDataGrid>
    <div
      class="d-flex align-items-center justify-content-between mt-px-16"
      v-if="showPaging"
    >
      <div>
        {{ t("Amount") }} <span class="bold">{{ totalData }}</span>
        {{ t("Record") }}
      </div>
      <div class="d-flex align-items-center mr-px-12">
        <div
          class="back-icon pointer mr-px-12"
          :class="canBack ? '' : 'disable'"
          @click="backPage"
        ></div>
        <span class="bold mr-px-4">{{ pageIndex * pageSize + 1 }}</span>
        {{ t("To") }}
        <span class="bold ml-px-4">{{
          (pageIndex + 1) * pageSize < totalData
            ? (pageIndex + 1) * pageSize
            : totalData
        }}</span>
        <div
          class="next-icon pointer ml-px-12"
          :class="canNext ? '' : 'disable'"
          @click="nextPage"
        ></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import i18n from "@/plugins/i18n";
var { t } = i18n.global;
import { ref, watch, computed, onBeforeMount } from "vue";
import {
  DxDataGrid,
  DxColumn,
  DxSelection,
  DxEditing,
} from "devextreme-vue/data-grid";

const props = defineProps({
  keyExpr: String,
  dataSource: Array,
  columns: Array,
  width: Number,
  height: Number,
  selectionMode: String,
  alowDelete: {
    type: Boolean,
    default: false,
  },
  alowUpdate: {
    type: Boolean,
    default: false,
  },
  selectedRowKeysProps: {
    type: Array,
  },
  showPaging: {
    type: Boolean,
    default: false,
  },
  totalData: Number,
});
const pageSize = ref(4);
const pageIndex = ref(0);
const canBack = computed(() => {
  if (pageIndex.value > 0) {
    return true;
  }
  return false;
});
const canNext = computed(() => {
  if ((pageIndex.value + 1) * pageSize.value <= props.totalData) {
    return true;
  }
  return false;
});

const emit = defineEmits();

const celltemplate = ref(null);
celltemplate.value = props.columns.map((x) => x.CellTemplate);
const selectedItems = ref([]);

onBeforeMount(() => {
  getDataGrid();
});

/**
 * Lấy dữ liệu bảng
 */
function getDataGrid() {
  emit("getData", pageIndex.value, pageSize.value);
}

/**
 * Back grid
 */
function backPage() {
  if (canBack.value) {
    pageIndex.value = pageIndex.value > 0 ? pageIndex.value - 1 : 0;
    getDataGrid();
  }
}
/**
 * Next grid
 */

function nextPage(params) {
  if (canNext.value) {
    pageIndex.value += 1;
    getDataGrid();
  }
}

/**
 * Xóa hàng
 */
function onDeleteRow(event) {
  if (event && event.data) {
    emit("onDeleteRow", event.data);
  }
}

/**
 * Đổi tích chọn
 * @param {} event
 */
function onSelectionChanged(event) {
  if (event && event.selectedRowsData) {
    emit("onSelectionChanged", event.selectedRowsData);
  }
}
</script>
<style lang="scss">
.dx-header-row {
  color: #1f1f1f;
  font-weight: 700;
}
.dx-datagrid-rowsview
  .dx-select-checkboxes-hidden
  > tbody
  > tr
  > td
  > .dx-select-checkbox {
  display: inline-block;
}

.dx-checkbox-checked .dx-checkbox-icon::before {
  content: "";
}

.dx-checkbox-checked .dx-checkbox-icon {
  // background: url("../../assets/images/ICON.svg") no-repeat -584px -106px;
  // width: 18px !important;
  // height: 18px !important;
  // background-size: unset !important;
  width: 18px !important;
  height: 18px !important;
  -webkit-mask-image: url("../../assets/images/ICON.svg");
  -webkit-mask-position: -583px -104px;
  -webkit-mask-repeat: no-repeat;
  background-color: var(--app-color-primary);
}

.dx-checkbox-icon {
  border: none !important;
  outline: none;
}

.dx-checkbox-container {
  border: 1px solid var(--app-color-secondary-text);
  border-radius: 4px;
}

.dx-link-delete {
  width: 18px !important;
  height: 18px !important;
  -webkit-mask-image: url("../../assets/images/ICON.svg");
  -webkit-mask-position: -360px -102px;
  -webkit-mask-repeat: no-repeat;
  background-color: var(--app-color-danger);
}

// .dx-datagrid-rowsview .dx-selection.dx-row:not(.dx-row-focused) > td {
//   background-color: #e5f0f8;
// }
</style>
