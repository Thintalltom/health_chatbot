import React from 'react';
import { useGetDashboardStatsQuery } from '../../store/slices/dashboardApiSlice';
import statusUp from '../../assets/svgs/status-up.svg';
import verify from '../../assets/svgs/verify.svg';
import calendar from '../../assets/svgs/calendar.svg';
import chart from '../../assets/svgs/chart.svg';
import peopleIcon from '../../assets/svgs/people.png';
import stethoscopeIcon from '../../assets/svgs/stethoscope.png';
import taskSquareIcon from '../../assets/svgs/task-square.png';
import clockIcon from '../../assets/svgs/clock.png';
import chartIcon from '../../assets/svgs/chart.png';
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
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-[0px_1px_2px_rgba(0,0,0,0.1)] border border-[#F2F2F2]"
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
  const { data: dashboardStats, isLoading, error } = useGetDashboardStatsQuery();

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full rounded-[28px] border border-[#F2F2F2] bg-[#F4F5F6] p-5 shadow-sm">
        <div className="flex flex-row gap-3 items-center ml-2 mb-5">
          <img src={chartIcon} alt="Chart" className="w-[22px] h-[22px]" />
          <h2 className="font-satoshi font-medium text-[20px] text-[#080E0D]">
            Overview
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-[20px] p-5 shadow-[0px_1px_1px_rgba(0,0,0,0.04)] flex-1 min-h-[181px] animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    console.error('Dashboard stats error:', error);
  }

  // Use API data or fallback to default values
  const stats = dashboardStats || {
    total_patients: 150,
    total_consultations: 600,
    completed_consultations: 420,
    patients_waiting: 8,
  };

  return (
    <div className="w-full rounded-[28px] border border-[#F2F2F2] bg-[#F4F5F6] p-5 shadow-sm">
      <div className="flex flex-row gap-3 items-center ml-2 mb-5">
        <img src={chartIcon} alt="Chart" className="w-[22px] h-[22px]" />
        <h2 className="font-satoshi font-medium text-[20px] text-[#080E0D]">
          Overview
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <StatCard
          title="Total Patients"
          value={stats.total_patients.toString()}
          icon={
            <img src={peopleIcon} alt="People" className="w-5 h-5" />
          }
          iconColor="#ffffff"
          bgIcon={chart} />

        <StatCard
          title="Total Consultations"
          value={stats.total_consultations.toString()}
          icon={
            <img src={stethoscopeIcon} alt="Stethoscope" className="w-5 h-5" />
          }
          iconColor="#ffffff"
          bgIcon={statusUp} />

        <StatCard
          title="Completed Consultations"
          value={stats.completed_consultations.toString()}
          icon={
            <img src={taskSquareIcon} alt="Task Square" className="w-5 h-5" />
          }
          iconColor="#ffffff"
          bgIcon={verify} />

        <StatCard
          title="Patients Waiting"
          value={stats.patients_waiting.toString()}
          icon={
            <img src={clockIcon} alt="Clock" className="w-5 h-5" />
          }
          iconColor="#ffffff"
          bgIcon={calendar} />

      </div>
    </div>);

}