import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Calendar, Users, Phone, Home, Building, Hash, MapPin, CheckCircle } from 'lucide-react';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';

const ProfileCompletionPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    gender: '',
    age: '',
    mobileNumber: '',
    address: '',
    city: '',
    pincode: '',
    state: ''
  });
  
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  // --- THIS IS THE MAIN CHANGE ---
  // The data-fetching logic has been removed.
  // We now only have a simple useEffect to get the username for display purposes.
  useEffect(() => {
    setMounted(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo.username) {
        setFormData(prevData => ({ ...prevData, username: userInfo.username }));
      } else {
        // If no user info, they shouldn't be here
        navigate('/login');
      }
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);
  // --- END CHANGE ---

  const genderOptions = [ { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }];
  const stateOptions = [ { value: 'maharashtra', label: 'Maharashtra' }, { value: 'delhi', label: 'Delhi' }, { value: 'karnataka', label: 'Karnataka' } ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const validateForm = () => { return true; };

  // This function remains the same, as it correctly sends all the data.
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true);
      setErrors({});

      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const dataToUpdate = {
          gender: formData.gender,
          age: formData.age,
          city: formData.city,
          pincode: formData.pincode,
          state: formData.state,
          mobile_number: formData.mobileNumber,
          address: formData.address
        };

        await axios.put(
          'http://localhost:5000/api/users/profile',
          dataToUpdate,
          config
        );

        alert('Profile updated successfully!');
        navigate('/landing');

      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to update profile.';
        setErrors({ api: errorMessage });
        alert(`Error: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-blue-600 relative overflow-hidden">
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl">
          <div className={`text-center mb-12 transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tight">
              Profile<span className="block text-orange-400 text-5xl md:text-6xl mt-2">Completion</span>
            </h1>
          </div>
          <div className={`bg-white rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-sm transform transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}>
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-blue-600 mb-3">Complete Your Profile!</h2>
              <p className="text-gray-600 text-lg">Help us personalize your experience</p>
              <div className="w-16 h-1 bg-orange-400 mx-auto mt-4 rounded-full"></div>
            </div>
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-blue-600 text-sm font-bold mb-3 uppercase tracking-wide">Username (as registered)</label>
                  <InputField icon={User} type="text" name="username" value={formData.username} onChange={handleInputChange} disabled={true} />
                </div>
                <div>
                  <label className="block text-blue-600 text-sm font-bold mb-3 uppercase tracking-wide">Gender</label>
                  <SelectField icon={Users} name="gender" value={formData.gender} onChange={handleInputChange} options={genderOptions} placeholder="Select your gender" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-blue-600 text-sm font-bold mb-3 uppercase tracking-wide">Age</label>
                  <InputField icon={Calendar} type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="Enter your age" />
                </div>
                <div>
                  <label className="block text-blue-600 text-sm font-bold mb-3 uppercase tracking-wide">Mobile Number</label>
                  <InputField icon={Phone} type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} placeholder="Enter your mobile number" />
                </div>
              </div>
              <div>
                <label className="block text-blue-600 text-sm font-bold mb-3 uppercase tracking-wide">Address</label>
                <InputField icon={Home} type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter your complete address" />
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <label className="block text-blue-600 text-sm font-bold mb-3 uppercase tracking-wide">City</label>
                  <InputField icon={Building} type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter your city" />
                </div>
                <div>
                  <label className="block text-blue-600 text-sm font-bold mb-3 uppercase tracking-wide">Pincode</label>
                  <InputField icon={Hash} type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Enter pincode" />
                </div>
                <div>
                  <label className="block text-blue-600 text-sm font-bold mb-3 uppercase tracking-wide">State</label>
                  <SelectField icon={MapPin} name="state" value={formData.state} onChange={handleInputChange} options={stateOptions} placeholder="Select your state" />
                </div>
              </div>
              <div className="pt-8">
                <button onClick={handleSubmit} disabled={isLoading} className="group relative w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 focus:outline-none focus:ring-4 focus:ring-orange-300 text-xl overflow-hidden">
                  <span className={`relative z-10 transition-opacity duration-300 flex items-center justify-center ${isLoading ? 'opacity-0' : 'opacity-100'}`}><CheckCircle className="w-6 h-6 mr-2" />COMPLETE PROFILE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionPage;