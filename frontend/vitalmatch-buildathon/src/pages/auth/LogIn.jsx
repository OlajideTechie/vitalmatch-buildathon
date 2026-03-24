import React, { useState } from 'react';

const Login = () => {
  // Form state
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    remindMe: false,
  });

  // Validation state
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for a field when the user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Phone validation (simple check for empty or minimum length)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Proceed with actual login logic here (e.g., API call)
      console.log('Form submitted successfully:', formData);
      alert('Login successful!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 font-sans">
      <div className="max-w-md w-full">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-[#3b82f6] font-bold text-lg mb-4 tracking-wide">
            VitalMatch
          </h2>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-500 text-lg">
            Please enter your details
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Phone Number Input */}
          <div>
            <label 
              htmlFor="phone" 
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors
                ${errors.phone 
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                  : 'border-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors
                ${errors.password 
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                  : 'border-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Options Row */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                id="remindMe"
                name="remindMe"
                type="checkbox"
                checked={formData.remindMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label 
                htmlFor="remindMe" 
                className="ml-2 block text-sm font-medium text-gray-800 cursor-pointer"
              >
                Remind me
              </label>
            </div>
            
            <button type="button" className="text-sm text-gray-400 hover:text-gray-600">
              Forgotten Password?
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-semibold py-3.5 px-4 rounded-full transition duration-200"
            >
              Login
            </button>
          </div>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button className="text-[#3b82f6] font-medium hover:underline">
              Sign up
            </button>
          </p>
          <div>
            <button className="text-sm text-[#3b82f6] hover:underline">
              Need Help
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;