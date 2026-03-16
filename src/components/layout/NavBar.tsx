import React from 'react';
import { BellIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../ui/UserProfile';
export function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <nav className="w-full bg-white rounded-[28px] shadow-[0px_2px_8px_rgba(0,0,0,0.04)] px-6 py-5 flex justify-between items-center">
      {/* Logo */}
      <div className="text-[#080E0D] font-satoshi font-bold text-[28px] tracking-tight ml-2">
        LOGO
      </div>

      {/* Right Section */}
      <div className="flex flex-row gap-5 items-center">
        {/* Date Widget */}
        <div className="flex flex-row gap-3 items-center">
          <div className="flex flex-col shadow-[0px_2px_8px_rgba(0,0,0,0.08)] rounded-xl overflow-hidden">
            <div className="bg-[#14B8A6] text-white font-mulish font-bold text-[10px] leading-none py-1.5 px-2 text-center">
              FEB
            </div>
            <div className="bg-white text-[#080E0D] font-satoshi font-bold text-base py-1.5 px-2 text-center">
              16
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-satoshi font-medium text-[18px] text-[#080E0D] leading-tight">
              February 16, 2026.
            </span>
            <span className="font-mulish font-medium text-[14px] text-[#9B9B9B] leading-tight mt-0.5">
              Wednesday
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-[#F2F2F2] mx-1"></div>

        {/* Notifications */}
        <div className="relative cursor-pointer p-2">
          <BellIcon className="w-6 h-6 text-[#BCBCBC]" strokeWidth={2} />
          <div className="absolute top-2 right-2 w-2 h-2 bg-[#E30303] rounded-full border border-white"></div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-[#F2F2F2] mx-1"></div>

        {/* User Profile */}
        <UserProfile
          name="Joanne D."
          title="Surgeon"
          image="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&q=80"
          onLogout={handleLogout}
        />
      </div>
    </nav>);

}