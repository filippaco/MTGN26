"use client";
import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
  onClose?: () => void; // prop for a function to call on logout, used to close dropdown on click
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onClose, className }) => {
  const router = useRouter();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log('User signed out');
      onClose?.(); 
      router.push('/'); // redirect to login page
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <button className={className ?? "block px-2 py-2 text-sm hover:text-amber-100 hover:bg-amber-950/10 rounded text-left w-full"} 
    onClick={handleLogout}
    >
    Logga ut
    </button>
  );
};

export default LogoutButton;