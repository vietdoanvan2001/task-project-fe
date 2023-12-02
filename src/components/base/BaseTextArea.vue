<template lang="">
  <div>
    <DxTextArea
      class="base-text-area"
      :height="90"
      :placeholder="placeholder"
      :value="textValue"
      @valueChanged="onValueChange($event)"
      @focusIn="onFocusIn($event)"
      @focusOut="onFocusOut($event)"
      @contentReady="onContentReady($event)"
    />
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import DxTextArea from "devextreme-vue/text-area";

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
  value: String,
});

const emit = defineEmits();
const textValue = ref("");

watch(
  () => props.value,
  () => {
    textValue.value = props.value;
  }
);

/**
 * Đổi giá trị
 * @param {*} event
 */
function onValueChange(event) {
  if (event && event.value) {
    emit("onValueChanged", event.value);
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
.base-text-area {
  border-radius: 8px;
}
</style>
