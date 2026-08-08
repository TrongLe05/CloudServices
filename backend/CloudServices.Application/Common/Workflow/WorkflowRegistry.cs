using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace CloudServices.Application.Common.Workflow;

public class WorkflowRegistry : IWorkflowRegistry
{
    private readonly ConcurrentDictionary<string, Func<WorkflowContext, Task>> _actions = new();
    private readonly ConcurrentDictionary<string, Func<WorkflowContext, Task<bool>>> _guards = new();

    public void RegisterAction(string name, Func<WorkflowContext, Task> action)
    {
        _actions[name] = action;
    }

    public void RegisterGuard(string name, Func<WorkflowContext, Task<bool>> guard)
    {
        _guards[name] = guard;
    }

    public Func<WorkflowContext, Task>? GetAction(string name)
    {
        return _actions.TryGetValue(name, out var action) ? action : null;
    }

    public Func<WorkflowContext, Task<bool>>? GetGuard(string name)
    {
        return _guards.TryGetValue(name, out var guard) ? guard : null;
    }
}
