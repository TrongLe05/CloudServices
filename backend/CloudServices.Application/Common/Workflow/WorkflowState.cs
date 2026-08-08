using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CloudServices.Application.Common.Workflow;

public class WorkflowState
{
    public string Name { get; set; } = string.Empty;
    public List<string> OnEntryNames { get; set; } = new();
    public List<Func<WorkflowContext, Task>> OnEntry { get; set; } = new();
    public List<string> OnExitNames { get; set; } = new();
    public List<Func<WorkflowContext, Task>> OnExit { get; set; } = new();
    public List<WorkflowTransition> Transitions { get; set; } = new();
}
