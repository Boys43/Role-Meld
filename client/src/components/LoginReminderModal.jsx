import React from 'react';
import { MdCancel } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import LoginModel from './LoginModel';

const LoginReminderModal = ({ 
  isOpen, 
  onClose, 
  showLoginForm = false 
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 backdrop-blur-sm left-0 w-full h-screen flex items-center z-100 justify-center">
      {showLoginForm ? (
        // Login form version (used in FindJobs)
        <div className="bg-white flex flex-col items-center gap-4 shadow-2xl rounded-lg p-8">
          <span className="cursor-pointer">
            <MdCancel onClick={onClose} />
          </span>
          <LoginModel />
        </div>
      ) : (
        // Simple reminder version (used in FeaturedJobs)
        <div className="relative bg-white flex flex-col items-center gap-4 shadow-2xl rounded-lg p-8">
          <span className="absolute top-4 right-4 cursor-pointer">
            <MdCancel onClick={onClose} />
          </span>
          <h3 className="font-bold">
            Please Login First
          </h3>
          <button className="w-full" onClick={() => navigate('/login')}>
            Login
          </button>
          <p>
            You need to be <span className="font-semibold">Login</span> to continue
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginReminderModal;
