import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/LogIn";
import VitalMatchOnboarding from "./VitalMatchOnboarding";
import HospitalRegister from "./pages/auth/HospitalRegister";
import DonorRegister from "./pages/auth/DonorRegister";

// import DonorDashboard from "./pages/dashboard/DonorDashboard";
// import HospitalDashboard from "./pages/dashboard/HospitalDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

import "../src/index.css";

// React Query setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>

          {/* Global Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontSize: "14px",
              },
            }}
          />

          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<VitalMatchOnboarding />} />
            <Route path="/hospital-register" element={<HospitalRegister />} />
            <Route path="/donor-register" element={<DonorRegister />} />

            {/* Protected Routes */}
            {/* <Route
              path="/donor-dashboard"
              element={
                <ProtectedRoute>
                  <DonorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/hospital-dashboard"
              element={
                <ProtectedRoute>
                  <HospitalDashboard />
                </ProtectedRoute>
              }
            /> */}

            {/* Optional: Catch-all route */}
            <Route path="*" element={<h1 className="p-10">404 - Page Not Found</h1>} />

          </Routes>

        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;