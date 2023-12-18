<template lang="">
  <div class="login-container">
    <div class="login-content">
      <div class="login-header">
        <div class="app-logo"></div>
        <div class="title pl-px-12">{{ t("Login") }}</div>
      </div>
      <div class="error-area" v-if="showErrorArea">
        <div class="icon-false"></div>
        <div class="error-area-text">
          {{ t("WrongAccount") }}
        </div>
      </div>
      <BaseTextbox
        class="mb-px-12"
        :height="48"
        :placeHolder="t('EmailOrPhone')"
        :fieldName="t('EmailOrPhone')"
        :errorMessage="acc.UsernameErrorMsg"
        @onFocusIn="
          () => {
            acc.UsernameErrorMsg = '';
          }
        "
        @onValueChanged="
          (event) => {
            acc.Username = event;
          }
        "
      ></BaseTextbox>

      <BaseTextbox
        :height="48"
        :placeHolder="t('PassWord')"
        :fieldName="t('PassWord')"
        :errorMessage="acc.PasswordErrorMsg"
        @onFocusIn="
          () => {
            acc.PasswordErrorMsg = '';
          }
        "
        mode="password"
        @onValueChanged="
          (event) => {
            acc.Password = event;
          }
        "
      ></BaseTextbox>

      <div class="d-flex align-items-center mt-px-16">
        <div>{{ t("DontHaveAccount") }}</div>
        <div
          class="primary-color pointer hover-underline ml-px-4"
          @click="register"
        >
          {{ t("Register") }}
        </div>
      </div>

      <BaseButton
        class="mt-px-24"
        :text="t('Login')"
        :width="304"
        :height="48"
        @onClick="onClickLogin"
      ></BaseButton>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, onBeforeUnmount, ref, watch } from "vue";
import BaseTextbox from "@/components/base/BaseTextbox.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import eventBus from "@/utils/event-bus/event-bus.js";
import { isNullOrEmpty } from "@/utils/functions/commonFns.js";
import { responseStatus } from "@/commons/enums/api-response-status.js";
import ToastData from "@/commons/models/ToastData";
import { ToastType } from "@/commons/contants/toast-type.js";
import { onLogin } from "@/apis/user-service/user-service.js";
import Account from "@/commons/models/Account.js";
import { showToast } from "@/utils/toast-message/toastMessage";
import router from "../router";
import i18n from "@/plugins/i18n";
var { t } = i18n.global;

const { emit } = eventBus();
var acc = ref(new Account());
const allowLogin = ref(false);
const showErrorArea = ref(false);

/**
 * kiểm tra trường thông tin
 */
function validateField() {
  if (isNullOrEmpty(acc.value.Username)) {
    acc.value.UsernameErrorMsg = t("NotEmpty");
    allowLogin.value = false;
  } else {
    acc.value.UsernameErrorMsg = "";
  }
  if (isNullOrEmpty(acc.value.Password)) {
    acc.value.PasswordErrorMsg = t("NotEmpty");
    allowLogin.value = false;
  } else {
    acc.value.PasswordErrorMsg = "";
  }
}

/**
 * Đăng ký
 */
function register() {
  router.push("/register");
}

/**
 * Xử lý trước khi đăng nhập
 */
function onBeforeLogin() {
  allowLogin.value = true;
  validateField();
  showErrorArea.value = false;
}

/**
 * Đăng nhập
 */
async function onClickLogin() {
  onBeforeLogin();
  if (!allowLogin.value) {
    return;
  }
  try {
    const res = await onLogin(acc.value);
    if (res && res.status && res.status == responseStatus.Success) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("currentUserID", res.data.data.id);
      localStorage.setItem("currentUser", JSON.stringify(res.data.data));
      showToast.success(t("LoginSuccess"));
      router.push("/management");
    } else {
      showErrorArea.value = true;
    }
  } catch (error) {
    showErrorArea.value = true;
  }
}
</script>
<style lang="scss" scoped>
.login-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: url("../assets/images/Login-img.jpg") no-repeat;
  background-size: cover;
  .login-content {
    position: absolute;
    width: 400px;
    min-height: 400px;
    background-color: var(--app-color-white);
    border-radius: 8px;
    padding: 48px 48px 40px 48px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12);
    .error-area {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      border: 1px solid var(--app-color-danger);
      border-radius: 4px;
      padding: 8px 12px;
      background-color: #fff9fa;
      .error-area-text {
        margin-top: 2px;
        margin-left: 8px;
        font-size: 12px;
        color: var(--app-color-danger);
      }
    }
    .login-header {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 36px;
      .app-logo {
        background: url("../assets/images/ICON.svg") no-repeat -40px -488px;
        width: 48px;
        height: 48px;
      }
    }
  }
}
</style>

<style lang="scss">
.login-container {
  .dx-button-text {
    font-weight: 700;
  }
}
</style>
