export const AUTH_TOKEN_KEY = 'auth_token';

const isBrowser = typeof window !== 'undefined';

export const auth = {
  login: (token: string) => {
    if (isBrowser) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
  },
  
  logout: () => {
    if (isBrowser) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  },
  
  isAuthenticated: () => {
    if (isBrowser) {
      return !!localStorage.getItem(AUTH_TOKEN_KEY);
    }
    return false;
  },
  
  getToken: () => {
    if (isBrowser) {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    }
    return null;
  }
}; 