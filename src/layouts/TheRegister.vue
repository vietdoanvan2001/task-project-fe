<template>
  <div class="register-container">
    <div class="register-content">
      <div class="login-header">
        <div class="app-logo"></div>
        <div class="title pl-px-12">{{ t("Register") }}</div>
      </div>
      <div class="error-area" v-if="serviceError.length">
        <div class="icon-false"></div>
        <div class="error-area-text">
          <div v-for="(item, index) in serviceError" :key="index">
            {{ t(item.errorField) + " " + item.userMsg + "!" }}
          </div>
        </div>
      </div>
      <BaseTextbox
        class="register-input"
        :height="48"
        :place-holder="t('FullName')"
        :fieldName="t('FullName')"
        :errorMessage="userData.FullNameErrorMsg"
        @onFocusIn="
          () => {
            userData.FullNameErrorMsg = '';
          }
        "
        @onValueChanged="
          (event) => {
            userData.FullName = event;
          }
        "
      ></BaseTextbox>
      <BaseTextbox
        class="register-input"
        :height="48"
        :place-holder="t('Email')"
        :fieldName="t('Email')"
        :errorMessage="userData.EmailErrorMsg"
        @onFocusIn="
          () => {
            userData.EmailErrorMsg = '';
          }
        "
        @onValueChanged="
          (event) => {
            userData.Email = event;
          }
        "
      ></BaseTextbox>
      <BaseTextbox
        class="register-input"
        :height="48"
        :place-holder="t('PhoneNumber')"
        :fieldName="t('PhoneNumber')"
        :errorMessage="userData.PhoneNumberErrorMsg"
        @onFocusIn="
          () => {
            userData.PhoneNumberErrorMsg = '';
          }
        "
        @onValueChanged="
          (event) => {
            userData.PhoneNumber = event;
          }
        "
      ></BaseTextbox>
      <BaseTextbox
        class="register-input"
        :height="48"
        :place-holder="t('Password')"
        :mode="'password'"
        :fieldName="t('Password')"
        :errorMessage="userData.PasswordErrorMsg"
        @onFocusIn="
          () => {
            userData.PasswordErrorMsg = '';
          }
        "
        @onValueChanged="
          (event) => {
            userData.Password = event;
          }
        "
      ></BaseTextbox>
      <BaseTextbox
        :height="48"
        :mode="'password'"
        :place-holder="t('PrePassword')"
        :fieldName="t('PrePassField')"
        :errorMessage="userData.PrePasswordErrorMsg"
        @onFocusIn="
          () => {
            userData.PrePasswordErrorMsg = '';
          }
        "
        @onValueChanged="
          (event) => {
            userData.PrePassword = event;
          }
        "
      ></BaseTextbox>

      <div class="d-flex align-items-center mt-px-16">
        <div>{{ t("HaveAccount") }}</div>
        <div
          class="primary-color pointer hover-underline ml-px-4"
          @click="onLogin"
        >
          {{ t("Login") }}
        </div>
      </div>

      <BaseButton
        class="mt-px-24"
        :text="t('Register')"
        :width="404"
        :height="48"
        @onClick="onRegister"
      ></BaseButton>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import BaseTextbox from "@/components/base/BaseTextbox.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import Users from "@/commons/models/Users.js";
import { addNewUser } from "@/apis/user-service/user-service";
import { responseStatus } from "@/commons/enums/api-response-status.js";
import ToastData from "@/commons/models/ToastData";
import { ToastType } from "@/commons/contants/toast-type.js";
import eventBus from "@/utils/event-bus/event-bus.js";
import ServiceError from "@/commons/models/ServiceError.js";
import { showToast } from "@/utils/toast-message/toastMessage";
import {
  isEmailValid,
  containsOnlyNumbers,
  isNullOrEmpty,
  getRandomColor,
} from "@/utils/functions/commonFns.js";
import router from "../router";
import i18n from "@/plugins/i18n";
var { t } = i18n.global;
const { emit } = eventBus();
const userData = ref(new Users());
const allowRegister = ref(false);
const serviceError = ref(Array < ServiceError > []);

/**
 * Đăng nhập
 */
function onLogin() {
  router.push("/login");
}

/**
 * kiểm tra trường thông tin
 */
function validateField() {
  //Họ tên
  if (isNullOrEmpty(userData.value.FullName)) {
    userData.value.FullNameErrorMsg = t("NotEmpty");
    allowRegister.value = false;
  }

  //Mật khẩu
  if (isNullOrEmpty(userData.value.Password)) {
    userData.value.PasswordErrorMsg = t("NotEmpty");
    allowRegister.value = false;
  } else if (userData.value.Password.length < 8) {
    userData.value.PasswordErrorMsg = t("MinLength8");
    allowRegister.value = false;
  }

  //Xác nhận mật khẩu
  if (isNullOrEmpty(userData.value.PrePassword)) {
    userData.value.PrePasswordErrorMsg = t("NotEmpty");
    allowRegister.value = false;
  } else if (
    userData.value.PrePassword &&
    userData.value.Password != userData.value.PrePassword
  ) {
    userData.value.PrePasswordErrorMsg = t("ErrorNotMatch");
    allowRegister.value = false;
  }

  //Email
  if (isNullOrEmpty(userData.value.Email)) {
    userData.value.EmailErrorMsg = t("NotEmpty");
    allowRegister.value = false;
  } else if (!isEmailValid(userData.value.Email)) {
    userData.value.EmailErrorMsg = t("WrongFormat");
    allowRegister.value = false;
  }

  //Số điện thoại
  if (isNullOrEmpty(userData.value.PhoneNumber)) {
    userData.value.PhoneNumberErrorMsg = t("NotEmpty");
    allowRegister.value = false;
  } else if (!containsOnlyNumbers(userData.value.PhoneNumber)) {
    userData.value.PhoneNumberErrorMsg = t("OnlyNumber");
    allowRegister.value = false;
  }
}

/**
 * Xử lý trước khi đăng ký
 */
function onBeforeRegister() {
  allowRegister.value = true;
  validateField();
  serviceError.value = [];
}
/**
 * Đăng ký
 */
async function onRegister() {
  onBeforeRegister();
  if (!allowRegister.value) {
    return;
  }
  try {
    userData.value.Background = getRandomColor();
    const res = await addNewUser(userData.value);
    if (res && res.status && res.status == responseStatus.InsertSuccess) {
      showToast.success(t("RegisterSuccess"));
      onLogin();
    } else {
      showToast.error(t("RegisterFalse"));
    }
  } catch (error) {
    console.log(error);
    if (
      error &&
      error.response &&
      error.response.data &&
      error.response.data.length
    ) {
      serviceError.value = error.response.data;
    } else {
      showToast.error(t("RegisterFalse"));
    }
  }
}
</script>
<style lang="scss" scoped>
.register-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: url("../assets/images/Login-img.jpg") no-repeat;
  background-size: cover;

  .register-content {
    position: absolute;
    width: 500px;
    min-height: 600px;
    background-color: var(--app-color-white);
    border-radius: 8px;
    padding: 48px 48px 40px 48px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12);

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

    .register-input {
      margin-bottom: 12px;
    }
  }
}
</style>
