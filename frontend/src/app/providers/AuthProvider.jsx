import { AuthProvider as ExistingAuthProvider } from "../../features/authentication/context/AuthContext";

export function AuthProvider({ children }) {
  return <ExistingAuthProvider>{children}</ExistingAuthProvider>;
}

export default AuthProvider;
