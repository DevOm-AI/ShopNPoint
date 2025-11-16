// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

import { 
  Lock, 
  Trash2, 
  ShieldCheck, 
  Loader, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Save,
  Sparkles 
} from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();

  // --- (All state and logic is Unchanged) ---
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsSavingPassword(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        navigate('/login');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.put(
        'http://localhost:5000/api/users/password', 
        { 
          oldPassword: passwordData.oldPassword, 
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword
        }, 
        config
      );

      setPasswordSuccess('Password updated successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update password.';
      setPasswordError(errorMsg);
      if (err.response?.status === 401) {
        localStorage.removeItem('userInfo');
        navigate('/login');
      }
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError('');

    if (deleteConfirmText !== 'DELETE') {
      setDeleteError('Confirmation text does not match. Type "DELETE".');
      return;
    }

    setIsDeleting(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        navigate('/login');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.delete('http://localhost:5000/api/users/profile', config);

      alert('Your account has been permanently deleted.');
      localStorage.removeItem('userInfo');
      navigate('/login');

    // --- INDENTATION FIX IS HERE ---
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete account.';
      setDeleteError(errorMsg);
      if (err.response?.status === 401) {
        localStorage.removeItem('userInfo');
        navigate('/login');
      }
    } finally {
      setIsDeleting(false);
    }
    // --- END OF FIX ---
  };


  return (
    <div className="min-h-screen bg-slate-50">
      
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Account Security</span>
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-4">
            Account
            <span className="text-blue-600">
              {" "}Settings
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Manage your account security and preferences.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
            <ShieldCheck className="w-6 h-6 mr-3 text-blue-600" />
            Change Password
          </h2>

          <form onSubmit={handleSubmitPassword} className="space-y-5">
            {passwordError && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" /> <span>{passwordError}</span>
              </div>
            )}
            {passwordSuccess && (
              <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-start gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" /> <span>{passwordSuccess}</span>
              </div>
            )}

            <InputItem icon={Lock} label="Old Password" name="oldPassword" type="password" value={passwordData.oldPassword} onChange={handlePasswordChange} focusedField={focusedField} setFocusedField={setFocusedField} placeholder="Enter your current password" />
            <InputItem icon={Lock} label="New Password" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} focusedField={focusedField} setFocusedField={setFocusedField} placeholder="Must be at least 6 characters" />
            <InputItem icon={Lock} label="Confirm New Password" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} focusedField={focusedField} setFocusedField={setFocusedField} placeholder="Re-type your new password" />

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={isSavingPassword}
                className="w-auto bg-blue-600 hover:bg-blue-700
                           text-white font-semibold py-3 px-6 rounded-xl 
                           shadow-md hover:shadow-lg
                           transform hover:-translate-y-0.5 transition-all duration-200 
                           disabled:opacity-50 disabled:cursor-not-allowed 
                           disabled:transform-none
                           flex items-center justify-center gap-2 group"
              >
                {isSavingPassword ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{isSavingPassword ? 'Saving...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 
                        border border-red-300 mt-12">
          <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
            <Trash2 className="w-6 h-6 mr-3" />
            Delete Account
          </h2>
          <p className="text-slate-600 mb-6">
            This action is permanent and cannot be undone. All your data, including order history and tokens, will be permanently erased.
          </p>
          <div className="flex justify-end pt-6 border-t border-slate-200">
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isDeleting}
              className="w-auto bg-red-600 hover:bg-red-700
                         text-white font-semibold py-3 px-6 rounded-xl 
                         shadow-md hover:shadow-lg
                         transform hover:-translate-y-0.5 transition-all duration-200 
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete My Account
            </button>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-xl
                        max-w-lg w-full overflow-hidden 
                        transform transition-all duration-300 scale-100">
            
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-red-600">Are you absolutely sure?</h2>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-600"
                  disabled={isDeleting}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-slate-600 mb-4">
                This action is irreversible. To confirm, please type <strong>DELETE</strong> in the box below.
              </p>

              {deleteError && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" /> <span>{deleteError}</span>
                </div>
              )}

              <form onSubmit={handleDeleteAccount}>
                <InputItem 
                  icon={AlertCircle} 
                  label="" 
                  name="deleteConfirm" 
                  type="text" 
                  value={deleteConfirmText} 
                  onChange={(e) => setDeleteConfirmText(e.target.value)} 
                  focusedField={focusedField} 
                  setFocusedField={setFocusedField} 
                  placeholder="Type DELETE to confirm" 
                />
                
                <div className="flex items-center justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isDeleting}
                    className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl 
                               font-semibold hover:bg-slate-50 hover:border-slate-300 
                               transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                    className="bg-red-600 hover:bg-red-700
                               text-white font-semibold py-3 px-6 rounded-xl 
                               shadow-md hover:shadow-lg transition-all duration-200 
                               disabled:opacity-50 disabled:cursor-not-allowed 
                               flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <Loader className="w-5 h-5 animate-spin"/>
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                    <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const InputItem = ({ icon: Icon, label, name, type = 'text', value, onChange, focusedField, setFocusedField, placeholder, className = '' }) => (
  <div className={`group ${className}`}>
    {label && <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>}
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className={`w-5 h-5 transition-colors ${focusedField === name ? (name === 'deleteConfirm' ? 'text-red-600' : 'text-blue-600') : 'text-slate-400'}`} />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocusedField(name)}
        onBlur={() => setFocusedField('')}
        placeholder={placeholder}
        className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 
                   focus:outline-none focus:bg-white transition-all duration-200 
                   ${name === 'deleteConfirm' ? 'focus:border-red-500' : 'focus:border-blue-500'}`}
        required
      />
    </div>
  </div>
);

export default SettingsPage;