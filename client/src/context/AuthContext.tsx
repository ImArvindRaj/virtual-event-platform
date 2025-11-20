import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "../services/api.service";
import { AuthState } from "../types";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const { data } = await api.get("/users/me");
          setState((prev) => ({
            ...prev,
            user: data,
            isAuthenticated: true,
            loading: false,
          }));
        } catch {
          setState((prev) => ({ ...prev, loading: false }));
        }
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };
    loadUser();
  }, [state.token]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setState({
      user: data.user,
      token: data.token,
      isAuthenticated: true,
      loading: false,
    });
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    localStorage.setItem("token", data.token);
    setState({
      user: data.user,
      token: data.token,
      isAuthenticated: true,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
