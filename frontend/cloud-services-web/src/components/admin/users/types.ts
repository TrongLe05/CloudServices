export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  roleId: string;
  roleName: string;
  isActive: boolean;
  createdAt: string;
  lastModifiedAt?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface UserPageResponse {
  items: User[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
