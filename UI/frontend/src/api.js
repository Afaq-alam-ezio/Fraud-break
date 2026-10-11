// Where the Spring Boot backend runs. Change it with a VITE_API_URL line in a .env file.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export class ApiError extends Error {
  constructor(status, body) {
    super(typeof body === 'string' ? body : `Request failed with status ${status}`);
    this.status = status; // 0 means the server could not be reached at all
    this.body = body;
  }
}

// Sends a request and returns the parsed reply.
// Your backend answers with JSON on success and sometimes plain text on errors,
// so we read the text first and only then try to parse it as JSON.
export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'network');
  }

  const text = await res.text();
  let data = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // not JSON, keep the plain text
  }

  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}
