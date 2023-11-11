<template lang="">
  <div
    :class="
      mode == 'specialSearch' ? 'special-search-input' : 'normal-search-input'
    "
    class="search-input"
  >
    <div class="search-icon"></div>
    <DxTextBox
      ref="textBox"
      :placeholder="placeHolder"
      :width="width"
      :height="height"
      :mode="mode"
      @valueChanged="onValueChange($event)"
    >
    </DxTextBox>
  </div>
</template>
<script setup>
import DxTextBox from "devextreme-vue/text-box";
import { ref } from "vue";

const props = defineProps({
  placeHolder: {
    type: String,
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
  mode: {
    type: String,
  },
});

const emit = defineEmits();

/**
 * Thay đổi giá trị ô input
 * @param {*} event
 */
function onValueChange(event) {
  if (event) {
    emit("onValueChanged", event.value);
  }
}
</script>
<style lang="scss" scoped>
.search-input {
  position: relative;
  .search-icon {
    position: absolute;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.special-search-input {
  .search-icon {
    left: 24px;
    top: 10px;
  }

  .dx-editor-outlined {
    border: none !important;
    border-bottom: 1px solid hsla(0, 0%, 100%, 0.16) !important;
    background: inherit !important;
    border-radius: 0;
    margin: 0 24px;
    padding-left: 20px;
  }

  .dx-texteditor-input {
    color: var(--app-color-white) !important;
  }
}

.normal-search-input {
  .dx-editor-outlined {
    border-radius: 8px;
    padding-left: 28px;
  }

  .search-icon {
    left: 12px;
    top: 10px;
  }
}
</style>
