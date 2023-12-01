<template lang="">
  <div
    class="d-flex align-items-center pointer"
    :id="target"
    :title="selectedItem.projectName"
    @click="
      () => {
        isVisible = true;
      }
    "
  >
    <div class="mr-px-8 item-background" :class="selectedItem.background">
      <div :class="selectedItem.icon"></div>
    </div>
    <div
      class="project-name"
      :style="maxWidthText ? { maxWidth: `${maxWidthText}px` } : {}"
    >
      {{ selectedItem.projectName }}
    </div>
    <div class="arrow-down-icon mt-px-2 ml-px-8"></div>
  </div>
  <BasePopover
    v-if="isVisible"
    :width="width"
    :target="target"
    :isVisible="isVisible"
    @onHidden="onHidden"
  >
    <template v-slot:header>
      <div class="bold pd-px-16">
        {{ t("SelectProject") }}
      </div>
    </template>
    <template v-slot:content>
      <div class="pl-px-16 pr-px-16">
        <BaseSearchInput
          :placeHolder="t('ProjectSearch')"
          @onValueChanged="searchProject"
        ></BaseSearchInput>
      </div>
      <div class="wrap-item">
        <div
          v-for="(item, index) in listDataClone"
          :key="index"
          class="selected-item"
          :title="item.projectName"
          @click="selectItem(item)"
        >
          <div class="item-background" :class="item.background">
            <div :class="item.icon"></div>
          </div>
          <div class="item-text">
            {{ item.projectName }}
          </div>
        </div>
        <div class="no-data-project" v-if="!listDataClone.length">
          {{ t("NoData") }}
        </div>
      </div>
    </template>
  </BasePopover>
</template>
<script setup>
import BasePopover from "@/components/base/BasePopover.vue";
import BaseSearchInput from "@/components/base/BaseSearchInput.vue";
import { onBeforeMount, ref, watch } from "vue";
import i18n from "@/plugins/i18n";
import Project from "@/commons/models/Project";
var { t } = i18n.global;

const props = defineProps({
  width: Number,
  dataSource: Array,
  selectedItem: Project,
  target: String,
  maxWidthText: Number,
});
const emit = defineEmits();
const isVisible = ref(false);
const listDataClone = ref(Array < Project > []);
const selectedItem = ref(new Project());

watch(
  () => props.selectedItem,
  () => {
    if (props.selectedItem) {
      selectedItem.value = props.selectedItem;
    }
  },
  { immediate: true }
);

watch(
  () => props.dataSource,
  () => {
    listDataClone.value = [...props.dataSource];
  }
);

onBeforeMount(() => {
  if (props.dataSource) {
    listDataClone.value = [...props.dataSource];
  }
});

/**
 * Tìm kiếm dự án
 * @param {*} keyWord
 */
function searchProject(keyWord) {
  if (props.dataSource && props.dataSource.length) {
    listDataClone.value = [];
    props.dataSource.forEach((element) => {
      if (
        element.projectName
          .toLowerCase()
          .trim()
          .includes(keyWord.toLowerCase().trim())
      ) {
        listDataClone.value.push(element);
      }
    });
  }
}

/**
 * Chọn phòng ban
 * @param {*} item
 */
function selectItem(item) {
  selectedItem.value = item;
  onHidden();
  emit("onSelectedItem", selectedItem.value);
}

/**
 * Ẩn popover
 */
function onHidden() {
  isVisible.value = false;
  listDataClone.value = [...props.dataSource];
  emit("onHidden");
}
</script>
<style lang="scss" scoped>
.wrap-item {
  max-height: 300px;
  overflow: auto;
  .selected-item {
    height: 42px;
    padding: 0 16px;

    display: flex;
    align-items: center;
    cursor: pointer;

    .item-text {
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .no-data-project {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-style: italic;
    color: var(--app-color-secondary-text);
  }
  .selected-item:hover {
    background-color: var(--app-items-hover);
  }
}
.item-background {
  min-height: 24px;
  min-width: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}
</style>
