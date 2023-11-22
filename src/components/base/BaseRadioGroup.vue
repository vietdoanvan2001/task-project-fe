<template lang="">
  <div>
    <DxRadioGroup
      :items="dataSource"
      :value="value"
      :value-expr="valueExpr"
      :display-expr="displayExpr"
      @valueChanged="onValueChanged($event)"
    />
  </div>
</template>
<script setup>
import DxRadioGroup from "devextreme-vue/radio-group";

const props = defineProps({
  dataSource: Array,
  value: Object,
  valueExpr: String,
  displayExpr: String,
});

const emit = defineEmits();

/**
 * Đổi lựa chọn
 * @param {*} event
 */
function onValueChanged(event) {
  if (event && event.value) {
    emit("onValueChange", event.value);
  }
}
</script>
<style lang="scss">
.dx-collection {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
