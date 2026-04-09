import { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { Table, TableColumn } from '../ui/Table';
import { useGetAllPatientsQuery } from '../../store/slices/patientApiSlice';

interface PatientDisplayData {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  status: 'Scheduled' | 'Recent';
}

export function ScheduledPatients() {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch patients data
  const { data: patientsResponse, isLoading, error } = useGetAllPatientsQuery({});

  // Get status filter from URL
  const params = new URLSearchParams(window.location.search);
  const statusFilter = params.get('status') || 'All';

  // Filter options
  const filterOptions = ['All', 'Scheduled', 'Recent'];

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

  // Transform API data to display format
  const transformedData = useMemo(() => {
    if (!patientsResponse?.patients) return [];
    
    return patientsResponse.patients.map(patient => {
      // Determine if patient is "scheduled" (recent) or not
      const createdDate = new Date(patient.created_at);
      const daysSinceCreated = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
      
      return {
        id: patient.id,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.contact?.phone || 'N/A',
        status: daysSinceCreated <= 7 ? 'Scheduled' : 'Recent'
      } as PatientDisplayData;
    });
  }, [patientsResponse]);

  // Filter table data based on selected status and search
  const filteredData = useMemo(() => {
    let data = transformedData;
    
    // Apply status filter
    if (statusFilter !== 'All') {
      data = data.filter(patient => patient.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      data = data.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return data.slice(0, 10); // Limit to 10 for dashboard
  }, [transformedData, statusFilter, searchTerm]);
  const columns: TableColumn<PatientDisplayData>[] = [
    { key: 'name', label: 'Name', width: 'w-[28%]' },
    { key: 'age', label: 'Age', width: 'w-[12%]' },
    { key: 'gender', label: 'Gender', width: 'w-[15%]' },
    { key: 'phone', label: 'Phone', width: 'w-[25%]' },
    {
      key: 'status',
      label: 'Status',
      width: 'w-[20%]',
      render: (value: string) =>
        value === 'Scheduled' ? (
          <div className="inline-flex items-center gap-2 bg-[#FFFAEC] px-3 py-1.5 rounded-lg">
            <TimerIcon className="w-4 h-4 text-[#FFC107]" strokeWidth={2.5} />
            <span className="font-mulish font-semibold text-[12px] text-[#FFC107]">
              Scheduled
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 bg-[#E6FFE1] px-3 py-1.5 rounded-lg">
            <CheckCircle2Icon className="w-4 h-4 text-[#2CA913]" strokeWidth={2.5} />
            <span className="font-mulish font-semibold text-[12px] text-[#2CA913]">
              Recent
            </span>
          </div>
        )
    }
  ];

  const handleAction = (patient: PatientDisplayData) => (
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
        <button onClick={() => { navigate('/patientTable') }} className="w-10 h-10 rounded-xl border border-[#EDEDED] shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="text-[#7A7A7A] font-mulish text-[14px]">
            Loading patients...
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="text-red-500 font-mulish text-[14px]">
            Error loading patients
          </div>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="text-[#7A7A7A] font-mulish text-[14px]">
            No patients found
          </div>
        </div>
      ) : (
        <Table<PatientDisplayData>
          columns={columns}
          data={filteredData}
          rowKey="id"
          actions={handleAction}
        />
      )}
    </div>
  );
}