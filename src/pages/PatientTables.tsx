import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    UsersIcon,
    SearchIcon,
    FilterIcon,
    TimerIcon,
    CheckCircle2Icon,
    EyeIcon,
    Check,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';

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
    },
    // Additional patients for "All Patients" tab
    {
        id: 11,
        name: 'Kemi Adebayo',
        age: 32,
        gender: 'Female',
        paymentType: 'HMO',
        status: 'Seen'
    },
    {
        id: 12,
        name: 'Yemi Oladele',
        age: 27,
        gender: 'Male',
        paymentType: 'Self Pay',
        status: 'Pending'
    }
];

const PatientTables = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [tabs, setTabs] = useState<number>(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(0);
    const patientsPerPage = 5;

    // Initialize tab from URL parameter
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam === 'scheduled') {
            setTabs(1);
        } else if (tabParam === 'all') {
            setTabs(2);
        }
    }, [searchParams]);

    // Filter options
    const filterOptions = ['All', 'Pending', 'Seen'];

    // Get data based on active tab
    const getTabData = () => {
        if (tabs === 1) {
            // Scheduled patients - only pending ones
            return patientsData.filter(patient => patient.status === 'Pending');
        } else {
            // All patients
            return patientsData;
        }
    };

    // Filter data based on search and status
    const filteredData = useMemo(() => {
        let data = getTabData();

        // Apply search filter
        if (searchTerm) {
            data = data.filter(patient =>
                patient.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'All') {
            data = data.filter(patient => patient.status === statusFilter);
        }

        return data;
    }, [tabs, searchTerm, statusFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / patientsPerPage);
    const paginatedData = filteredData.slice(
        currentPage * patientsPerPage,
        (currentPage + 1) * patientsPerPage
    );

    // Reset pagination when tab changes
    const handleTabChange = (tabNumber: number) => {
        setTabs(tabNumber);
        setCurrentPage(0);
        setSearchTerm('');
        setStatusFilter('All');

        // Update URL with tab parameter
        const newSearchParams = new URLSearchParams(searchParams);
        if (tabNumber === 1) {
            newSearchParams.set('tab', 'scheduled');
        } else {
            newSearchParams.set('tab', 'all');
        }
        setSearchParams(newSearchParams);
    };

    const handleFilterChange = (filter: string) => {
        setStatusFilter(filter);
        setCurrentPage(0);
        setIsFilterOpen(false);
    };

    // Get current tab name for breadcrumb
    const getCurrentTabName = () => {
        return tabs === 1 ? 'Scheduled Patients' : 'All Patients';
    };

    const renderTable = () => (
        <div className="bg-white rounded-lg border border-[#E5E7EB] mt-6">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-6 gap-4 bg-[#F9FAFB] px-6 py-4 border-b border-[#E5E7EB] font-mulish font-semibold text-[14px] text-[#7A7A7A]">
                <div>Name</div>
                <div>Age</div>
                <div>Gender</div>
                <div>Payment Type</div>
                <div>Status</div>
                <div className="text-center">Action</div>
            </div>

            {/* Table Body */}
            <div>
                {paginatedData.map((patient) => (
                    <div
                        key={patient.id}
                        className="hidden md:grid grid-cols-6 gap-4 px-6 py-4 border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors items-center group"
                    >
                        <div className="font-satoshi text-[14px] text-[#080E0D]">
                            {patient.name}
                        </div>
                        <div className="font-satoshi text-[14px] text-[#080E0D]">
                            {patient.age}
                        </div>
                        <div className="font-satoshi text-[14px] text-[#080E0D]">
                            {patient.gender}
                        </div>
                        <div className="font-satoshi text-[14px] text-[#080E0D]">
                            {patient.paymentType}
                        </div>
                        <div>
                            {patient.status === 'Pending' ? (
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
                            )}
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate(`/patient/${patient.id}`)}
                                className="p-2 hover:bg-[#E5E7EB] rounded-lg transition-colors"
                            >
                                <EyeIcon className="w-5 h-5 text-[#418BF5]" strokeWidth={2} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-[#080E0D]" strokeWidth={2} />
                    <span className="font-mulish font-semibold text-[14px] text-[#080E0D]">
                        Previous
                    </span>
                </button>

                <div className="font-mulish text-[14px] text-[#7A7A7A]">
                    Page {currentPage + 1} of {totalPages}
                </div>

                <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <span className="font-mulish font-semibold text-[14px] text-[#080E0D]">
                        Next
                    </span>
                    <ChevronRight className="w-5 h-5 text-[#080E0D]" strokeWidth={2} />
                </button>
            </div>
        </div>
    );
    return (
        <div className='rounded-[20px] bg-white shadow-sm p-[20px]'>
            <Breadcrumb items={[
                { label: 'Home' },
                { label: getCurrentTabName(), isActive: true },
            ]} />

            {/* Tab Navigation */}
            <div className='p-[4px] text-[14px] rounded-[12px] flex gap-[20px] w-fit bg-[#F2F2F2] mt-6'>
                <button
                    onClick={() => handleTabChange(1)}
                    className={`${tabs === 1 ? 'bg-white px-[24px] py-[8px] text-blue-500 rounded-[12px] shadow-md' : 'text-[#9B9B9B] px-[24px] py-[8px]'} transition-all`}
                >
                    Scheduled Patients
                </button>
                <button
                    onClick={() => handleTabChange(2)}
                    className={`${tabs === 2 ? 'bg-white px-[24px] py-[8px] text-blue-500 rounded-[12px] shadow-md' : 'text-[#9B9B9B] px-[24px] py-[8px]'} transition-all`}
                >
                    All Patients
                </button>
            </div>

            {/* Header Section */}
            <div className='flex items-center justify-between mt-6'>
                <div className='flex items-center flex-row gap-4'>
                    <UsersIcon className="w-6 h-6 text-[#6AA7FF]" strokeWidth={2.5} />
                    <div className='flex flex-row items-center gap-[12px]'>
                        <h5 className="font-satoshi font-medium text-[20px] text-[#080E0D]">
                            {tabs === 1 ? 'Scheduled Patients' : 'All Patients'}
                        </h5>
                        <h6 className="font-mulish text-[14px] text-[#7A7A7A]">
                            {filteredData.length} Patients
                        </h6>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex justify-between items-center mt-6 gap-4">
                <div className="flex-1 max-w-[320px] relative">
                    <input
                        type="text"
                        placeholder="Search by Patient Name"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(0);
                        }}
                        className="w-full rounded-xl border border-[#EDEDED] px-4 py-3 pr-10 font-mulish text-[14px] text-[#080E0D] placeholder-[#BCBCBC] focus:outline-none focus:border-[#418BF5] focus:ring-1 focus:ring-[#418BF5] transition-all"
                    />
                    <SearchIcon
                        className="w-5 h-5 text-[#7A7A7A] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        strokeWidth={2}
                    />
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
                                        ? 'hover:bg-[#D4F7CC] justify-between flex-row-reverse'
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
            {renderTable()}
        </div>
    );
}

export default PatientTables