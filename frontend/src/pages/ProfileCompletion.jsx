// src/pages/ProfileCompletionPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
// Import 'Phone', 'Home', and 'Mail' which were missing
import { 
  User, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  Loader, 
  AlertCircle, 
  Users as GenderIcon, 
  ArrowRight,
  Phone,  // <-- FIXED: Added missing icon
  Home,   // <-- FIXED: Added missing icon
  Mail    // <-- FIXED: Added missing icon
} from 'lucide-react';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import Logo from '../components/Logo';

const ProfileCompletionPage = () => {
  // --- State Management (UNCHANGED) ---
  const [formData, setFormData] = useState({
    username: '',
    mobile_number: '',
    address: '',
    age: '',
    gender: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  // --- Fetch Existing Profile Data (UNCHANGED) ---
  useEffect(() => {
    setMounted(true);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo || !userInfo.token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get('/api/users/profile', config); // Using proxy
        setFormData({
          username: data.username || '',
          mobile_number: data.mobile_number || '', // Backend sends mobile_number
          address: data.address || '',
          age: data.age || '',
          gender: data.gender || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || ''
        });
      } catch (err) {
        console.error("Failed to fetch profile for completion:", err);
        setError(err.response?.data?.message || 'Failed to load existing profile data.');
        if (err.response?.status === 401) {
          localStorage.removeItem('userInfo');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // --- Input Change Handler ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "age") {
      // allow clearing
      if (value === "") {
        setFormData({ ...formData, age: "" });
        return;
      }

      const val = Number(value);
      if (Number.isNaN(val)) return;

      // block negative
      if (val < 0) return;

      // block above 100
      if (val > 100) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // --- Submit Handler (UNCHANGED) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation for critical fields
    if (!formData.username || !formData.mobile_number || !formData.address ||
        !formData.age || !formData.gender || !formData.city || !formData.state || !formData.pincode) {
      setError('Please fill in all required fields to complete your profile.');
      setLoading(false);
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        navigate('/login');
        return;
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      console.log("Worked till here");

      await axios.put(
        'http://localhost:5000/api/users/profile', // Using proxy
        formData,
        config
      );

      const updatedUserInfo = { ...userInfo, profileCompleted: true };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

      navigate('/dashboard'); 

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile.';
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem('userInfo');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Options for SelectField (UNCHANGED) ---
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];
  const stateOptions = [
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'West Bengal', label: 'West Bengal' },
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Bihar', label: 'Bihar' }
  ];

  return (
    <div className={`min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-3xl w-full"> 
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="large" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Complete Your Profile</h1>
          <p className="text-lg text-slate-600">Please provide your details to personalize your shopping experience.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-slate-200">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-5 h-5"/>
              <span>{error}</span>
            </div>
          )}

          {loading && !formData.username && ( // Show loader only on initial fetch
            <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl flex items-center justify-center space-x-2">
                <Loader className="w-5 h-5 animate-spin"/>
                <span>Loading profile...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username
              </label>
              <InputField
                label="Username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                icon={User}
                placeholder="Your preferred username"
                required
              />
            </div>

            {/* Mobile Number (Icon will now render) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Mobile Number
              </label>
              <InputField
                label="Mobile Number"
                name="mobile_number"
                type="tel"
                value={formData.mobile_number}
                onChange={handleChange}
                icon={Phone} 
                placeholder="e.g., +91 9876543210"
                required
              />
            </div>

            {/* Address (Icon will now render) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Address
              </label>
              <InputField
                label="Full Address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                icon={Home}
                placeholder="House No, Street, Locality"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Age
                </label>
                <InputField
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  icon={Calendar}
                  placeholder="Your age"
                  required
                  min="18"
                  max="100"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Gender
                </label>
                <SelectField
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={genderOptions}
                  icon={GenderIcon}
                  placeholder="Select your gender"
                  required
                />
                </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                City
              </label>
              <InputField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                icon={MapPin}
                placeholder="Your city"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* State */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  State
                </label>
                <SelectField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  options={stateOptions}
                  icon={MapPin}
                  placeholder="Select your state"
                  required
                />
              </div>

              {/* Pincode (Icon will now render) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Pin Code
                </label>
                <InputField
                  label="Pincode"
                  name="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={handleChange}
                  icon={Mail} 
                  placeholder="e.g., 431001"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin"/>
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                <span>{loading ? 'Saving Profile...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/landing"
              className="text-slate-500 hover:text-blue-600 text-sm inline-flex items-center transition-colors font-medium group"
            >
              Skip for now <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionPage;