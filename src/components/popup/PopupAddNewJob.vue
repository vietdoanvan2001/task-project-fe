<template lang="">
  <div>
    <BasePopup
      :width="620"
      :title="t('AddNewJob')"
      :isVisible="isVisible"
      @onHidden="closePopup"
    >
      <template v-slot:content>
        <div class="popup-content">
          <div class="row">
            <div class="mr-px-16">
              <div
                class="d-flex align-items-center pointer"
                id="selectProject"
                @click="
                  () => {
                    showSelectionProject = true;
                  }
                "
              >
                <div
                  class="mr-px-8"
                  :style="{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#000',
                  }"
                ></div>
                <div class="project-name">Công việc cá nhân</div>
                <div class="arrow-down-icon mt-px-2 ml-px-8"></div>
              </div>
            </div>
            <div
              class="d-flex align-items-center pointer"
              id="selectStatus"
              @click="
                () => {
                  showSelectionStatus = true;
                }
              "
            >
              <div class="status-name line-clamp-1">Cần thực hiện</div>
              <div class="arrow-down-icon mt-px-2 ml-px-8"></div>
            </div>
          </div>
          <div class="row">
            <div class="row-item">
              <div class="item-label">{{ t("TaskName") }}</div>
              <div
                class="item-content d-flex align-items-center"
                @click="showIconSelection"
              >
                <BaseTextBox
                  class="flex-1"
                  :placeHolder="t('TaskName')"
                  :height="38"
                  :isForm="true"
                ></BaseTextBox>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="row-item flex-1 mr-px-16">
              <div class="item-label">{{ t("StartDate") }}</div>
              <div class="item-content">
                <BaseDateBox
                  :height="38"
                  :placeholder="t('StartDate')"
                ></BaseDateBox>
              </div>
            </div>
            <div class="row-item flex-1">
              <div class="item-label">{{ t("EndDate") }}</div>
              <div class="item-content">
                <BaseDateBox
                  :height="38"
                  :placeholder="t('EndDate')"
                ></BaseDateBox>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="row-item">
              <div class="item-label">{{ t("Implementer") }}</div>
              <div class="item-content">
                <div
                  class="chose-implementer pl-px-16 pointer"
                  id="choseImplementer"
                  @click="
                    () => {
                      showSelectionPopup = true;
                    }
                  "
                >
                  <div class="implementer-icon"></div>
                  <div class="pl-px-8 pr-px-8">
                    {{ t("ChoseImplementer") }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="row-item">
              <div class="item-label">{{ t("Description") }}</div>
              <div class="item-content">
                <BaseTextArea :placeholder="t('Description')"></BaseTextArea>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="popup-footer">
          <BaseButton
            class="mr-px-8"
            :text="t('Cancel')"
            :type="ButtonType.SubButton"
            :height="40"
          ></BaseButton>
          <BaseButton
            :text="t('Save')"
            :type="ButtonType.PriButton"
            :height="40"
          ></BaseButton>
        </div>
      </template>
    </BasePopup>
  </div>

  <PopoverChoseImplementer
    :width="278"
    :target="'choseImplementer'"
    :isVisible="showSelectionPopup"
    :title="t('ChoseImplementer')"
    :searchPlaceHolder="t('MemberSearch')"
    @onHidden="
      () => {
        showSelectionPopup = false;
      }
    "
  ></PopoverChoseImplementer>

  <PopoverChoseImplementer
    :width="278"
    :target="'selectProject'"
    :title="t('SelectProject')"
    :searchPlaceHolder="t('ProjectSearch')"
    :isVisible="showSelectionProject"
    @onHidden="
      () => {
        showSelectionProject = false;
      }
    "
  ></PopoverChoseImplementer>

  <PopoverSelectList
    :width="224"
    :target="'selectStatus'"
    :title="t('SelectStatus')"
    :listData="JobStatus"
    :isVisible="showSelectionStatus"
    :selectedItem="selectedStatus"
    @onHidden="
      () => {
        showSelectionStatus = false;
      }
    "
  ></PopoverSelectList>

  <PopupAddNewMember
    :isVisible="isShowAddMemberPopup"
    @onHidden="
      () => {
        isShowAddMemberPopup = false;
      }
    "
  ></PopupAddNewMember>
</template>
<script setup>
import BasePopup from "@/components/base/BasePopup.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseTextBox from "@/components/base/BaseTextbox.vue";
import BaseDateBox from "@/components/base/BaseDateBox.vue";
import BaseTextArea from "@/components/base/BaseTextArea.vue";
import BasePopover from "@/components/base/BasePopover.vue";
import { ButtonType } from "@/commons/contants/button-type";
import PopupAddNewMember from "@/components/popup/PopupAddMember.vue";
import PopoverChoseImplementer from "@/components/popover/PopoverChoseImplementer.vue";
import PopoverSelectList from "@/components/popover/PopoverSelectList.vue";
import { JobStatus } from "@/commons/contants/job-status.js";
import { ref } from "vue";
import i18n from "@/plugins/i18n";
var { t } = i18n.global;

const isShowAddMemberPopup = ref(false);
const showSelectionProject = ref(false);
const showSelectionStatus = ref(false);
const showSelectionPopup = ref(false);
let selectedStatus = JobStatus[0];

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits();

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
  .chose-implementer {
    width: 278px;
    height: 74px;
    background-color: #f5f5f5;
    border-radius: 8px;
    display: flex;
    align-items: center;
  }
  .project-name {
    max-width: 280px;
    height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .status-name {
    max-width: 190px;
    height: 18px;
  }
}
</style>
