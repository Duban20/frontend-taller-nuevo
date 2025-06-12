export interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
    is_active: string;
    avatar: string | null;
  };
  token: string;
  refreshToken: string;
  role: {
    id: number;
    name: string;
  } | null;
  resources: { path: string; method: string }[];
}

export interface LoginPayload {
  email: string;
  password: string;
}