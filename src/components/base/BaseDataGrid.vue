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
      @rowClick="onRowClick($event)"
    >
      <DxScrolling row-rendering-mode="virtual" />
      <DxPaging :page-size="pageSize" />
      <DxSelection :mode="selectionMode" :deferred="false" />
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
          editRow: '',
        }"
        mode="row"
      />
    </DxDataGrid>
    <!-- <div
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
    </div> -->
  </div>
</template>
<script setup>
import i18n from "@/plugins/i18n";
var { t } = i18n.global;
import { ref, watch, computed, onBeforeMount } from "vue";
import {
  DxPaging,
  DxDataGrid,
  DxColumn,
  DxSelection,
  DxEditing,
  DxScrolling,
} from "devextreme-vue/data-grid";

const props = defineProps({
  keyExpr: String,
  dataSource: {
    type: Array,
    default: [],
  },
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
  pageSize: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits();

const celltemplate = ref(null);
celltemplate.value = props.columns.map((x) => x.CellTemplate);
const selectedItems = ref([]);

watch(
  () => props.selectedRowKeysProps,
  () => {
    if (props.selectedRowKeysProps && props.selectedRowKeysProps.length) {
      selectedItems.value = [...props.selectedRowKeysProps];
      console.log(selectedItems.value);
    }
  },
  { immediate: true }
);

// watch(
//   () => props.dataSource,
//   () => {
//     console.log(props.dataSource);
//   },
//   { immediate: true }
// );

onBeforeMount(() => {
  getDataGrid();
});

/**
 * Lấy dữ liệu bảng
 */
function getDataGrid() {
  emit("getData", 0, 10000000);
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

function onRowClick(event) {
  // Kiểm tra xem sự kiện được kích hoạt từ ô tích chọn hay không
  emit("onRowClick", event);
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
  opacity: 0;
  width: 18px !important;
  height: 18px !important;
  -webkit-mask-image: url("../../assets/images/ICON.svg");
  -webkit-mask-position: -360px -102px;
  -webkit-mask-repeat: no-repeat;
  background-color: var(--app-color-danger);
}

.dx-link-edit {
  opacity: 0;
  width: 18px !important;
  height: 18px !important;
  -webkit-mask-image: url("../../assets/images/ICON.svg");
  -webkit-mask-position: -680px -358px;
  -webkit-mask-repeat: no-repeat;
  background-color: var(--app-color-secondary-text);
}

.dx-state-hover {
  .dx-link-delete,
  .dx-link-edit {
    opacity: 1;
  }
}

.dx-datagrid .dx-row > td {
  height: 44px;
  line-height: 26px;
  padding: 8px 24px !important;
}

.dx-datagrid-pager {
  border: none !important;
  padding: 24px;
}

.dx-page-indexes {
  .dx-selection {
    cursor: inherit;
    text-shadow: none;
    color: var(--app-color-white) !important;
    border-color: transparent;
    background-color: var(--app-color-primary) !important;
    border-radius: 50%;
    height: 36px !important;
    width: 36px !important;
    font-weight: 700;
  }

  .dx-page {
    padding: 7px 13px 8px !important;
  }
}

.dx-widget {
  max-width: 3000px !important;
}
// .dx-datagrid-rowsview .dx-selection.dx-row:not(.dx-row-focused) > td {
//   background-color: #e5f0f8;
// }
</style>
