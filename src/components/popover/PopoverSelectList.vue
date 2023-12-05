<template lang="">
  <div
    class="d-flex align-items-center pointer"
    :id="target"
    :title="selected?.Name??selected?.ColumnName"
    @click="
      () => {
        isVisible = true;
      }
    "
  >
    <div class="status-name line-clamp-1">{{ selected?.Name??selected?.ColumnName }}</div>
    <div class="arrow-down-icon mt-px-2 ml-px-8"></div>
  </div>
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
          <!-- <div
            class="d-flex align-items-center justify-content-between select-item"
            :style="
              selected &&
              selected.KanbanID > -1 &&
              item.KanbanID == selected.KanbanID
                ? { backgroundColor: '#e1eeff !important' }
                : {}
            "
            @click="selectItem(item)"
          > -->
          <div
            class="d-flex align-items-center justify-content-between select-item"
            @click="selectItem(item)"
          >
            <div class="pr-px-8">
              {{ item.Name??item?.ColumnName }}
            </div>
            <!-- <div
              class="primary-ticked-icon"
              v-if="
                selected && selected.KanbanID > -1
                  ? item.KanbanID == selected.KanbanID
                  : false
              "
            ></div> -->
          </div>
        </div>
      </div>
    </template>
  </BasePopover>
</template>
<script setup>
import BasePopover from "@/components/base/BasePopover.vue";
import { onBeforeMount, ref, watch } from "vue";
import i18n from "@/plugins/i18n";
var { t } = i18n.global;

const props = defineProps({
  width: Number,
  title: String,
  listData: Array,
  selectedItem: Object,
  target: String,
});

const selected = ref(props.selectedItem);
watch(
  () => props.selectedItem,
  () => {
    selected.value = props.selectedItem;
  },
  {
    immediate: true,
  }
);
const isVisible = ref(false);

const emit = defineEmits();

/**
 * Ẩn popover
 */
function onHidden() {
  isVisible.value = false;
  emit("onHidden");
}

/**
 * Chọn item
 * @param {*} item
 */
function selectItem(item) {
  selected.value = item;
  emit("onValueChanged", selected.value);
  onHidden();
}
</script>
<style lang="scss" scoped>
.header-class {
  padding: 12px 24px 8px 24px;
  font-weight: 700;
  font-size: 14px;
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
