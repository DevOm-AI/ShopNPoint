// src/pages/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Coins, Mail, Phone, MapPin, Gift, Tag, CalendarDays, Edit, Save, X 
} from 'lucide-react'; 
import axios from 'axios';

import Header from '../components/Header'; // Adjust the import path if necessary
// --- IMPORT YOUR EXISTING COMPONENTS ---
import InputField from '../components/InputField'; // Adjust path if needed
import SelectField from '../components/SelectField'; // Adjust path if needed
// --- END IMPORT ---

const UserDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false); 

  const [editForm, setEditForm] = useState({
    username: '',
    age: '',
    gender: '',
    mobile_number: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    promo_code: '' 
  });

  const navigate = useNavigate();

  // --- Effect Hook (Unchanged) ---
  useEffect(() => {
    const fetchUserDetails = async () => {
      setError('');
      setSuccess('');
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        if (userInfo && userInfo.token) {
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          };
          const { data } = await axios.get('http://localhost:5000/api/users/profile', config);
          setUserDetails(data);
          setEditForm({
            username: data.username || '',
            age: data.age || '',
            gender: data.gender || '',
            mobile_number: data.mobile_number || '',
            address: data.address || '',
            city: data.city || '',
            pincode: data.pincode || '',
            state: data.state || '',
            promo_code: data.promo_code || ''
          });
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error("Failed to fetch user details", err);
        setError('Could not load user details. Please try logging in again.');
        localStorage.removeItem('userInfo');
        navigate('/login');
      }
    };

    fetchUserDetails();
  }, [navigate]);

  // --- Handlers (Unchanged) ---
  const handleEditClick = () => {
    setIsEditing(true);
    setError(''); 
    setSuccess(''); 
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    if (userDetails) {
      setEditForm({
        username: userDetails.username || '',
        age: userDetails.age || '',
        gender: userDetails.gender || '',
        mobile_number: userDetails.mobile_number || '',
        address: userDetails.address || '',
        city: userDetails.city || '',
        pincode: userDetails.pincode || '',
        state: userDetails.state || '',
        promo_code: userDetails.promo_code || ''
      });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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

      const updatedFields = {};
      for (const key in editForm) {
        if (editForm[key] !== userDetails[key] && editForm[key] !== undefined && editForm[key] !== null) {
          updatedFields[key] = editForm[key];
        }
      }

      if (Object.keys(updatedFields).length === 0) {
        setSuccess('No changes to save.');
        setIsEditing(false);
        return;
      }

      const { data } = await axios.put('http://localhost:5000/api/users/profile', updatedFields, config);
      
      setUserDetails(data); 
      setIsEditing(false); 
      setSuccess('Profile updated successfully!'); 

    } catch (err) {
      console.error("Failed to update user details", err);
      setError(err.response && err.response.data.message ? err.response.data.message : 'Failed to update profile.');
    }
  };

  // --- Loading and Error States (Minimalist) ---
  if (!userDetails) {
    return (
        // Consistent spinner
        <div className="flex justify-center items-center h-screen bg-slate-50">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 
                            rounded-full animate-spin"></div>
        </div>
    );
  }

  if (error && !isEditing) { 
     return (
        <div className="flex justify-center items-center h-screen bg-slate-50">
            <div className="text-xl font-semibold text-red-600">{error}</div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header (Minimalist) */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            {/* Lighter, smaller font */}
            <h1 className="text-3xl font-semibold text-slate-900">
              User Dashboard
            </h1>
            {/* Slate palette */}
            <p className="text-lg text-slate-600 mt-1">
              Welcome back, {userDetails.username || 'User'}!
            </p>
          </div>
          {/* Edit Profile Button (This was already good, matches new style) */}
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition duration-300 flex items-center gap-2"
            >
              <Edit className="w-5 h-5" /> Edit Profile
            </button>
          )}
        </header>

        {/* Success/Error (Unchanged, already good) */}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>}
        {error && isEditing && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* User Details Card (Minimalist) */}
          {/* Softer shadow, slate border */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-md border border-slate-200">
            <div className="flex items-center mb-6">
              <User className="w-8 h-8 text-blue-600" />
              {/* Lighter, smaller font, slate color */}
              <h2 className="ml-4 text-xl font-semibold text-slate-900">User Details</h2>
            </div>
            
            <div className="border-t border-slate-200 pt-6">
              <form onSubmit={handleFormSubmit}>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  
                  {isEditing ? (
                    <>
                      {/* These components are fine, they don't have the "fraudulent" styling */}
                      <InputField icon={User} label="Username" name="username" value={editForm.username} onChange={handleFormChange} />
                      <InputField icon={CalendarDays} label="Age" name="age" type="number" value={editForm.age} onChange={handleFormChange} />
                      <SelectField 
                        icon={Tag} 
                        label="Gender" 
                        name="gender" 
                        value={editForm.gender} 
                        onChange={handleFormChange} 
                        options={['Male', 'Female', 'Other'].map(gender => ({ value: gender, label: gender }))}
                        placeholder="Select Gender"
                      />
                      <InputField icon={Phone} label="Mobile Number" name="mobile_number" value={editForm.mobile_number} onChange={handleFormChange} />
                      <InputField icon={MapPin} label="Address" name="address" value={editForm.address} onChange={handleFormChange} />
                      <InputField icon={MapPin} label="City" name="city" value={editForm.city} onChange={handleFormChange} />
                      <InputField icon={MapPin} label="Pincode" name="pincode" value={editForm.pincode} onChange={handleFormChange} />
                      <InputField icon={MapPin} label="State" name="state" value={editForm.state} onChange={handleFormChange} />
                      <InputField icon={Gift} label="Promo Code" name="promo_code" value={editForm.promo_code} onChange={handleFormChange} />
                    </>
                  ) : (
                    <>
                      {/* DetailItem helper component now uses slate palette */}
                      <DetailItem icon={User} label="Username" value={userDetails.username} />
                      <DetailItem icon={CalendarDays} label="Age" value={userDetails.age} />
                      <DetailItem icon={Tag} label="Gender" value={userDetails.gender || 'Not specified'} />
                      <DetailItem icon={Phone} label="Mobile Number" value={userDetails.mobile_number} />
                      <DetailItem icon={MapPin} label="Address" value={userDetails.address} />
                      <DetailItem icon={MapPin} label="City" value={userDetails.city} />
                      <DetailItem icon={MapPin} label="Pincode" value={userDetails.pincode} />
                      <DetailItem icon={MapPin} label="State" value={userDetails.state} />
                      <DetailItem icon={Gift} label="Promo Code" value={userDetails.promo_code} />
                    </>
                  )}
                </dl>

                {isEditing && (
                  <div className="mt-8 flex justify-end gap-4">
                    {/* Cancel button updated to slate palette */}
                    <button
                      type="button"
                      onClick={handleCancelClick}
                      className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl shadow-sm hover:bg-slate-50 transition duration-300 flex items-center gap-2"
                    >
                      <X className="w-5 h-5" /> Cancel
                    </button>
                    {/* Save button is fine */}
                    <button
                      type="submit"
                      className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition duration-300 flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" /> Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Total Tokens Card (Minimalist) */}
          <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200">
            <div className="flex items-center mb-6">
              {/* Blue icon to match TokensPage */}
              <Coins className="w-8 h-8 text-blue-600" />
              <h2 className="ml-4 text-xl font-semibold text-slate-900">Total Tokens</h2>
            </div>
            <div className="border-t border-slate-200 pt-6 text-center">
              {/* NO GRADIENT, lighter font, brand color */}
              <p className="text-6xl font-semibold text-blue-600">
                {userDetails.total_tokens || 0}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Earn more tokens by shopping with us!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper component (Minimalist)
// Updated to use slate palette
const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start">
    <Icon className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
    <div className="ml-4">
      <dt className="text-sm font-medium text-slate-600">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-slate-900">{value || 'N/A'}</dd>
    </div>
  </div>
);

export default UserDashboard;