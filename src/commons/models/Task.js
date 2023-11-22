class Task {
    constructor(name, status, startDate, endDate, finishDate, assigneeId, assigneeName, assigneeEmail, projectId, kanbanID, process) {
      this.TaskName = name;
      this.Status = status;
      this.StartDate = startDate;
      this.EndDate = endDate;
      this.FinishDate = finishDate;
      this.AssigneeId = assigneeId;
      this.AssigneeName = assigneeName;
      this.AssigneeEmail = assigneeEmail;
      this.ProjectId = projectId;
      this.KanbanId = kanbanID;
      this.Process = process;
    }
    }
  
    export default Task;