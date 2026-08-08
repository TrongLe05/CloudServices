using System.Collections.Generic;

namespace CloudServices.Application.Common.Workflow;

public class WorkflowDefinition
{
    public string Name { get; set; } = string.Empty;
    public string InitialState { get; set; } = string.Empty;
    public Dictionary<string, WorkflowState> States { get; set; } = new();
}
