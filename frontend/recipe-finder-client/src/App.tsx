import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./features/auth/AuthProvider";
import { AppErrorBoundary } from "./app/errors/AppErrorBoundary";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppErrorBoundary>
          <Toaster position="top-right" reverseOrder={false} />
          <AppRoutes />
        </AppErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
