<template>
  <div
    class="d-flex align-items-center"
    id="avatar"
    @click="
      () => {
        isShowInforPopup = true;
      }
    "
  >
    <div class="avatar-32 pointer"></div>
  </div>
  <BasePopover
    :width="300"
    :target="'avatar'"
    :isVisible="isShowInforPopup"
    @onHidden="
      () => {
        isShowInforPopup = false;
        isShowLanguageSelection = false;
      }
    "
  >
    <template v-slot:content>
      <div class="infor">
        <div class="avatar"></div>
        <div class="user-name">Đoàn Văn Việt</div>
        <div class="user-email pb-px-16">dvviet1@gmail.com</div>
        <div class="funtion-item">
          <div class="icon">
            <div class="change-password-icon"></div>
          </div>
          <div>
            {{ t("ChangePassword") }}
          </div>
        </div>
        <div class="funtion-item">
          <div class="icon">
            <div class="user-setting-icon"></div>
          </div>
          <div>
            {{ t("UserSetting") }}
          </div>
        </div>
        <div
          class="funtion-item"
          @click="
            () => {
              isShowLanguageSelection = !isShowLanguageSelection;
            }
          "
        >
          <div class="icon">
            <div :class="languageSelected.Icon"></div>
          </div>
          <div>
            {{ t("Language") }}:
            <span class="bold">{{ languageSelected.Name }}</span>
          </div>
          <div class="arrow-down-icon ml-px-8"></div>
          <div class="select-language" v-if="isShowLanguageSelection">
            <div v-for="(item, index) in LanguageOption" :key="index">
              <div
                :style="
                  languageSelected.ID == index
                    ? { backgroundColor: '#e1eeff' }
                    : ''
                "
                class="select-language-item d-flex align-items-center pd-px-12"
                @click="selectLanguage(item)"
              >
                <div class="mr-px-12" :class="item.Icon"></div>
                {{ item.Name }}
                <div
                  class="primary-ticked-icon ml-px-12"
                  v-if="languageSelected.ID == index"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="footer">
        <div class="logout-icon mr-px-12"></div>
        {{ t("Logout") }}
      </div>
    </template>
  </BasePopover>
</template>
<script setup>
import BasePopover from "@/components/base/BasePopover.vue";
import { LanguageOption } from "@/commons/contants/language-option.js";
import { getAvatar } from "@/utils/functions/commonFns.js";
import { ref } from "vue";
import i18n from "@/plugins/i18n";
var { t } = i18n.global;
const isShowInforPopup = ref(false);
const isShowLanguageSelection = ref(false);
const languageSelected = ref({
  ID: 0,
  Name: t("VietnameseVI"),
  Icon: "vietnam-flag-icon",
});

/**
 * Chọn ngôn ngữ
 */
function selectLanguage(item) {
  languageSelected.value = item;
}
</script>
<style lang="scss" scoped>
.infor {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 32px;
  .avatar {
    width: 64px;
    height: 64px;
    border: 1px solid #ccc;
    border-radius: 50%;
    margin-bottom: 12px;
  }
  .user-name {
    margin-bottom: 4px;
    font-size: 20px;
    font-weight: bold;
    padding: 0 24px;
    line-height: 30px;
  }

  .user-email {
    font-size: 13px;
    color: #666;
    line-height: 19px;
  }

  .funtion-item {
    display: flex;
    height: 40px;
    width: 100%;
    padding: 0 16px;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;

    .icon {
      min-width: 40px;
      min-height: 40px;
      display: flex;
      align-items: center;
      padding: 0 16px 0 12px;
    }

    .select-language {
      position: absolute;
      bottom: -24px;
      left: 120px;
      background-color: #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      z-index: 9;
    }
  }
  .select-language-item:hover,
  .funtion-item:hover {
    background-color: #e1eeff !important;
  }
}
.footer {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  width: 100%;
  border-top: 1px solid #e0e0e0;
  cursor: pointer;
}
.footer:hover {
  background-color: #e1eeff !important;
}
</style>
