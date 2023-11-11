<template lang="">
  <BasePopover
    :width="width"
    :height="360"
    :target="target"
    :isVisible="isVisible"
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
    </template>
  </BasePopover>
</template>
<script setup>
import BasePopover from "@/components/base/BasePopover.vue";
import BaseSearchInput from "@/components/base/BaseSearchInput.vue";
import { ref } from "vue";
import i18n from "@/plugins/i18n";
var { t } = i18n.global;

const props = defineProps({
  width: Number,
  target: String,
  isVisible: Boolean,
  title: String,
  searchPlaceHolder: String,
});
const emit = defineEmits();

/**
 * Ẩn popover
 */
function onHidden() {
  emit("onHidden");
}
</script>
<style lang="scss"></style>
