import i18n from "@/plugins/i18n";
var { t } = i18n.global;

export const JobStatus = [
    {
        ColumnName: t('NeedToDoJob'),
        KanbanID: 0,
        Background: 'rgb(255, 101, 102)',
        ShowInput: false
    },
    {
        ColumnName: t('DoingJob'),
        KanbanID: 1,
        Background: 'rgb(33, 150, 243)',
        ShowInput: false
    },
    {
        ColumnName: t('DoneJob'),
        KanbanID: 2,
        Background: 'rgb(101, 180, 50)',
        ShowInput: false
    }
]