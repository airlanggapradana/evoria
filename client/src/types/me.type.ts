export interface MeResponse {
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}
