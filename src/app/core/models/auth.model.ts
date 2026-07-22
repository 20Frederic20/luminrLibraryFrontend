export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  roles: string[];
}
