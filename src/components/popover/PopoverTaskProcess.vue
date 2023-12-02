<template lang="">
  <div
    class="task-process-container"
    id="taskProcess"
    :style="
      processValue == 100
        ? { background: '#28aa37', color: 'var(--app-color-white)' }
        : ''
    "
  >
    <div class="task-status" @click="onClickStatus">
      {{ !processValue == 100 ? t("DoneJob") : t("Done") }}
    </div>
    <div
      class="task-process"
      @click="
        () => {
          isShowProcess = true;
        }
      "
    >
      <span class="bold mr-px-4" v-if="processValue < 100"
        >{{ processValue }}%</span
      >
      <div
        :class="
          processValue == 100 ? 'white-arrow-down-icon' : 'arrow-down-icon'
        "
      ></div>
    </div>
  </div>
  <BasePopover
    v-if="isShowProcess"
    :width="400"
    :target="'taskProcess'"
    :isVisible="isShowProcess"
    @onHidden="
      () => {
        isShowProcess = false;
      }
    "
  >
    <template v-slot:header>
      <div class="process-header">{{ t("TaskProcess") }}</div>
    </template>
    <template v-slot:content>
      <div class="process-content" @click="selectItem">
        <div class="d-flex center-center">
          <DxSlider
            v-model:value="sliderValue"
            :min="0"
            :max="100"
            :width="300"
            call-value-change="onHandleRelease"
          />
        </div>
        <div class="process-percent">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
        <div class="dx-field d-flex align-items-center pt-px-24">
          <div class="mr-px-12">{{ t("TypeProcess") }}</div>
          <div class="dx-field-value d-flex align-items-center">
            <DxNumberBox
              v-model:value="sliderValue"
              :min="0"
              :max="100"
              :width="80"
              :input-attr="{ 'aria-label': 'Slider Value' }"
            />
            <span class="ml-px-8">%</span>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="process-footer">
        <BaseButton :text="t('Confirm')" @onClick="confirmProcess"></BaseButton>
      </div>
    </template>
  </BasePopover>
</template>
<script setup>
import { onBeforeMount, ref, watch } from "vue";
import BasePopover from "../base/BasePopover.vue";
import { DxSlider } from "devextreme-vue/slider";
import { DxNumberBox } from "devextreme-vue/number-box";
import BaseButton from "../base/BaseButton.vue";
import { updateProcess } from "@/apis/task-service/task-service.js";
import i18n from "@/plugins/i18n";
import { showToast } from "@/utils/toast-message/toastMessage";
import { responseStatus } from "@/commons/enums/api-response-status";
var { t } = i18n.global;
const isShowProcess = ref(false);
const sliderValue = ref(0);
const processValue = ref(0);
const props = defineProps({
  process: Number,
  id: Number,
});
const emit = defineEmits();

onBeforeMount(() => {
  processValue.value = props.process;
  sliderValue.value = processValue.value;
});

watch(
  () => props.process,
  () => {
    processValue.value = props.process;
    sliderValue.value = processValue.value;
  }
);

async function updateTaskProcess() {
  try {
    const param = {
      TaskID: props.id,
      Process: processValue.value,
    };
    const res = await updateProcess(param);
    if (res && res.status && res.status == responseStatus.Success) {
      showToast.success(t("UpdateProcessSuccess"));
      emit("saveNewTaskSuccess");
    } else {
      showToast.error(t("Error"));
    }
  } catch (error) {
    console.log(error);
    showToast.error(t("Error"));
  }
}

function onClickStatus() {
  processValue.value < 100
    ? (sliderValue.value = processValue.value = 100)
    : (sliderValue.value = processValue.value = 0);
  updateTaskProcess();
}

function confirmProcess() {
  processValue.value = sliderValue.value;
  emit("onValueChanged", processValue.value);
  updateTaskProcess();
  isShowProcess.value = false;
}
</script>
<style lang="scss" scoped>
.task-process-container {
  display: flex;
  align-items: center;
  max-width: 170px;
  height: 36px;
  background: var(--app-color-white);
  border: 1px solid #ccc;
  border-radius: 8px;

  .task-status {
    padding: 0 12px;
    border-right: 1px solid #ccc;
    cursor: pointer;
  }
  .task-process {
    padding: 12px 12px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
.process-header {
  padding: 12px 24px 0 24px;
  font-weight: 700;
  font-size: 16px;
}

.process-content {
  padding: 12px 24px;

  .process-percent {
    margin-top: 8px;
    width: 312px;
    margin-left: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.process-footer {
  padding: 12px 24px 24px 24px;
  display: flex;
  justify-content: flex-end;
}
</style>
<style lang="scss">
.dx-slider-bar {
  height: 12px !important;
  border-radius: 8px !important;
  background-color: #e0e0e0;

  .dx-slider-range.dx-slider-range-visible {
    height: 10px !important;
    border-radius: 8px !important;
    background-color: #2196f3;
    .dx-slider-handle {
      width: 20px;
      height: 20px;
      margin-top: -7px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 5px 2px #9e9e9e;
    }
  }
}
</style>
