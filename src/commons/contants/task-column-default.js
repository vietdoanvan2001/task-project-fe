import i18n from "@/plugins/i18n";
var { t } = i18n.global;

export const TaskColumnDefault = [
    {
      DataField: "TaskName",
      Caption: t('TaskName'),
      DataType: "text",
      Alignment: "left",
      Width:"300",
      // CellTemplate: "TaskNameTemplate",
    },
    {
    DataField: "ColumnName",
    Caption: t("KanbanName"),
    DataType: "text",
    Alignment: "left",
    // CellTemplate: "KanbanNameTemplate",
    },
    {
    DataField: "Process",
    Caption: t("TaskStatus"),
    DataType: "text",
    Alignment: "left",
    CellTemplate: "ProcessTemplate",
    },
    {
    DataField: "StartDate",
    Caption: t("StartDate"),
    DataType: "text",
    Alignment: "center",
    CellTemplate: "StartDateTemplate",
    },
    {
    DataField: "EndDate",
    Caption: t("EndDate"),
    DataType: "text",
    Alignment: "center",
    CellTemplate: "EndDateTemplate",
    },
    // {
    //   DataField: "EndDate",
    //   Caption: "FinishDate",
    //   DataType: "text",
    //   Alignment: "center",
    //   CellTemplate: "EndDateTemplate",
    //   },
    {
        DataField: "AssigneeName",
        Caption: t("AssigneeName"),
        DataType: "text",
        Width:"220",
        Alignment: "left",
        // CellTemplate: "AssigneeNameTemplate",
    },
    {
      DataField: "AssigneeEmail",
      Caption: t("AssigneeEmail"),
      DataType: "text",
      Width:"220",
      Alignment: "left",
      // CellTemplate: "AssigneeNameTemplate",
  }
  ]