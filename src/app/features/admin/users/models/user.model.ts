export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
  roles: string[];
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles?: string[];
  active?: boolean;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  roles?: string[];
  active?: boolean;
}
