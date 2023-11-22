<template lang="">
  <BasePopover
    :width="width"
    :target="target"
    :isVisible="isVisible"
    :position="'bottom'"
    @onHidden="onHidden"
  >
    <template v-slot:header>
      <div class="bold pd-px-16">
        {{ title }}
      </div>
    </template>
    <template v-slot:content>
      <div class="pl-px-16 pr-px-16">
        <BaseSearchInput :placeHolder="searchPlaceHolder"></BaseSearchInput>
      </div>
      <div class="wrap-selection">
        <div
          class="selection-item d-flex"
          v-for="(item, index) in dataSourceClone"
          :key="index"
          @click="onSelectedItem(item)"
        >
          <div
            class="avatar-32 bold"
            :style="{
              backgroundColor: getAvatar(item).Background,
              color: '#ffffff',
            }"
          >
            {{ getAvatar(item).Text }}
          </div>
          <div class="ml-px-12">
            <div class="bold">
              {{ item.fullName }}
            </div>
            <div>
              {{ item.email }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </BasePopover>
</template>
<script setup>
import { getAvatar } from "@/utils/functions/commonFns.js";
import BasePopover from "@/components/base/BasePopover.vue";
import BaseSearchInput from "@/components/base/BaseSearchInput.vue";
import { ref, watch } from "vue";
import i18n from "@/plugins/i18n";
import Users from "@/commons/models/Users";
var { t } = i18n.global;

const props = defineProps({
  width: Number,
  target: String,
  isVisible: Boolean,
  title: String,
  searchPlaceHolder: String,
  dataSource: Array,
});
const emit = defineEmits();
const dataSourceClone = ref(Array < Users > []);

watch(
  () => props.dataSource,
  () => {
    dataSourceClone.value = [...props.dataSource];
  },
  { immediate: true }
);

function onSelectedItem(item) {
  emit("onSelectedItem", item);
  onHidden();
}

/**
 * Ẩn popover
 */
function onHidden() {
  emit("onHidden");
}
</script>
<style lang="scss" scoped>
.wrap-selection {
  height: 300px;
  overflow: auto;

  .selection-item {
    height: 48px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .selection-item:hover {
    background-color: var(--app-items-hover);
  }
}
</style>
