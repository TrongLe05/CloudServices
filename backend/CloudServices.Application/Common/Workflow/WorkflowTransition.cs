using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CloudServices.Application.Common.Workflow;

public class WorkflowTransition
{
    public string Event { get; set; } = string.Empty;
    public string Target { get; set; } = string.Empty;
    public string? ConditionName { get; set; }
    public Func<WorkflowContext, Task<bool>>? Condition { get; set; }
    public List<string> ActionNames { get; set; } = new();
    public List<Func<WorkflowContext, Task>> Actions { get; set; } = new();
}
