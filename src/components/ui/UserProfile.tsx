import React, { useState } from 'react';
import { ChevronDownIcon, LogOutIcon } from 'lucide-react';

interface UserProfileProps {
    name?: string;
    title?: string;
    image?: string;
    onLogout?: () => void;
}

export function UserProfile({
    name = 'Joanne D.',
    title = 'Surgeon',
    image = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&q=80',
    onLogout = () => { ''}
}: UserProfileProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-row gap-3 items-center cursor-pointer hover:bg-gray-50 p-1.5 rounded-2xl transition-colors"
            >
                <div className="w-10 h-10 rounded-full bg-[#C4C4C4] overflow-hidden flex-shrink-0">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex flex-col justify-center mr-1">
                    <span className="font-mulish font-semibold text-[16px] text-[#080E0D] leading-tight">
                        {name}
                    </span>
                    <span className="font-mulish font-semibold text-[12px] text-[#BCBCBC] leading-tight mt-0.5">
                        {title}
                    </span>
                </div>
                <ChevronDownIcon
                    className={`w-4 h-4 text-[#080E0D] ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    strokeWidth={2.5}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-[#EDEDED] overflow-hidden z-50">
                    {/* User Details */}
                    <div className="p-4 border-b border-[#EDEDED]">
                        <div className="flex flex-row gap-3 items-center">
                            <div className="w-12 h-12 rounded-full bg-[#C4C4C4] overflow-hidden flex-shrink-0">
                                <img
                                    src={image}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="font-mulish font-semibold text-[16px] text-[#080E0D] leading-tight">
                                    {name}
                                </span>
                                <span className="font-mulish font-semibold text-[12px] text-[#BCBCBC] leading-tight mt-0.5">
                                    {title}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onLogout();
                        }}
                        className="w-full flex flex-row gap-3 items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                        <LogOutIcon className="w-5 h-5 text-[#E30303]" strokeWidth={2} />
                        <span className="font-mulish font-semibold text-[14px] text-[#080E0D]">
                            Logout
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}
