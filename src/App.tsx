import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { AppRoutes } from "./routes/AppRoutes";

export const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "16px",
            border: "1px solid #e5e5e5",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
          },
        }}
      />
    </AuthProvider>
  </BrowserRouter>
);
