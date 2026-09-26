const API_URL = "http://127.0.0.1:8000/api/v1";

export interface AuthCredentials {
  phone: string;
  password: string;
}

export interface UserOut {
  id: number;
  phone: string;
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const detail = errorData?.detail;
    const message = Array.isArray(detail) ? detail[0]?.msg : detail;
    throw new Error(message || "Ошибка запроса");
  }
  return response.json();
}

export async function registerUser(data: AuthCredentials) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function loginUser(data: AuthCredentials): Promise<{ access_token: string; token_type: string }> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function getMe(): Promise<UserOut> {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}