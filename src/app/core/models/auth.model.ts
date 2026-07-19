export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  email: string;
  roles: string[];
}