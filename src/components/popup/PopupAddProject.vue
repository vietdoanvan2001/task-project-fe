<template lang="">
  <div>
    <BasePopup
      :width="620"
      :title="t('AddNewProjectTitle')"
      :isVisible="isVisible"
      @onHidden="closePopup"
    >
      <template v-slot:content>
        <div class="popup-content">
          <div class="row">
            <div class="row-item">
              <div class="item-label">{{ t("ProjectName") }}</div>
              <div class="item-content d-flex align-items-center">
                <div
                  class="select-icon"
                  id="selectIcon"
                  @click="showIconSelection"
                >
                  <div
                    class="background-selected"
                    :class="`project-background-${backgroundIndex}`"
                  ></div>
                  <div
                    class="icon-selected"
                    :class="`white-project-icon-${iconIndex}`"
                  ></div>
                </div>
                <BaseTextBox
                  class="flex-1"
                  :placeHolder="t('ProjectName')"
                  :height="38"
                  :isForm="true"
                ></BaseTextBox>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="row-item flex-1 mr-px-16">
              <div class="item-label">{{ t("FromDate") }}</div>
              <div class="item-content">
                <BaseDateBox
                  :height="38"
                  :placeholder="t('FromDate')"
                ></BaseDateBox>
              </div>
            </div>
            <div class="row-item flex-1">
              <div class="item-label">{{ t("ToDate") }}</div>
              <div class="item-content">
                <BaseDateBox
                  :height="38"
                  :placeholder="t('FromDate')"
                ></BaseDateBox>
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
          <div class="row">
            <div class="row-item">
              <div
                class="item-label d-flex align-items-center justify-content-between"
              >
                {{ t("Member") }}
                <div
                  class="d-flex center-center pointer"
                  @click="
                    () => {
                      isShowAddMemberPopup = true;
                    }
                  "
                >
                  <div class="add-member-icon mr-px-4"></div>
                  <div class="primary-color">{{ t("AddMember") }}</div>
                </div>
              </div>
              <div class="item-content"></div>
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

  <BasePopover
    :target="'selectIcon'"
    :isVisible="isShowIconSelection"
    @onHidden="
      () => {
        isShowIconSelection = false;
      }
    "
  >
    <template v-slot:content>
      <div class="icon-select-area">
        <div class="icon mr-px-12">
          <div class="bold pb-px-8">{{ t("Icon") }}</div>
          <div class="d-flex flex-wrap mt-px-16">
            <div v-for="index in 15" :key="index" class="wrap-icon">
              <div
                class="icon-background"
                :class="
                  index == iconIndex
                    ? `project-background-${backgroundIndex}`
                    : ''
                "
              >
                <div
                  :class="
                    index == iconIndex
                      ? `white-project-icon-${index}`
                      : `project-icon-${index}`
                  "
                  class="icon-content pointer"
                  @click="
                    () => {
                      iconIndex = index;
                    }
                  "
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="color">
          <div class="bold">{{ t("Color") }}</div>
          <div class="d-flex flex-wrap mt-px-16">
            <div v-for="index in 9" :key="index" class="wrap-background">
              <div
                class="icon-background"
                :class="`project-background-${index}`"
                @click="
                  () => {
                    backgroundIndex = index;
                  }
                "
              >
                <div class="tick-icon" v-if="index == backgroundIndex"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BasePopover>
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
import { ref } from "vue";
import i18n from "@/plugins/i18n";
var { t } = i18n.global;

const isShowIconSelection = ref(false);
const isShowAddMemberPopup = ref(false);
const iconIndex = ref(1);
const backgroundIndex = ref(1);

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits();

/**
 * Hiển thị popover chọn item
 */
function showIconSelection() {
  isShowIconSelection.value = !isShowIconSelection.value;
}

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
  padding: 0 24px;
  .row {
    display: flex;
    padding-bottom: 16px;
    .row-item {
      width: 100%;
      .item-label {
        font-weight: 600;
        font-size: 15px;
        padding-bottom: 8px;
      }

      .item-content {
        width: 100%;

        .select-icon {
          position: relative;
          height: 40px;
          width: 40px;
          margin-right: 12px;
          border-radius: 8px;
          background-color: #f2f2f2;
          cursor: pointer;

          .background-selected {
            margin-top: 8px;
            margin-left: 8px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
          }

          .icon-selected {
            position: absolute;
            top: 12px;
            left: 12px;
          }
        }
      }
    }
  }
}

.icon-select-area {
  display: flex;
  padding: 24px;
  .icon {
    width: 200px;
    .wrap-icon {
      min-width: 40px;
      min-height: 40px;
      .icon-background {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        position: relative;
      }
      .icon-content {
        position: absolute;
        left: 4px;
        top: 4px;
      }
    }
  }

  .color {
    width: 120px;
    .wrap-background {
      min-width: 40px;
      min-height: 40px;
      padding-top: 8px;
      .icon-background {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        position: relative;

        .tick-icon {
          position: absolute;
          top: 7px;
          left: 5px;
          width: 13px !important;
          height: 9px !important;
          -webkit-mask-image: url("../../assets/images/ICON.svg");
          -webkit-mask-position: -585px -108px;
          -webkit-mask-repeat: no-repeat;
          background-color: var(--app-color-white);
        }
      }
    }
  }
}
</style>
