import i18n from "@/plugins/i18n";
var { t } = i18n.global;

export const TaskColumnDefault = [

    {
      DataField: "TaskName",
      Caption: t('TaskName'),
      DataType: "text",
      Alignment: "left",
      Width:"268",
      // CellTemplate: "TaskNameTemplate",
    },
    {
    DataField: "ColumnName",
    Caption: t("KanbanName"),
    DataType: "text",
    Alignment: "left",
    Width:"160",
    // CellTemplate: "KanbanNameTemplate",
    },
    {
    DataField: "Process",
    Caption: t("TaskStatus"),
    DataType: "text",
    Alignment: "left",
    Width:"190",
    CellTemplate: "ProcessTemplate",
    },
    {
    DataField: "StartDate",
    Caption: t("StartDate"),
    DataType: "text",
    Alignment: "center",
    Width:"160",
    CellTemplate: "StartDateTemplate",
    },
    {
    DataField: "EndDate",
    Caption: t("EndDate"),
    DataType: "text",
    Alignment: "center",
    Width:"160",
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
        Width:"200",
        Alignment: "left",
        // CellTemplate: "AssigneeNameTemplate",
    },
    {
      DataField: "AssigneeEmail",
      Caption: t("AssigneeEmail"),
      DataType: "text",
      Width:"200",
      Alignment: "left",
      // CellTemplate: "AssigneeNameTemplate",
  }
  ]


  export const TaskSubColumnDefault = [

    {
      DataField: "taskName",
      Caption: t('TaskName'),
      DataType: "text",
      Alignment: "left",
      Width:"268",
      // CellTemplate: "TaskNameTemplate",
    },
    {
    DataField: "columnName",
    Caption: t("KanbanName"),
    DataType: "text",
    Alignment: "left",
    Width:"160",
    // CellTemplate: "KanbanNameTemplate",
    },
    {
    DataField: "process",
    Caption: t("TaskStatus"),
    DataType: "text",
    Alignment: "left",
    Width:"190",
    CellTemplate: "ProcessTemplate",
    },
    {
    DataField: "startDate",
    Caption: t("StartDate"),
    DataType: "text",
    Alignment: "center",
    Width:"160",
    CellTemplate: "StartDateTemplate",
    },
    {
    DataField: "endDate",
    Caption: t("EndDate"),
    DataType: "text",
    Alignment: "center",
    Width:"160",
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
        DataField: "assigneeName",
        Caption: t("AssigneeName"),
        DataType: "text",
        Width:"200",
        Alignment: "left",
        // CellTemplate: "AssigneeNameTemplate",
    },
    {
      DataField: "assigneeEmail",
      Caption: t("AssigneeEmail"),
      DataType: "text",
      Width:"200",
      Alignment: "left",
      // CellTemplate: "AssigneeNameTemplate",
  }
  ]