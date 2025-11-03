import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const SelectField = ({
  icon: Icon,
  name,
  value,
  error,
  onChange,
  onFocus,
  onBlur,
  options,
  placeholder,
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
      }`}>
        
        <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${
          focusedField === name ? 'opacity-100' : ''
        } bg-gradient-to-r from-blue-50 to-orange-50`}></div>
        
        <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
          focusedField === name ? 'text-blue-500 scale-110' : 'text-gray-400'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        
        <select
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => onFocus && onFocus(name)}
          onBlur={() => onBlur && onBlur()}
          className="w-full pl-12 py-5 bg-transparent border-0 outline-none text-gray-800 text-lg relative z-10 pr-10 appearance-none cursor-pointer"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {value && !error && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-green-500 z-10">
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

export default SelectField;