using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace CloudServices.Application.Common.Workflow;

public static class WorkflowParser
{
    private class WorkflowConfigDto
    {
        public string Name { get; set; } = string.Empty;
        public string InitialState { get; set; } = string.Empty;
        public Dictionary<string, StateConfigDto> States { get; set; } = new();
    }

    private class StateConfigDto
    {
        public List<string>? OnEntry { get; set; }
        public List<string>? OnExit { get; set; }
        public List<TransitionConfigDto>? Transitions { get; set; }
    }

    private class TransitionConfigDto
    {
        public string Event { get; set; } = string.Empty;
        public string Target { get; set; } = string.Empty;
        public string? Condition { get; set; }
        public List<string>? Actions { get; set; }
    }

    public static WorkflowDefinition Parse(string jsonConfig, IWorkflowRegistry registry)
    {
        if (string.IsNullOrWhiteSpace(jsonConfig))
        {
            throw new ArgumentException("Configuration JSON cannot be empty.", nameof(jsonConfig));
        }

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        var configDto = JsonSerializer.Deserialize<WorkflowConfigDto>(jsonConfig, options);
        if (configDto == null)
        {
            throw new InvalidOperationException("Failed to deserialize workflow configuration.");
        }

        if (string.IsNullOrWhiteSpace(configDto.Name))
        {
            throw new InvalidOperationException("Workflow name is required.");
        }

        if (string.IsNullOrWhiteSpace(configDto.InitialState))
        {
            throw new InvalidOperationException("Initial state is required.");
        }

        if (!configDto.States.ContainsKey(configDto.InitialState))
        {
            throw new InvalidOperationException($"Initial state '{configDto.InitialState}' is not defined in states list.");
        }

        var definition = new WorkflowDefinition
        {
            Name = configDto.Name,
            InitialState = configDto.InitialState
        };

        // First pass: create all states to validate targets later
        foreach (var statePair in configDto.States)
        {
            definition.States[statePair.Key] = new WorkflowState
            {
                Name = statePair.Key
            };
        }

        // Second pass: resolve actions, guards, and transitions
        foreach (var statePair in configDto.States)
        {
            var stateName = statePair.Key;
            var dtoState = statePair.Value;
            var state = definition.States[stateName];

            // Resolve OnEntry actions
            if (dtoState.OnEntry != null)
            {
                foreach (var actionName in dtoState.OnEntry)
                {
                    var action = registry.GetAction(actionName);
                    if (action == null)
                    {
                        throw new InvalidOperationException($"State '{stateName}': Action '{actionName}' in OnEntry is not registered.");
                    }
                    state.OnEntryNames.Add(actionName);
                    state.OnEntry.Add(action);
                }
            }

            // Resolve OnExit actions
            if (dtoState.OnExit != null)
            {
                foreach (var actionName in dtoState.OnExit)
                {
                    var action = registry.GetAction(actionName);
                    if (action == null)
                    {
                        throw new InvalidOperationException($"State '{stateName}': Action '{actionName}' in OnExit is not registered.");
                    }
                    state.OnExitNames.Add(actionName);
                    state.OnExit.Add(action);
                }
            }

            // Resolve Transitions
            if (dtoState.Transitions != null)
            {
                foreach (var dtoTrans in dtoState.Transitions)
                {
                    if (string.IsNullOrWhiteSpace(dtoTrans.Target))
                    {
                        throw new InvalidOperationException($"State '{stateName}': Transition must have a valid target.");
                    }

                    if (!definition.States.ContainsKey(dtoTrans.Target))
                    {
                        throw new InvalidOperationException($"State '{stateName}': Target state '{dtoTrans.Target}' for transition is not defined.");
                    }

                    var transition = new WorkflowTransition
                    {
                        Event = dtoTrans.Event,
                        Target = dtoTrans.Target,
                        ConditionName = dtoTrans.Condition
                    };

                    // Resolve Condition/Guard
                    if (!string.IsNullOrWhiteSpace(dtoTrans.Condition))
                    {
                        var guard = registry.GetGuard(dtoTrans.Condition);
                        if (guard == null)
                        {
                            throw new InvalidOperationException($"State '{stateName}': Guard '{dtoTrans.Condition}' is not registered.");
                        }
                        transition.Condition = guard;
                    }

                    // Resolve Transition Actions
                    if (dtoTrans.Actions != null)
                    {
                        foreach (var actionName in dtoTrans.Actions)
                        {
                            var action = registry.GetAction(actionName);
                            if (action == null)
                            {
                                throw new InvalidOperationException($"State '{stateName}' (event '{dtoTrans.Event}'): Action '{actionName}' is not registered.");
                            }
                            transition.ActionNames.Add(actionName);
                            transition.Actions.Add(action);
                        }
                    }

                    state.Transitions.Add(transition);
                }
            }
        }

        return definition;
    }
}
