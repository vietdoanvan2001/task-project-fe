<template lang="">
  <BasePopover
    :width="width"
    :target="target"
    :isVisible="isVisible"
    @onHidden="onHidden"
  >
    <template v-slot:header>
      <div class="header-class">
        {{ title }}
      </div>
    </template>
    <template v-slot:content>
      <div class="content-class">
        <div v-for="(item, index) in listData" :key="index">
          <div
            class="d-flex align-items-center justify-content-between select-item"
            :style="
              selected && selected.ID > -1 && index == selected.ID
                ? { backgroundColor: '#e1eeff !important' }
                : {}
            "
            @click="selectItem(item)"
          >
            <div class="pr-px-8">
              {{ item.Name }}
            </div>
            <div
              class="primary-ticked-icon"
              v-if="selected && selected.ID > -1 ? index == selected.ID : false"
            ></div>
          </div>
        </div>
      </div>
    </template>
  </BasePopover>
</template>
<script setup>
import BasePopover from "@/components/base/BasePopover.vue";
import { onBeforeMount, ref } from "vue";
import i18n from "@/plugins/i18n";
var { t } = i18n.global;

const props = defineProps({
  width: Number,
  target: String,
  isVisible: Boolean,
  title: String,
  listData: Array,
  selectedItem: Object,
});

const selected = ref(props.selectedItem);

const emit = defineEmits();

/**
 * Ẩn popover
 */
function onHidden() {
  emit("onHidden");
}

function selectItem(item) {
  selected.value = item;
  emit("onValueChanged", selected);
  onHidden();
}
</script>
<style lang="scss" scoped>
.header-class {
  padding: 24px 24px 8px 24px;
  font-weight: 700;
}
.content-class {
  // padding-top: 52px;

  .select-item {
    padding: 8px 24px;
    cursor: pointer;
    background-color: #ffffff !important;
  }
  .select-item:hover {
    background-color: #e1eeff !important;
  }
}
</style>
