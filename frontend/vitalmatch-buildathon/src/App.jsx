import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/LogIn";
import VitalMatchOnboarding from "./VitalMatchOnboarding";
import HospitalRegister from "./pages/auth/HospitalRegister";
import DonorRegister from "./pages/auth/DonorRegister";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../src/index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<VitalMatchOnboarding />} />
        <Route path="/hospital-register" element={<HospitalRegister />} />
        <Route path="/donor-register" element={<DonorRegister />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;