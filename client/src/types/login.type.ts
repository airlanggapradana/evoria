export interface LoginResponse {
  message: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}
