<template lang="">
  <div>
    <BasePopup
      :width="400"
      :isVisible="isVisible"
      @onHidden="closePopup"
      :title="t('DeleteWarning')"
    >
      <template v-slot:content>
        <div :style="{ padding: '8px 24px 16px 24px' }">
          {{ text }}
        </div>
      </template>
      <template v-slot:footer>
        <div class="popup-footer">
          <BaseButton
            class="mr-px-8"
            :text="t('Cancel')"
            :type="ButtonType.SubButton"
            :height="40"
            @onClick="closePopup"
          ></BaseButton>
          <BaseButton
            :text="t('DeleteAll')"
            :type="ButtonType.PriButton"
            :height="40"
            :mode="'delete'"
            @onClick="confirmDelete"
          ></BaseButton>
        </div>
      </template>
    </BasePopup>
  </div>
</template>
<script setup>
import BasePopup from "@/components/base/BasePopup.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import { ButtonType } from "@/commons/contants/button-type";
import { onBeforeMount, ref, watch } from "vue";
import i18n from "@/plugins/i18n";
var { t } = i18n.global;

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  text: String,
});
const emit = defineEmits();

function confirmDelete() {
  emit("confirmDelete");
}

/**
 * Đóng popup
 */
function closePopup() {
  emit("onHiddenPopup");
}
</script>
<style lang="scss" scope>
.popup-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 24px;
}
.popup-content {
}
</style>
