import { createContext, useContext, useState } from "react";

interface Props {
  children: JSX.Element;
}

interface AuthContextType {
  auth: {
    username: string;
    email: string;
    isLoggedIn: boolean;
    accessToken: string;
  };
  setAuth: React.Dispatch<
    React.SetStateAction<{
      username: string;
      email: string;
      isLoggedIn: boolean;
      accessToken: string;
    }>
  >;
}

const AuthContext = createContext<AuthContextType>({
  auth: {
    username: "",
    email: "",
    isLoggedIn: false,
    accessToken: "",
  },
  setAuth: () => {},
});

export const AuthProvider = ({ children }: Props) => {
  const [auth, setAuth] = useState({
    username: "",
    email: "",
    isLoggedIn: false,
    accessToken: "",
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
