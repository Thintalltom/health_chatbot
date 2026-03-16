import  { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UsersIcon,
  ArrowUpRightIcon,
  SearchIcon,
  FilterIcon,
  TimerIcon,
  CheckCircle2Icon,
  EyeIcon,
  Check
} from
  'lucide-react';
import { Table, TableColumn } from '../ui/Table';
interface PatientData {
  id: number;
  name: string;
  age: number;
  gender: string;
  paymentType: string;
  status: 'Pending' | 'Seen';
}
const patientsData: PatientData[] = [
  {
    id: 1,
    name: 'Adaobi Nnaji',
    age: 18,
    gender: 'Female',
    paymentType: 'HMO',
    status: 'Pending'
  },
  {
    id: 2,
    name: 'Bola Kazeem',
    age: 22,
    gender: 'Female',
    paymentType: 'HMO',
    status: 'Pending'
  },
  {
    id: 3,
    name: 'Emeka Okafor',
    age: 25,
    gender: 'Male',
    paymentType: 'Self-pay',
    status: 'Seen'
  },
  {
    id: 4,
    name: 'Chika Anozie',
    age: 30,
    gender: 'Female',
    paymentType: 'HMO',
    status: 'Pending'
  },
  {
    id: 5,
    name: 'Nkechi Uche',
    age: 35,
    gender: 'Male',
    paymentType: 'Self Pay',
    status: 'Pending'
  },
  {
    id: 6,
    name: 'Ifeanyi Eze',
    age: 40,
    gender: 'Male',
    paymentType: 'HMO',
    status: 'Seen'
  },
  {
    id: 7,
    name: 'Ogechi Onwuka',
    age: 45,
    gender: 'Male',
    paymentType: 'Self Pay',
    status: 'Seen'
  },
  {
    id: 8,
    name: 'Tunde Balogun',
    age: 50,
    gender: 'Male',
    paymentType: 'Self Pay',
    status: 'Seen'
  },
  {
    id: 9,
    name: 'Sofia Adeyemi',
    age: 55,
    gender: 'Female',
    paymentType: 'HMO',
    status: 'Pending'
  },
  {
    id: 10,
    name: 'Daniel Obinna',
    age: 28,
    gender: 'Male',
    paymentType: 'Self Pay',
    status: 'Seen'
  }];

export function ScheduledPatients() {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get status filter from URL
  const params = new URLSearchParams(window.location.search);
  const statusFilter = params.get('status') || 'All';

  // Filter options
  const filterOptions = ['All', 'Pending', 'Seen'];

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    const newParams = new URLSearchParams(window.location.search);
    if (filter === 'All') {
      newParams.delete('status');
    } else {
      newParams.set('status', filter);
    }
    window.history.pushState({}, '', `?${newParams.toString()}`);
    setIsFilterOpen(false);
    window.location.reload();
  };

  // Filter table data based on selected status
  const filteredData = useMemo(() => {
    if (statusFilter === 'All') {
      return patientsData;
    }
    return patientsData.filter(patient => patient.status === statusFilter);
  }, [statusFilter]);
  const columns: TableColumn<PatientData>[] = [
    { key: 'name', label: 'Name', width: 'w-[28%]' },
    { key: 'age', label: 'Age', width: 'w-[12%]' },
    { key: 'gender', label: 'Gender', width: 'w-[15%]' },
    { key: 'paymentType', label: 'Payment Type', width: 'w-[18%]' },
    {
      key: 'status',
      label: 'Status',
      width: 'w-[17%]',
      render: (value: string) =>
        value === 'Pending' ? (
          <div className="inline-flex items-center gap-2 bg-[#FFFAEC] px-3 py-1.5 rounded-lg">
            <TimerIcon className="w-4 h-4 text-[#FFC107]" strokeWidth={2.5} />
            <span className="font-mulish font-semibold text-[12px] text-[#FFC107]">
              Pending
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 bg-[#E6FFE1] px-3 py-1.5 rounded-lg">
            <CheckCircle2Icon className="w-4 h-4 text-[#2CA913]" strokeWidth={2.5} />
            <span className="font-mulish font-semibold text-[12px] text-[#2CA913]">
              Seen
            </span>
          </div>
        )
    }
  ];

  const handleAction = (patient: PatientData) => (
    <button
      onClick={() => navigate(`/patient/${patient.id}`)}
      className="p-2 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center text-[#7A7A7A] group-hover:text-[#418BF5]">
      <EyeIcon className="w-5 h-5 text-[#7A7A7A]" strokeWidth={2} />
    </button>
  );

  return (
    <div className="flex-1 bg-white rounded-[28px] border border-[#FAFAFA] p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col min-w-[600px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <UsersIcon
            className="w-[22px] h-[22px] text-[#6AA7FF]"
            strokeWidth={2.5} />

          <h2 className="font-satoshi font-medium text-[20px] text-[#080E0D]">
            Scheduled Patients
          </h2>
        </div>
        <button    onClick={() => {navigate('/patientTable')}} className="w-10 h-10 rounded-xl border border-[#EDEDED] shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
          <ArrowUpRightIcon
            className="w-5 h-5 text-[#418BF5]"
            strokeWidth={2.5} 
         
            />

        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="flex-1 max-w-[320px] relative">
          <input
            type="text"
            placeholder="Search by Patient Name"
            className="w-full rounded-xl border border-[#EDEDED] px-4 py-3 pr-10 font-mulish text-[14px] text-[#080E0D] placeholder-[#BCBCBC] focus:outline-none focus:border-[#418BF5] focus:ring-1 focus:ring-[#418BF5] transition-all" />

          <SearchIcon
            className="w-5 h-5 text-[#7A7A7A] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
            strokeWidth={2} />

        </div>
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="rounded-xl border border-[#EDEDED] px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
          >
            <span className="font-mulish text-[14px] text-[#9B9B9B]">
              {statusFilter === 'All' ? 'Status' : statusFilter}
            </span>
            <FilterIcon className="w-4 h-4 text-[#353535]" strokeWidth={2} />
          </button>

          {/* Dropdown Menu */}
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#EDEDED] overflow-hidden z-50">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleFilterChange(option)}
                  className={`w-full flex gap-3 px-4 py-3 transition-colors ${statusFilter === option
                    ? ' hover:bg-[#D4F7CC] justify-between flex-row-reverse'
                    : 'hover:bg-gray-50'
                    }`}
                >
                  {statusFilter === option && (
                    <Check className="w-4 h-4 text-[#2CA913]" strokeWidth={3} />
                  )}
                  <span
                    className={`font-mulish text-[14px] ${statusFilter === option
                      ? 'text-[#2CA913] font-semibold'
                      : 'text-[#080E0D]'
                      }`}
                  >
                    {option}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <Table<PatientData>
        columns={columns}
        data={filteredData}
        rowKey="id"
        actions={handleAction}
      />
    </div>
  );
}