export type AuthSessionResponse = {
  access_token: string;
  refresh_token: string;
  user?: { id: string; email?: string | null; user_metadata?: Record<string, unknown> };
};

async function request(path: string, payload: Record<string, unknown>) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Request failed with status code ${response.status}`
    );
  }

  return data;
}

export const authApi = {
  signup(email: string, password: string, fullName: string) {
    return request('/api/auth/signup', {
      email: email.trim().toLowerCase(),
      password,
      full_name: fullName.trim(),
    });
  },

  verifySignup(email: string, token: string, password: string, fullName: string) {
    return request('/api/auth/verify-signup', {
      email: email.trim().toLowerCase(),
      token: token.trim(),
      password,
      full_name: fullName.trim(),
    }) as Promise<AuthSessionResponse>;
  },

  resend(email: string) {
    return request('/api/auth/resend', {
      email: email.trim().toLowerCase(),
    });
  },

  sendCode(email: string) {
    return request('/api/auth/code', {
      email: email.trim().toLowerCase(),
    });
  },

  verifyCode(email: string, token: string) {
    return request('/api/auth/verify-code', {
      email: email.trim().toLowerCase(),
      token: token.trim(),
    }) as Promise<AuthSessionResponse>;
  },

  signIn(email: string, password: string) {
    return request('/api/auth/signin', {
      email: email.trim().toLowerCase(),
      password,
    }) as Promise<AuthSessionResponse>;
  },
};
