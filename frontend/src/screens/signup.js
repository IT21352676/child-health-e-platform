import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Emblem from "../assets/Emblem.jpg"
import Background from "../assets/background.jpg"
import { Link } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    nic: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateContactNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateNIC = (nic) => {
    // Sri Lankan NIC validation (old format: 9 digits + V, new format: 12 digits)
    const oldNICRegex = /^[0-9]{9}[vVxX]$/;
    const newNICRegex = /^[0-9]{12}$/;
    return oldNICRegex.test(nic) || newNICRegex.test(nic);
  };

  const validateFullName = (name) => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
  };

  const validatePassword = (password) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password) &&
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  const getFieldError = (field, value) => {
    switch (field) {
      case 'fullName':
        if (!value) return 'Full name is required';
        if (!validateFullName(value)) return 'Please enter a valid full name (letters only)';
        return '';
      
      case 'contactNumber':
        if (!value) return 'Contact number is required';
        if (!validateContactNumber(value)) return 'Please enter a valid 10-digit phone number';
        return '';
      
      case 'email':
        if (!value) return 'Email is required';
        if (!validateEmail(value)) return 'Please enter a valid email address';
        return '';
      
      case 'nic':
        if (!value) return 'NIC is required';
        if (!validateNIC(value)) return 'Please enter a valid NIC (9 digits + V or 12 digits)';
        return '';
      
      case 'password':
        if (!value) return 'Password is required';
        if (!validatePassword(value)) {
          return 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
        }
        return '';
      
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    // Format inputs
    if (name === 'fullName') {
      newValue = value.replace(/[^a-zA-Z\s]/g, ''); // Only letters and spaces
    } else if (name === 'contactNumber') {
      newValue = value.replace(/[^0-9]/g, '').slice(0, 10); // Only numbers, max 10 digits
    } else if (name === 'nic') {
      newValue = value.replace(/[^0-9vVxX]/g, '').toUpperCase(); // Numbers and V/X only
      if (newValue.length > 12) newValue = newValue.slice(0, 12);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Real-time validation for password confirmation
    if (name === 'password' && formData.confirmPassword) {
      const confirmError = formData.confirmPassword !== newValue ? 'Passwords do not match' : '';
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = getFieldError(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const isFormValid = () => {
    const requiredFields = ['fullName', 'contactNumber', 'email', 'nic', 'password', 'confirmPassword'];
    const hasAllFields = requiredFields.every(field => formData[field]);
    const hasNoErrors = Object.values(errors).every(error => !error);
    const termsAccepted = formData.agreeTerms;
    
    // Check for any validation errors
    const validationErrors = {};
    requiredFields.forEach(field => {
      const error = getFieldError(field, formData[field]);
      if (error) validationErrors[field] = error;
    });
    
    return hasAllFields && hasNoErrors && Object.keys(validationErrors).length === 0 && termsAccepted;
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = () => {
    // Validate all fields before submission
    const newErrors = {};
    const fields = ['fullName', 'contactNumber', 'email', 'nic', 'password', 'confirmPassword'];
    
    fields.forEach(field => {
      const error = getFieldError(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(fields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
      return;
    }

    if (!formData.agreeTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    console.log('Sign Up submitted:', formData);
    // Add your sign up logic here
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4 bg-center bg-cover"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="w-full max-w-md p-8 shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full">
              <img className="mb-4" src={Emblem}/>
            </div>
          </div>
          
          <div className="mt-2 mb-2">
            <p className="text-xs text-gray-600">දරුවන්ගේ සෞඛ්‍ය වර්ධන සටහන</p>
            <p className="text-xs text-gray-600">குழந்தை சுகாதார மேம்பாட்டு பதிவு</p>
            <p className="text-xs text-gray-600">CHILD HEALTH DEVELOPMENT RECORD</p>
          </div>
          
          <h2 className="mb-4 text-3xl font-bold text-red-800">Sign Up</h2>

        </div>

        <div className="space-y-6">

          {/* Full Name Input */}
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-4 text-gray-700 placeholder-gray-500 transition-colors border-2 rounded-lg bg-white/70 focus:outline-none ${
                errors.fullName && touched.fullName 
                  ? 'border-red-500 focus:border-red-600' 
                  : 'border-red-300 focus:border-red-500'
              }`}
            />
            {errors.fullName && touched.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          {/* Contact Number Input */}
          <div>
            <input
              type="tel"
              name="contactNumber"
              placeholder="Contact Number"
              value={formData.contactNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              maxLength="10"
              className={`w-full px-4 py-4 text-gray-700 placeholder-gray-500 transition-colors border-2 rounded-lg bg-white/70 focus:outline-none ${
                errors.contactNumber && touched.contactNumber 
                  ? 'border-red-500 focus:border-red-600' 
                  : 'border-red-300 focus:border-red-500'
              }`}
            />
            {errors.contactNumber && touched.contactNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-4 text-gray-700 placeholder-gray-500 transition-colors border-2 rounded-lg bg-white/70 focus:outline-none ${
                errors.email && touched.email 
                  ? 'border-red-500 focus:border-red-600' 
                  : 'border-red-300 focus:border-red-500'
              }`}
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* NIC Input */}
          <div>
            <input
              type="text"
              name="nic"
              placeholder="NIC Number"
              value={formData.nic}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-4 text-gray-700 placeholder-gray-500 transition-colors border-2 rounded-lg bg-white/70 focus:outline-none ${
                errors.nic && touched.nic 
                  ? 'border-red-500 focus:border-red-600' 
                  : 'border-red-300 focus:border-red-500'
              }`}
            />
            {errors.nic && touched.nic && (
              <p className="mt-1 text-sm text-red-600">{errors.nic}</p>
            )}
          </div>

          {/* Password Fields */}
          <div className="relative">
            <input
              type={showPasswords.password ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-4 pr-12 text-gray-700 placeholder-gray-500 transition-colors border-2 rounded-lg bg-white/70 focus:outline-none ${
                errors.password && touched.password 
                  ? 'border-red-500 focus:border-red-600' 
                  : 'border-red-300 focus:border-red-500'
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('password')}
              className="absolute text-gray-400 transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-600"
            >
              {showPasswords.password ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && touched.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPasswords.confirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-4 pr-12 text-gray-700 placeholder-gray-500 transition-colors border-2 rounded-lg bg-white/70 focus:outline-none ${
                errors.confirmPassword && touched.confirmPassword 
                  ? 'border-red-500 focus:border-red-600' 
                  : 'border-red-300 focus:border-red-500'
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirmPassword')}
              className="absolute text-gray-400 transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-600"
            >
              {showPasswords.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms and Privacy Checkbox */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="agreeTerms"
              id="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              className="w-4 h-4 mt-1 text-red-600 border-2 border-red-300 rounded focus:ring-red-500"
            />
            <label htmlFor="agreeTerms" className="text-sm text-gray-700">
              I'm agree to{' '}
              <span className="underline cursor-pointer hover:text-red-600">
                The Terms of Service
              </span>{' '}
              and{' '}
              <span className="underline cursor-pointer hover:text-red-600">
                Privacy Policy
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className="w-full py-4 font-semibold text-white transition-colors duration-200 transform bg-red-800 rounded-lg hover:bg-red-900 disabled:bg-gray-400 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100">
            <Link to="/signin">Create Account</Link>
          </button>

          {/* Switch to Sign In */}
          <div className="text-center">
            <span className="text-gray-700">
              Already have an account?{' '}
              <a
                href="/signin"
                className="font-medium text-gray-900 underline transition-colors hover:text-red-600"
              >
                Sign In
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}