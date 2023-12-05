<template lang="">
  <div class="no-permistion-container">
    <div class="no-permission-alert">
      <div class="big-icon-false mr-px-12"></div>
      <div>{{text}}</div>
      <div class="ml-px-4">{{t('ContactAdmin')}}</div>
    </div>
  </div>
</template>
<script setup>

import i18n from "@/plugins/i18n";
import { onBeforeMount,ref, watch } from "vue";
var { t } = i18n.global;
const currentUser = ref()
const text = ref("")
onBeforeMount(()=>{
  currentUser.value = JSON.parse(localStorage.getItem("currentUser"))
  if(currentUser.value.deleteType == 1){
    text.value = t('AccountDeleted')
  }
  else if(currentUser.value.status == 0){
    text.value = t('NoPermissionAlert')
  }
  else{
    text.value = t('InActiveAccount')
  }
  // console.log(currentUser.value);
})

watch(()=>localStorage.getItem("currentUser"),()=>{
  currentUser.value = JSON.parse(localStorage.getItem("currentUser"));
},{immediate:true})
</script>
<style lang="scss" scoped>
.no-permistion-container{
    width: 100%;
    height: 100vh;
    background: url("../../assets/images/nopermistion.jpg") no-repeat;
    background-size: cover;
    justify-content: center;
    display: flex;
    padding: 80px 0 0 0;
    .no-permission-alert{
      width: fit-content;
      box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
      height: fit-content;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      background: var(--app-color-white);
    }
}
</style>
