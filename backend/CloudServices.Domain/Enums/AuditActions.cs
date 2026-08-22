namespace CloudServices.Domain.Enums;

public static class AuditActions
{
    public const string Create = "CREATE";
    public const string Update = "UPDATE";
    public const string Delete = "DELETE";
    public const string Login = "LOGIN";
    public const string Logout = "LOGOUT";
    public const string Approve = "APPROVE";
    public const string Reject = "REJECT";
    public const string Payment = "PAYMENT";
    public const string Refund = "REFUND";
    public const string ChangeRole = "CHANGE_ROLE";
}
