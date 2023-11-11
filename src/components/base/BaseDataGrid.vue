<template lang="">
  <div>
    <DxDataGrid
      key-expr="ID"
      :data-source="dataSource"
      :noDataText="t('NoData')"
      :showBorders="false"
      :showRowLines="true"
      :showColumnLines="false"
      :width="width"
      :height="height"
      :selectedRowKeys="internalSelectedRowKeys"
      :hover-state-enabled="true"
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
  </div>
</template>
<script setup>
import i18n from "@/plugins/i18n";
var { t } = i18n.global;
import { onBeforeMount, ref } from "vue";
import {
  DxDataGrid,
  DxColumn,
  DxSelection,
  DxEditing,
} from "devextreme-vue/data-grid";

const props = defineProps({
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
});

const emit = defineEmits();

const celltemplate = ref(null);
celltemplate.value = props.columns.map((x) => x.CellTemplate);
</script>
<style lang="scss">
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
