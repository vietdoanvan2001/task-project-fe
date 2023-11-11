<template lang="">
  <div>
    <DxTextArea
      class="base-text-area"
      :height="90"
      :placeholder="placeholder"
    />
  </div>
</template>
<script setup>
import { ref } from "vue";
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
});
</script>
<style lang="scss" scoped>
.base-text-area {
  border-radius: 8px;
}
</style>
