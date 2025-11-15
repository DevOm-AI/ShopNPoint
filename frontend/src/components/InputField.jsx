import React from 'react';
import { CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const InputField = ({
  icon: Icon,
  type,
  name,
  value,
  error,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  disabled,
  readOnly,
  showPasswordToggle,
  showPassword,
  setShowPassword,
  focusedField
}) => {
  return (
    <div className="relative group">
      <div className={`relative overflow-hidden rounded-2xl bg-white border-2 transition-all duration-500 ${
        focusedField === name 
          ? 'border-blue-500 shadow-2xl shadow-blue-500/20 scale-105' 
          : error 
            ? 'border-red-400 shadow-lg shadow-red-500/10' 
            : 'border-gray-200 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/10'
      } ${disabled ? 'opacity-60' : ''}`}>
        
        <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${
          focusedField === name ? 'opacity-100' : ''
        } bg-gradient-to-r from-blue-50 to-orange-50`}></div>
        
        <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
          focusedField === name ? 'text-blue-500 scale-110' : 'text-gray-400'
        }`}>
          <Icon className="w-5 h-5" />
        </div>

        <input
          type={showPasswordToggle && !showPassword ? 'password' : type}
          name={name}
          value={value} 
          onChange={onChange}
          onFocus={() => onFocus && onFocus(name)}
          onBlur={() => onBlur && onBlur()}
          placeholder={placeholder}
          className={`w-full pl-12 py-5 bg-transparent border-0 outline-none text-gray-800 placeholder-gray-400 text-lg relative z-10 
            ${showPasswordToggle ? 'pr-12' : 'pr-4'}
            ${disabled ? 'text-gray-700 cursor-not-allowed' : ''}
          `}
        />
        
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword && setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-all duration-200 z-10"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        
        {value && !error && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 z-10">
            <CheckCircle className="w-5 h-5" />
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 text-red-500 text-sm font-medium flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default InputField;