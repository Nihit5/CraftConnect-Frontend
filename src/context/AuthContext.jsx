import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AUTH_TOKEN_KEY = "authToken";
export const USER_INIT_API_URL = "/api/v1/user/init";

const AuthContext = createContext(null);

export async function fetchUserInit(authToken) {
  const response = await fetch(USER_INIT_API_URL, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!response.ok) {
    throw new Error(`Init failed (${response.status})`);
  }

  const data = await response.json();
  return data?.data ?? data;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(() =>
    Boolean(localStorage.getItem(AUTH_TOKEN_KEY)),
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    setUser(null);
    setIsInitializing(false);
  }, []);

  const login = useCallback(async (authToken, userData) => {
    localStorage.setItem(AUTH_TOKEN_KEY, authToken);
    setToken(authToken);
    setUser(userData);
    setIsInitializing(false);
    return userData;
  }, []);

  useEffect(() => {
    if (!token) {
      setIsInitializing(false);
      return;
    }

    if (user) {
      setIsInitializing(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setIsInitializing(true);
        const userData = await fetchUserInit(token);
        if (!cancelled) {
          setUser(userData);
        }
      } catch {
        if (!cancelled) {
          logout();
        }
      } finally {
        if (!cancelled) {
          setIsInitializing(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, user, logout]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isInitializing,
      login,
      logout,
    }),
    [token, user, isInitializing, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
