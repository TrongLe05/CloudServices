using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CloudServices.Application.Common.Workflow;

public class WorkflowEngine
{
    private readonly WorkflowDefinition _definition;

    public WorkflowEngine(WorkflowDefinition definition)
    {
        _definition = definition ?? throw new ArgumentNullException(nameof(definition));
    }

    public WorkflowInstance CreateInstance(string id, IDictionary<string, object>? initialContext = null)
    {
        var context = initialContext != null 
            ? new WorkflowContext(initialContext) 
            : new WorkflowContext();

        return new WorkflowInstance
        {
            Id = id,
            WorkflowName = _definition.Name,
            CurrentState = _definition.InitialState,
            Context = context,
            History = new List<WorkflowHistoryRecord>()
        };
    }

    public async Task TriggerEventAsync(WorkflowInstance instance, string eventName, IDictionary<string, object>? payload = null)
    {
        if (instance == null)
            throw new ArgumentNullException(nameof(instance));

        if (string.IsNullOrWhiteSpace(eventName))
            throw new ArgumentException("Event name cannot be null or empty.", nameof(eventName));

        if (instance.WorkflowName != _definition.Name)
            throw new InvalidOperationException($"Instance belongs to workflow '{instance.WorkflowName}', but this engine runs '{_definition.Name}'.");

        // 1. Get current state
        if (!_definition.States.TryGetValue(instance.CurrentState, out var currentState))
        {
            throw new InvalidOperationException($"Current state '{instance.CurrentState}' of instance '{instance.Id}' is not defined in workflow '{_definition.Name}'.");
        }

        // 2. Find matching transition
        WorkflowTransition? matchedTransition = null;
        foreach (var transition in currentState.Transitions)
        {
            if (transition.Event == eventName)
            {
                if (transition.Condition != null)
                {
                    bool isSatisfied = await transition.Condition(instance.Context);
                    if (!isSatisfied) continue;
                }
                matchedTransition = transition;
                break;
            }
        }

        if (matchedTransition == null)
        {
            throw new InvalidOperationException($"No valid transition found for event '{eventName}' from state '{instance.CurrentState}'.");
        }

        // 3. Update context with payload if provided
        if (payload != null)
        {
            foreach (var kvp in payload)
            {
                instance.Context.Set(kvp.Key, kvp.Value);
            }
        }

        // 4. Execute transition
        await ExecuteTransitionAsync(instance, currentState, matchedTransition, eventName);

        // 5. Cascade automatic transitions (conditional branching or loops)
        await ProcessAutoTransitionsAsync(instance);
    }

    private async Task ExecuteTransitionAsync(
        WorkflowInstance instance, 
        WorkflowState fromState, 
        WorkflowTransition transition, 
        string triggerEvent)
    {
        // 1. Run OnExit actions of the source state
        foreach (var action in fromState.OnExit)
        {
            await action(instance.Context);
        }

        // 2. Run Transition actions
        foreach (var action in transition.Actions)
        {
            await action(instance.Context);
        }

        // 3. Record history
        instance.History.Add(new WorkflowHistoryRecord
        {
            Timestamp = DateTime.UtcNow,
            FromState = fromState.Name,
            ToState = transition.Target,
            Event = triggerEvent,
            Message = $"Transitioned from '{fromState.Name}' to '{transition.Target}' via event '{triggerEvent}'."
        });

        // 4. Change state
        instance.CurrentState = transition.Target;

        // 5. Run OnEntry actions of the target state
        if (_definition.States.TryGetValue(transition.Target, out var targetState))
        {
            foreach (var action in targetState.OnEntry)
            {
                await action(instance.Context);
            }
        }
    }

    private async Task ProcessAutoTransitionsAsync(WorkflowInstance instance)
    {
        const int maxIterations = 100; // Guard against infinite loops
        int iteration = 0;

        while (iteration < maxIterations)
        {
            if (!_definition.States.TryGetValue(instance.CurrentState, out var currentState))
            {
                break;
            }

            WorkflowTransition? autoTransition = null;

            foreach (var transition in currentState.Transitions)
            {
                // Auto-transition is indicated by an empty or null Event
                if (string.IsNullOrEmpty(transition.Event))
                {
                    if (transition.Condition != null)
                    {
                        bool isSatisfied = await transition.Condition(instance.Context);
                        if (!isSatisfied) continue;
                    }
                    autoTransition = transition;
                    break;
                }
            }

            if (autoTransition == null)
            {
                break; // No auto-transition conditions met
            }

            // Execute the automatic transition
            await ExecuteTransitionAsync(instance, currentState, autoTransition, "AUTO");
            iteration++;
        }

        if (iteration >= maxIterations)
        {
            throw new InvalidOperationException($"Potential infinite loop detected in auto-transitions from state '{instance.CurrentState}'.");
        }
    }
}
