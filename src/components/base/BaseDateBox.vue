<template lang="">
  <div :class="errorMessage ? 'error' : ''">
    <DxDateBox
      class="base-date-box"
      :placeholder="placeholder"
      :width="width"
      :height="height"
      display-format="dd/MM/yyyy"
      :use-mask-behavior="true"
      :value="dateValue"
      type="date"
      @valueChanged="onValueChange($event)"
      @focusIn="onFocusIn($event)"
      @focusOut="onFocusOut($event)"
      @contentReady="onContentReady($event)"
    />
    <div class="mt-px-4 error-color error-font" v-if="errorMessage">
      {{ fieldName + " " + errorMessage }}
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
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
  errorMessage: {
    type: String,
  },
  fieldName: {
    type: String,
  },
  value: String,
});

const emit = defineEmits();
const dateValue = ref();

watch(
  () => props.value,
  () => {
    dateValue.value = new Date(props.value);
  }
);

/**
 * Đổi giá trị
 * @param {*} event
 */
function onValueChange(event) {
  if (event && event.value) {
    const date = new Date(event.value);
    date.setHours(12);
    emit("onValueChanged", date);
  }
}

/**
 * focus in
 * @param {*} event
 */
function onFocusIn(event) {
  if (event) {
    emit("onFocusIn");
  }
}

/**
 * focus out
 * @param {*} event
 */
function onFocusOut(event) {
  if (event) {
    emit("onFocusOut");
  }
}

/**
 * Khởi tạo
 * @param {*} event
 */
function onContentReady(event) {
  if (event) {
    emit("onContentReady");
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
