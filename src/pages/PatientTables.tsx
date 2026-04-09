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
import { 
    useGetAllPatientsQuery, 
    useGetPatientVitalsQuery, 
    useGetPatientHistoryQuery 
} from '../store/slices/patientApiSlice';



const PatientTables = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [tabs, setTabs] = useState<number>(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const patientsPerPage = 5;

    // Fetch patients data
    const { data: patientsResponse, isLoading, error } = useGetAllPatientsQuery({});
    
    // Fetch patient vitals and history when a patient is selected
    const { data: patientVitals, isLoading: vitalsLoading } = useGetPatientVitalsQuery(
        selectedPatientId!, 
        { skip: !selectedPatientId }
    );
    
    const { data: patientHistory, isLoading: historyLoading } = useGetPatientHistoryQuery(
        selectedPatientId!, 
        { skip: !selectedPatientId }
    );

    const handleViewPatient = (patientId: string) => {
        // Set the selected patient to trigger API calls
        setSelectedPatientId(patientId);
        
        // Navigate to patient details page
        navigate(`/patient/${patientId}`);
    };

    // Log the fetched data when available
    useEffect(() => {
        if (selectedPatientId && patientVitals) {
            console.log('Patient Vitals:', patientVitals);
        }
    }, [selectedPatientId, patientVitals]);

    useEffect(() => {
        if (selectedPatientId && patientHistory) {
            console.log('Patient History:', patientHistory);
        }
    }, [selectedPatientId, patientHistory]);

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
        const patients = patientsResponse?.patients || [];
        if (tabs === 1) {
            // Scheduled patients - filter based on some criteria (you can adjust this)
            return patients.filter(patient => 
                // Assuming patients with recent appointments are "scheduled"
                new Date(patient.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            );
        } else {
            // All patients
            return patients;
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

        return data;
    }, [tabs, searchTerm, patientsResponse]);

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

    const renderTable = () => {
        if (isLoading) {
            return (
                <div className="bg-white rounded-lg border border-[#E5E7EB] mt-6 p-8">
                    <div className="text-center text-[#7A7A7A]">
                        Loading patients...
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="bg-white rounded-lg border border-[#E5E7EB] mt-6 p-8">
                    <div className="text-center text-red-500">
                        Error loading patients. Please try again.
                    </div>
                </div>
            );
        }

        if (paginatedData.length === 0) {
            return (
                <div className="bg-white rounded-lg border border-[#E5E7EB] mt-6 p-8">
                    <div className="text-center text-[#7A7A7A]">
                        No patients found.
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-lg border border-[#E5E7EB] mt-6">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-6 gap-4 bg-[#F9FAFB] px-6 py-4 border-b border-[#E5E7EB] font-mulish font-semibold text-[14px] text-[#7A7A7A]">
                    <div>Name</div>
                    <div>Age</div>
                    <div>Gender</div>
                    <div>Payment Type</div>
                    <div>Phone</div>
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
                                {patient.payment_type}
                            </div>
                            <div className="font-satoshi text-[14px] text-[#080E0D]">
                                {patient.contact?.phone}
                            </div>
                            <div className="flex justify-center">
                                <button
                                    onClick={() => handleViewPatient(patient.id)}
                                    className="p-2 hover:bg-[#E5E7EB] rounded-lg transition-colors"
                                    disabled={vitalsLoading || historyLoading}
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
    };
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
            </div>

            {/* Table */}
            {renderTable()}
        </div>
    );
}

export default PatientTables