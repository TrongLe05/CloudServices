using CloudServices.Application.Common.Workflow;
using System.Collections.Generic;

namespace CloudServices.UnitTests.Common.Workflow;

public class WorkflowContextTests
{
    [Fact]
    public void Set_And_Get_ShouldStoreAndRetrieveValue()
    {
        // Arrange
        var context = new WorkflowContext();
        var key = "testKey";
        var value = "testValue";

        // Act
        context.Set(key, value);
        var retrievedValue = context.Get<string>(key);

        // Assert
        Assert.Equal(value, retrievedValue);
    }

    [Fact]
    public void Set_NullValue_ShouldRemoveKey()
    {
        // Arrange
        var context = new WorkflowContext();
        var key = "testKey";
        context.Set(key, "initialValue");

        // Act
        context.Set<string?>(key, null);
        var retrievedValue = context.Get<string>(key);

        // Assert
        Assert.Null(retrievedValue);
        Assert.False(context.Has(key));
    }

    [Fact]
    public void TryGet_WhenKeyExists_ShouldReturnTrueAndValue()
    {
        // Arrange
        var context = new WorkflowContext();
        var key = "age";
        var value = 30;
        context.Set(key, value);

        // Act
        var result = context.TryGet<int>(key, out var retrievedValue);

        // Assert
        Assert.True(result);
        Assert.Equal(value, retrievedValue);
    }

    [Fact]
    public void TryGet_WhenKeyDoesNotExist_ShouldReturnFalseAndDefault()
    {
        // Arrange
        var context = new WorkflowContext();
        var key = "nonExistentKey";

        // Act
        var result = context.TryGet<string>(key, out var retrievedValue);

        // Assert
        Assert.False(result);
        Assert.Null(retrievedValue);
    }

    [Fact]
    public void Get_WhenTypeMismatch_ShouldTryConvertOrReturnDefault()
    {
        // Arrange
        var context = new WorkflowContext();
        context.Set("numberStr", "123");
        context.Set("invalidNumberStr", "abc");

        // Act
        var convertedInt = context.Get<int>("numberStr");
        var failedInt = context.Get<int>("invalidNumberStr");

        // Assert
        Assert.Equal(123, convertedInt);
        Assert.Equal(0, failedInt);
    }
}
