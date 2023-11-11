<template lang="">
  <div class="content">
    <BaseKanban v-if="currentType == 1" :data="data"></BaseKanban>
    <TaskGrid v-else :data="data"></TaskGrid>
    <router-view></router-view>
  </div>
</template>
<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { RouterName } from "@/commons/contants/router-name.js";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import TaskGrid from "@/components/grid/TaskGrid.vue";
import BaseKanban from "@/components/base/BaseKanban.vue";
const emit = defineEmits();
const route = useRoute();

onBeforeMount(() => {
  emit("onChangedView", RouterName.TheProject);
});
let currentType = ref(1);

watch(
  () => route.query,
  (newValue) => {
    console.log(newValue);
    if (newValue && newValue.Type) {
      currentType.value = newValue.Type;
    }
  },
  { immediate: true }
);

const data = ref([
  {
    KanbanID: 75560,
    ProjectID: 27741,
    ColumnName: "a",
    HeaderColor: "#EEC300",
    CreatedDate: "2023-11-06T14:32:19.069+07:00",
    CreatedBy: "B-1301",
    ModifiedDate: "2023-11-06T14:32:19.069+07:00",
    ModifiedBy: "B-1301",
    ShowInput: false,
    Tasks: [],
    TotalTask: 0,
  },
  {
    KanbanID: 75559,
    ProjectID: 27741,
    ColumnName: "a",
    HeaderColor: "#4CD964",
    CreatedDate: "2023-11-06T14:32:07.703+07:00",
    CreatedBy: "B-1301",
    ModifiedDate: "2023-11-06T14:32:07.704+07:00",
    ShowInput: false,
    ModifiedBy: "B-1301",
    Tasks: [
      {
        TaskID: 322245,
        TaskName: "[Hướng dẫn]Lập danh sách1",
        Status: 3,
        StartDate: null,
        FinishDate: null,
        EndDate: "2023-11-06T22:39:51.155+07:00",
        AssigneeID: null,
        AssigneeEmail: null,
        AssigneeName: null,
        ProjectID: 27741,
        KanbanID: 70419,
        Process: 100,
        ProjectName: "Công việc cá nhân",
        KanbanName: "Đang thực hiệnaaaaaaaaaaa",
        TaskStatus: 1,
        CreatedDate: "2023-05-18T11:50:30.000+07:00",
        CheckList: null,
      },
      {
        TaskID: 322245,
        TaskName: "[Hướng dẫn]Lập danh sách123",
        Status: 3,
        StartDate: null,
        FinishDate: null,
        EndDate: "2023-12-06T22:39:51.155+07:00",
        AssigneeID: null,
        AssigneeEmail: null,
        AssigneeName: null,
        ProjectID: 27741,
        KanbanID: 70419,
        Process: 100,
        ProjectName: "Công việc cá nhân",
        KanbanName: "Đang thực hiệnaaaaaaaaaaa",
        TaskStatus: 1,
        CreatedDate: "2023-05-18T11:50:30.000+07:00",
        CheckList: null,
      },
    ],
    TotalTask: 0,
  },
  {
    KanbanID: 70419,
    ProjectID: 27741,
    ColumnName: "Đang thực hiệnaaaaaaaaaaa",
    HeaderColor: "#2196F3",
    CreatedDate: "2023-05-18T11:50:30.000+07:00",
    CreatedBy: null,
    ModifiedDate: "2023-11-06T11:12:51.368+07:00",
    ShowInput: false,
    ModifiedBy: "B-1301",
    Tasks: [
      {
        TaskID: 343512,
        TaskName: "việc của tôi",
        Status: 0,
        StartDate: null,
        EndDate: "2023-08-06T23:59:59.000+07:00",
        FinishDate: null,
        AssigneeID: "a468fa7f-e89e-4c38-8a11-0ac9a2c968bf",
        AssigneeEmail: "vietdoan08032001@gmail.com",
        AssigneeName: "Đoàn Văn Việt",
        ProjectID: 27741,
        KanbanID: 70419,
        Process: 40,
        ProjectName: "Công việc cá nhân",
        KanbanName: "Đang thực hiệnaaaaaaaaaaa",
        TaskStatus: 1,
        CreatedDate: "2023-08-06T22:39:34.081+07:00",
        CheckList: null,
      },
      {
        TaskID: 365851,
        TaskName: "test",
        Status: 1,
        StartDate: null,
        EndDate: null,
        FinishDate: null,
        AssigneeID: null,
        AssigneeEmail: null,
        AssigneeName: null,
        ProjectID: 27741,
        KanbanID: 70419,
        Process: null,
        ProjectName: "Công việc cá nhân",
        KanbanName: "Đang thực hiệnaaaaaaaaaaa",
        TaskStatus: 1,
        CreatedDate: "2023-10-25T23:24:45.049+07:00",
        CheckList: null,
      },
      {
        TaskID: 322245,
        TaskName: "[Hướng dẫn]Lập danh sách",
        Status: 3,
        StartDate: null,
        FinishDate: null,
        EndDate: "2023-11-08T22:39:51.155+07:00",
        AssigneeID: null,
        AssigneeEmail: null,
        AssigneeName: null,
        ProjectID: 27741,
        KanbanID: 70419,
        Process: 100,
        ProjectName: "Công việc cá nhân",
        KanbanName: "Đang thực hiệnaaaaaaaaaaa",
        TaskStatus: 1,
        CreatedDate: "2023-05-18T11:50:30.000+07:00",
        CheckList: null,
      },
      {
        TaskID: 322245,
        TaskName: "[Hướng dẫn]Lập danh sách công việc của bản thân",
        Status: 3,
        StartDate: null,
        FinishDate: "2023-05-18T23:59:59.000+07:00",
        EndDate: "2023-08-06T22:39:51.155+07:00",
        AssigneeID: null,
        AssigneeEmail: null,
        AssigneeName: null,
        ProjectID: 27741,
        KanbanID: 70419,
        Process: 100,
        ProjectName: "Công việc cá nhân",
        KanbanName: "Đang thực hiệnaaaaaaaaaaa",
        TaskStatus: 1,
        CreatedDate: "2023-05-18T11:50:30.000+07:00",
        CheckList: null,
      },
    ],
    TotalTask: 3,
  },
]);
</script>
<style lang="scss">
.content {
  padding-top: 48px;
  height: calc(100vh);
  background: url("../../assets/images/dashboard03.jpg") no-repeat;
  background-size: cover;
}
</style>
