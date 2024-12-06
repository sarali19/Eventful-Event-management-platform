import { decodeJwt } from "@/lib/token";
import { Role } from "@/types/Role";
import { createContext, useState, PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

export const ACCESS_TOKEN_IDENTIFIER = "token";

type AuthState = {
  token?: string;
  role?: Role;
  userId?: string;
  isAuthenticated: boolean;
};

type AuthContext = AuthState & {
  login?: (token: string) => void;
  logout?: VoidFunction;
};

export const AuthContext = createContext<AuthContext>({
  isAuthenticated: false,
});

const getCurrentAuthState = () => {
  const token = localStorage.getItem(ACCESS_TOKEN_IDENTIFIER);
  if (token) {
    const tokenData = decodeJwt(token);
    return {
      token,
      role: tokenData.a.at(0) as Role,
      userId: tokenData.sub,
      isAuthenticated: true,
    };
  }

  return {
    isAuthenticated: false,
  };
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authState, setAuthState] = useState<AuthState>(getCurrentAuthState());
  const navigate = useNavigate();

  const login = (token: string) => {
    localStorage.setItem(ACCESS_TOKEN_IDENTIFIER, token);
    const role = decodeJwt(token).a.at(0) as Role;
    const userId = decodeJwt(token).sub;
    setAuthState({ isAuthenticated: true, token, role, userId });
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_IDENTIFIER);
    setAuthState({ token: undefined, role: undefined, isAuthenticated: false });
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
