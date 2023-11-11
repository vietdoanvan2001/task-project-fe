<template lang="">
  <div>
    <DxDateBox
      class="base-date-box"
      :placeholder="placeholder"
      :width="width"
      :height="height"
      display-format="dd/MM/yyyy"
      :use-mask-behavior="true"
      type="date"
      @valueChanged="onValueChange($event)"
    />
  </div>
</template>
<script setup>
import { ref } from "vue";
import DxDateBox from "devextreme-vue/date-box";

const props = defineProps({
  placeholder: {
    type: String,
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
});

const emit = defineEmits();

/**
 * Đổi giá trị
 * @param {*} event
 */
function onValueChange(event) {
  if (event && event.value) {
    emit("onValueChanged", event.value);
  }
}
</script>
<style lang="scss" scoped>
.base-date-box {
  border-radius: 8px;
}
</style>
<style lang="scss">
.dx-dropdowneditor-icon {
  background: url("../../assets/images/ICON.svg") no-repeat -256px -161px;
  width: 16px;
  height: 15px;
}
.dx-icon-chevronright::before {
  content: ">";
}

.dx-icon-chevronleft::before {
  content: "<";
}

.dx-datebox-date .dx-dropdowneditor-icon::before {
  content: "" !important;
}
</style>
