using System;
using System.Collections.Generic;

namespace CloudServices.Application.Common.Workflow;

public class WorkflowHistoryRecord
{
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string FromState { get; set; } = string.Empty;
    public string ToState { get; set; } = string.Empty;
    public string Event { get; set; } = string.Empty;
    public string? Message { get; set; }
}

public class WorkflowInstance
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string WorkflowName { get; set; } = string.Empty;
    public string CurrentState { get; set; } = string.Empty;
    public WorkflowContext Context { get; set; } = new();
    public List<WorkflowHistoryRecord> History { get; set; } = new();
}
