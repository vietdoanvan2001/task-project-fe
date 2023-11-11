<template lang="">
  <div>
    <DxRadioGroup
      :items="dataSource"
      :value="value"
      :value-expr="valueExpr"
      :display-expr="displayExpr"
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
</script>
<style lang="scss">
.dx-collection {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
