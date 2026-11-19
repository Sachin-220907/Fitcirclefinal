import AuthProvider from "./AuthProvider";
import QueryProvider from "./QueryProvider";
import ThemeProvider from "./ThemeProvider";
import OfflineProvider from "./OfflineProvider";
import SocketProvider from "./SocketProvider";
import { DateProvider } from "../context/DateContext";

export function AppProviders({ children }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <OfflineProvider>
          <AuthProvider>
            <DateProvider>
              <SocketProvider>
                {children}
              </SocketProvider>
            </DateProvider>
          </AuthProvider>
        </OfflineProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default AppProviders;
