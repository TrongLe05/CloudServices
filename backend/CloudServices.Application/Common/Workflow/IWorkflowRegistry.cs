using System;
using System.Threading.Tasks;

namespace CloudServices.Application.Common.Workflow;

public interface IWorkflowRegistry
{
    void RegisterAction(string name, Func<WorkflowContext, Task> action);
    void RegisterGuard(string name, Func<WorkflowContext, Task<bool>> guard);
    Func<WorkflowContext, Task>? GetAction(string name);
    Func<WorkflowContext, Task<bool>>? GetGuard(string name);
}
