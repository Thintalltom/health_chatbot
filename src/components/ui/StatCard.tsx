import React from 'react';

export interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    iconColor: string;
    bgIcon?: string;
    patientIcon?: string
}

export function StatCard({ title, value, icon, iconColor, bgIcon, patientIcon }: StatCardProps) {
    return (
        <div className="bg-white rounded-[20px] p-5 shadow-sm cursor-pointer relative overflow-hidden flex-1 min-h-[181px] flex flex-col justify-between group hover:shadow-md transition-shadow border border-[#F2F2F2]">
            <div className="flex justify-between items-start z-10 relative">
                <h3 className="font-satoshi text-[18px] text-[#9B9B9B] mt-1">
                    {title}
                </h3>
                <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#E5E7EB] shadow-sm"
                    style={{ backgroundColor: iconColor }}>
                    {icon}
                </div>
            </div>
            <div className="z-10 relative mt-4">
                <span className="font-satoshi font-bold text-[48px] text-[#080E0D] tracking-tight leading-none">
                    {value}
                </span>
            </div>

            {/* Decorative Background Shape */}
            {bgIcon && 
            <div className="absolute -bottom-16 -right-16 w-32 h-32 transition-opacity pointer-events-none">
                <img src={bgIcon} alt="" className="w-[72px] h-[72px] object-contain" />
            </div>
            }
             {patientIcon && 
            <div className="absolute -bottom-12 -right-12 w-32 h-32 transition-opacity pointer-events-none">
                <img src={patientIcon} alt="" className="w-[72px] h-[72px] object-contain" />
            </div>
            }
        </div>
    );
}
