import React from 'react';
import {
  BarChart3Icon,
  UsersIcon,
  ActivityIcon,
  CheckSquareIcon,
  ClockIcon
} from
  'lucide-react';
import statusUp from '../../assets/svgs/status-up.svg';
import verify from '../../assets/svgs/verify.svg';
import calendar from '../../assets/svgs/calendar.svg';
import chart from '../../assets/svgs/chart.svg';
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor: string;
  bgIcon: string;
}
function StatCard({ title, value, icon, iconColor, bgIcon }: StatCardProps) {
  return (
    <div className="bg-white rounded-[20px] p-5 shadow-[0px_1px_1px_rgba(0,0,0,0.04)] relative overflow-hidden flex-1 min-h-[181px] flex flex-col justify-between group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start z-10 relative">
        <h3 className="font-satoshi text-[18px] text-[#9B9B9B] mt-1">
          {title}
        </h3>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
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
      <div className="absolute -bottom-16 -right-16 w-32 h-32  transition-opacity pointer-events-none">
        <img src={bgIcon} alt="" className="w-[72px] h-[72px] object-contain" />
      </div>
    </div>);

}
export function OverviewSection() {
  return (
    <div className="w-full rounded-[28px] border border-[#F2F2F2] bg-[#F4F5F6] p-5 shadow-sm">
      <div className="flex flex-row gap-3 items-center ml-2 mb-5">
        <BarChart3Icon
          className="w-[22px] h-[22px] text-[#6AA7FF]"
          strokeWidth={2.5} />

        <h2 className="font-satoshi font-medium text-[20px] text-[#080E0D]">
          Overview
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <StatCard
          title="Total Patients"
          value="150"
          icon={
            <UsersIcon className="w-5 h-5 text-[#080E0D]" strokeWidth={2} />
          }
          iconColor="#E8F3FF"
          bgIcon={chart} />

        <StatCard
          title="Total Consultations"
          value="600"
          icon={
            <ActivityIcon className="w-5 h-5 text-[#418BF5]" strokeWidth={2} />
          }
          iconColor="#E3F2FD"
          bgIcon={statusUp} />

        <StatCard
          title="Completed Consultations"
          value="420"
          icon={
            <CheckSquareIcon
              className="w-5 h-5 text-[#2CA913]"
              strokeWidth={2} />

          }
          iconColor="#E8F5E9"
          bgIcon={verify} />

        <StatCard
          title="Patients Waiting"
          value="8"
          icon={
            <ClockIcon className="w-5 h-5 text-[#FFC107]" strokeWidth={2} />
          }
          iconColor="#FFF8E1"
          bgIcon={calendar} />

      </div>
    </div>);

}