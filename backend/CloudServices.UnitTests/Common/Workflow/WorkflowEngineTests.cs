using CloudServices.Application.Common.Workflow;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Common.Workflow;

public class WorkflowEngineTests
{
    [Fact]
    public void Constructor_NullDefinition_ThrowsArgumentNullException()
    {
        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => new WorkflowEngine(null!));
    }

    [Fact]
    public void CreateInstance_ShouldInitializeCorrectly()
    {
        // Arrange
        var definition = new WorkflowDefinition
        {
            Name = "OrderWorkflow",
            InitialState = "Draft",
            States = new Dictionary<string, WorkflowState>()
        };
        var engine = new WorkflowEngine(definition);
        var initialContext = new Dictionary<string, object> { { "User", "Admin" } };

        // Act
        var instance = engine.CreateInstance("inst-1", initialContext);

        // Assert
        Assert.Equal("inst-1", instance.Id);
        Assert.Equal("OrderWorkflow", instance.WorkflowName);
        Assert.Equal("Draft", instance.CurrentState);
        Assert.Equal("Admin", instance.Context.Get<string>("User"));
        Assert.Empty(instance.History);
    }

    [Fact]
    public async Task TriggerEventAsync_ValidTransition_ChangesStateAndRecordsHistory()
    {
        // Arrange
        var stateDraft = new WorkflowState { Name = "Draft" };
        var stateSubmitted = new WorkflowState { Name = "Submitted" };

        var transition = new WorkflowTransition
        {
            Event = "Submit",
            Target = "Submitted"
        };
        stateDraft.Transitions.Add(transition);

        var definition = new WorkflowDefinition
        {
            Name = "OrderWorkflow",
            InitialState = "Draft",
            States = new Dictionary<string, WorkflowState>
            {
                { "Draft", stateDraft },
                { "Submitted", stateSubmitted }
            }
        };

        var engine = new WorkflowEngine(definition);
        var instance = engine.CreateInstance("inst-1");

        // Act
        await engine.TriggerEventAsync(instance, "Submit");

        // Assert
        Assert.Equal("Submitted", instance.CurrentState);
        Assert.Single(instance.History);
        Assert.Equal("Draft", instance.History[0].FromState);
        Assert.Equal("Submitted", instance.History[0].ToState);
        Assert.Equal("Submit", instance.History[0].Event);
    }

    [Fact]
    public async Task TriggerEventAsync_ConditionMet_TransitionsState()
    {
        // Arrange
        var stateDraft = new WorkflowState { Name = "Draft" };
        var stateSubmitted = new WorkflowState { Name = "Submitted" };

        var transition = new WorkflowTransition
        {
            Event = "Submit",
            Target = "Submitted",
            Condition = (context) => Task.FromResult(context.Get<bool>("IsValid"))
        };
        stateDraft.Transitions.Add(transition);

        var definition = new WorkflowDefinition
        {
            Name = "OrderWorkflow",
            InitialState = "Draft",
            States = new Dictionary<string, WorkflowState>
            {
                { "Draft", stateDraft },
                { "Submitted", stateSubmitted }
            }
        };

        var engine = new WorkflowEngine(definition);
        var instance = engine.CreateInstance("inst-1", new Dictionary<string, object> { { "IsValid", true } });

        // Act
        await engine.TriggerEventAsync(instance, "Submit");

        // Assert
        Assert.Equal("Submitted", instance.CurrentState);
    }

    [Fact]
    public async Task TriggerEventAsync_ConditionNotMet_ThrowsInvalidOperationException()
    {
        // Arrange
        var stateDraft = new WorkflowState { Name = "Draft" };
        var stateSubmitted = new WorkflowState { Name = "Submitted" };

        var transition = new WorkflowTransition
        {
            Event = "Submit",
            Target = "Submitted",
            Condition = (context) => Task.FromResult(context.Get<bool>("IsValid"))
        };
        stateDraft.Transitions.Add(transition);

        var definition = new WorkflowDefinition
        {
            Name = "OrderWorkflow",
            InitialState = "Draft",
            States = new Dictionary<string, WorkflowState>
            {
                { "Draft", stateDraft },
                { "Submitted", stateSubmitted }
            }
        };

        var engine = new WorkflowEngine(definition);
        var instance = engine.CreateInstance("inst-1", new Dictionary<string, object> { { "IsValid", false } });

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => engine.TriggerEventAsync(instance, "Submit"));
    }

    [Fact]
    public async Task TriggerEventAsync_ExecutesOnExitOnEntryAndTransitionActions()
    {
        // Arrange
        var exitCalled = false;
        var entryCalled = false;
        var transitionActionCalled = false;

        var stateDraft = new WorkflowState { Name = "Draft" };
        stateDraft.OnExit.Add((ctx) => { exitCalled = true; return Task.CompletedTask; });

        var stateSubmitted = new WorkflowState { Name = "Submitted" };
        stateSubmitted.OnEntry.Add((ctx) => { entryCalled = true; return Task.CompletedTask; });

        var transition = new WorkflowTransition
        {
            Event = "Submit",
            Target = "Submitted"
        };
        transition.Actions.Add((ctx) => { transitionActionCalled = true; return Task.CompletedTask; });
        stateDraft.Transitions.Add(transition);

        var definition = new WorkflowDefinition
        {
            Name = "OrderWorkflow",
            InitialState = "Draft",
            States = new Dictionary<string, WorkflowState>
            {
                { "Draft", stateDraft },
                { "Submitted", stateSubmitted }
            }
        };

        var engine = new WorkflowEngine(definition);
        var instance = engine.CreateInstance("inst-1");

        // Act
        await engine.TriggerEventAsync(instance, "Submit");

        // Assert
        Assert.True(exitCalled);
        Assert.True(entryCalled);
        Assert.True(transitionActionCalled);
    }

    [Fact]
    public async Task TriggerEventAsync_CascadesAutoTransitions()
    {
        // Arrange
        var stateDraft = new WorkflowState { Name = "Draft" };
        var stateSubmitted = new WorkflowState { Name = "Submitted" };
        var stateApproved = new WorkflowState { Name = "Approved" };

        var submitTransition = new WorkflowTransition
        {
            Event = "Submit",
            Target = "Submitted"
        };
        stateDraft.Transitions.Add(submitTransition);

        // Auto transition from Submitted to Approved since Event is empty string/null
        var autoTransition = new WorkflowTransition
        {
            Event = "",
            Target = "Approved"
        };
        stateSubmitted.Transitions.Add(autoTransition);

        var definition = new WorkflowDefinition
        {
            Name = "OrderWorkflow",
            InitialState = "Draft",
            States = new Dictionary<string, WorkflowState>
            {
                { "Draft", stateDraft },
                { "Submitted", stateSubmitted },
                { "Approved", stateApproved }
            }
        };

        var engine = new WorkflowEngine(definition);
        var instance = engine.CreateInstance("inst-1");

        // Act
        await engine.TriggerEventAsync(instance, "Submit");

        // Assert
        Assert.Equal("Approved", instance.CurrentState);
        Assert.Equal(2, instance.History.Count);
        Assert.Equal("Draft", instance.History[0].FromState);
        Assert.Equal("Submitted", instance.History[0].ToState);
        Assert.Equal("Submitted", instance.History[1].FromState);
        Assert.Equal("Approved", instance.History[1].ToState);
    }

    [Fact]
    public async Task TriggerEventAsync_InfiniteLoopAutoTransitions_ThrowsInvalidOperationException()
    {
        // Arrange
        var stateDraft = new WorkflowState { Name = "Draft" };
        var stateA = new WorkflowState { Name = "StateA" };
        var stateB = new WorkflowState { Name = "StateB" };

        // Submit: Draft -> StateA
        stateDraft.Transitions.Add(new WorkflowTransition { Event = "Submit", Target = "StateA" });
        // Auto transition: StateA -> StateB
        stateA.Transitions.Add(new WorkflowTransition { Event = "", Target = "StateB" });
        // Auto transition: StateB -> StateA (Creates infinite loop)
        stateB.Transitions.Add(new WorkflowTransition { Event = "", Target = "StateA" });

        var definition = new WorkflowDefinition
        {
            Name = "InfiniteWorkflow",
            InitialState = "Draft",
            States = new Dictionary<string, WorkflowState>
            {
                { "Draft", stateDraft },
                { "StateA", stateA },
                { "StateB", stateB }
            }
        };

        var engine = new WorkflowEngine(definition);
        var instance = engine.CreateInstance("inst-1");

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => engine.TriggerEventAsync(instance, "Submit"));
        Assert.Contains("Potential infinite loop detected", exception.Message);
    }
}
