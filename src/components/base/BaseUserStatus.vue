<template lang="">
  <div class="status-container" :class="selectedStatus?.Class">
    {{ selectedStatus?.Text }}
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import i18n from "@/plugins/i18n";
var { t } = i18n.global;
const selectedStatus = ref();
const props = defineProps({
  status: Number,
});
watch(
  () => props.status,
  () => {
    //Chở
    if (props.status == 0) {
      selectedStatus.value = {
        Text: t("WaitConfirm"),
        Class: "wating-user",
      };
    }
    //Hoạt động
    else if (props.status == 1) {
      selectedStatus.value = {
        Text: t("Active"),
        Class: "active-user",
      };
    }
    //Ngừng hoạt động
    else if (props.status == 2) {
      selectedStatus.value = {
        Text: t("InActive"),
        Class: "inactive-user",
      };
    }
    //Đang bị xóa
    else {
      selectedStatus.value = {
        Text: t("IsDeleted"),
        Class: "delete-user",
      };
    }
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.status-container {
  padding: 0 8px;
  min-width: 60px;
  width: fit-content;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
}

.wating-user {
  border-color: var(--blue-700);
  color: var(--blue-700);
  background-color: var(--blue-200);
}

.active-user {
  border-color: #11aa7a;
  color: #11aa7a;
  background-color: #b9f8e4;
}

.inactive-user {
  border-color: var(--bluegray-700);
  color: var(--bluegray-700);
  background-color: var(--bluegray-200);
}

.delete-user {
  border-color: var(--pink-700);
  color: var(--pink-700);
  background-color: var(--pink-200);
}
</style>
