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

  // --- Effect Hook to Fetch User Details ---
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
          // Initialize edit form state with fetched user details
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

  // --- Handlers for Edit Mode ---
  const handleEditClick = () => {
    setIsEditing(true);
    setError(''); 
    setSuccess(''); 
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    // Re-initialize edit form with original details (if available)
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

      // Filter out empty or unchanged fields to send only actual updates
      const updatedFields = {};
      for (const key in editForm) {
        // We only send fields if their value is different from the original userDetails
        // and if they are not undefined/null from the form (i.e., user actively changed/entered something)
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

  // --- Loading and Error States ---
  if (!userDetails) {
    return (
        <div className="flex justify-center items-center h-screen bg-slate-50">
            <div className="text-xl font-semibold text-gray-700">Loading Dashboard...</div>
        </div>
    );
  }

  if (error && !isEditing) { 
     return (
        <div className="flex justify-center items-center h-screen bg-slate-50">
            <div className="text-xl font-semibold text-red-500">{error}</div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-gray-800">
              User Dashboard
            </h1>
            <p className="text-lg text-gray-500 mt-1">
              Welcome back, {userDetails.username || 'User'}! Here are your details.
            </p>
          </div>
          {/* Edit Profile Button */}
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition duration-300 flex items-center gap-2"
            >
              <Edit className="w-5 h-5" /> Edit Profile
            </button>
          )}
        </header>

        {/* Success and Error Messages */}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>}
        {error && isEditing && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* User Details Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <User className="w-8 h-8 text-blue-600" />
              <h2 className="ml-4 text-2xl font-bold text-gray-800">User Details</h2>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <form onSubmit={handleFormSubmit}>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  
                  {/* Conditionally render inputs or static text using YOUR COMPONENTS */}
                  {isEditing ? (
                    <>
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
                    <button
                      type="button"
                      onClick={handleCancelClick}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl shadow-sm hover:bg-gray-50 transition duration-300 flex items-center gap-2"
                    >
                      <X className="w-5 h-5" /> Cancel
                    </button>
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

          {/* Total Tokens Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <Coins className="w-8 h-8 text-orange-500" />
              <h2 className="ml-4 text-2xl font-bold text-gray-800">Total Tokens</h2>
            </div>
            <div className="border-t border-gray-200 pt-6 text-center">
              <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">
                {userDetails.total_tokens || 0}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Earn more tokens by shopping with us!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper component for consistent styling of detail items (view mode)
const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start">
    <Icon className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
    <div className="ml-4">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-gray-900">{value || 'N/A'}</dd>
    </div>
  </div>
);

export default UserDashboard;