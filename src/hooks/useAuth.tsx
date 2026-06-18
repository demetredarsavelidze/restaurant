import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { authService } from "../services/restaurantService";
import type { User } from "../types";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const tokenKey = "restaurant_admin_token";
const userKey = "restaurant_admin_user";

const getStoredUser = () => {
  const stored = localStorage.getItem(userKey);
  return stored ? (JSON.parse(stored) as User) : null;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState(() => localStorage.getItem(tokenKey));
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login: async (email: string, password: string) => {
        const response = await authService.login(email, password);
        localStorage.setItem(tokenKey, response.token);
        localStorage.setItem(userKey, JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
      },
      logout: () => {
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(userKey);
        setToken(null);
        setUser(null);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
};
