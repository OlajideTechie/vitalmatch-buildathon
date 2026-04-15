import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import CompletedRequests from "./pages/hospital/CompletedRequests";
import Login from "./pages/auth/LogIn";
import VitalMatchOnboarding from "./VitalMatchOnboarding";
import HospitalRegister from "./pages/auth/HospitalRegister";
import DonorRegister from "./pages/auth/DonorRegister";
import DonorLayout from "./components/DonorLayout";
import HospitalLayout from "./components/HospitalLayout";
import DonorDashboard from "./pages/donor/DonorDashboard";
import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import CreateRequests from "./pages/hospital/CreateRequests";
import ViewRequest from "./pages/hospital/ViewRequest";
import RewardPage from "./pages/donor/RewardPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import DonationHistory from "./pages/donor/DonationHistory";
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
            <Route path="/hospital/requests/:id" element={<ViewRequest />} />

            {/* Protected Routes */}
            <Route
              path="/donor-dashboard"
              element={
                <ProtectedRoute>
                  <DonorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DonorDashboard />} />
              <Route path="rewards" element={<RewardPage />} />
              <Route path="donation-history" element={<DonationHistory />} />
            </Route>

            <Route
              path="/hospital-dashboard"
              element={
                <ProtectedRoute>
                  <HospitalLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<HospitalDashboard />} />
              <Route path="create-request" element={<CreateRequests />} />
              <Route path="completed-requests" element={<CompletedRequests />} />
            </Route>

            {/* Optional: Catch-all route */}
            <Route path="*" element={<h1 className="p-10">404 - Page Not Found</h1>} />

          </Routes>

        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;