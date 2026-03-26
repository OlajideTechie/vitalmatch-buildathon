import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from 'lucide-react';
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import InputField from '../../components/InputField';
import PasswordInput from '../../components/PasswordInput';
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();

  const loginUser = async (payload) => {
    const res = await fetch(
      "https://vitalmatch-backend-service.onrender.com/api/auth/donor/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.message || "Login failed");
      error.response = { data };
      throw error;
    }
    return data;
  };

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.user, data.access_token);

      toast.success("Welcome back! 👋");

      const role = data.user.role;

      if (role === "donor") {
        navigate("/donor-dashboard");
      } else if (role === "hospital") {
        navigate("/hospital-dashboard");
      } else {
        navigate("/");
      }
    },
    onError: (error) => {
      const responseData = error?.response?.data;
      // Handle backend field-specific errors or global message
      if (responseData?.errors) {
        setErrors(responseData.errors);
      } else {
        setGlobalError(responseData?.message || "Invalid credentials. Please try again.");
      }
      toast.error("Login failed.");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGlobalError('');
    if (validateForm()) {
      // Map frontend keys to backend expectations (e.g., phone_number)
      mutation.mutate({
        email: formData.email,
        password: formData.password
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8 font-sans">
      <div className="max-w-md w-full">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-[#3b82f6] font-bold text-[26px] mb-4 tracking-wide">
            VitalMatch
          </h2>
          <h1 className="text-4xl font-extrabold text-[#0A0A0A] mb-2">
            Welcome Back!
          </h1>
          <p className="text-[#797B8B] text-lg">
            Please enter your details
          </p>
        </div>

        {/* Global Error Display */}
        {globalError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{globalError}</p>
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <InputField 
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            error={errors.email}
          />

          <PasswordInput 
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            error={errors.password}
          />

          <div className="flex items-center justify-end mt-4">
            <button type="button" className="text-sm text-[#797B8B] hover:text-gray-600">
              Forgotten Password?
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold py-3.5 px-4 rounded-full transition duration-200 disabled:opacity-50"
            >
              {mutation.isPending ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center space-y-3">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/onboarding" className="text-[#3b82f6] font-medium hover:underline">
              Sign up
            </Link>
          </p>
          <button className="text-sm text-[#3b82f6] hover:underline">
            Need Help?
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;