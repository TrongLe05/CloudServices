using System;
using System.Collections.Generic;

namespace CloudServices.Application.Features.Users.DTOs;

public sealed record UserDto(
    Guid Id,
    string Username,
    string FullName,
    string Email,
    string? AvatarUrl,
    Guid RoleId,
    string RoleName,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? LastModifiedAt
);

public sealed record RoleDto(
    Guid Id,
    string Name,
    string? Description
);

public sealed record UserPageDto(
    List<UserDto> Items,
    int TotalItems,
    int Page,
    int PageSize,
    int TotalPages
);
