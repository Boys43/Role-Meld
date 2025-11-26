import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const LoginPortal = ({ loginReminder, setLoginReminder }) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loginReminder) {
      setShow(true); // trigger animation
    } else {
      // delay unmount to allow animation to finish
      const timeout = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [loginReminder]);

  if (!show && !loginReminder) return null; // unmount after animation

  return createPortal(
    <div className={`fixed top-0 left-0 w-full h-screen flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${loginReminder ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`relative bg-white flex flex-col items-center gap-4 shadow-2xl rounded-lg p-8 transition-all duration-300 transform ${loginReminder ? 'scale-100' : 'scale-0'}`}>
        <span className="absolute top-4 right-4 cursor-pointer" onClick={() => setLoginReminder(false)}>
          <X />
        </span>
        <h3 className="font-bold">Please Login First</h3>
        <button className="primary-btn" onClick={() => navigate('/login')}>
          Login
        </button>
        <p>
          You need to be <span className="font-semibold">Login</span> to continue
        </p>
      </div>
    </div>,
    document.body
  );
};

export default LoginPortal;
