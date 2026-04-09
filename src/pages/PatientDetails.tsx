import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStartConsultationMutation, useGetActiveConsultationQuery } from '../store/slices/dashboardApiSlice';
import {
    useGetPatientByIdQuery,
    useGetPatientVitalsQuery,
    useGetPatientHistoryQuery
} from '../store/slices/patientApiSlice';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { StatCard } from '../components/ui/StatCard';
import { ReusableLineChart } from '../components/ui/ReusableLineChart';
import { TimerIcon, CheckCircle2Icon, EyeIcon, ChevronLeft, ChevronRight, Activity, Heart, Thermometer, Wind, SearchIcon } from 'lucide-react';
import SignalChart from '../assets/svgs/LineGroup.svg'
import Person from '../assets/svgs/image 5.svg';
import Graph from '../assets/svgs/graph.svg'
import scale from '../assets/svgs/scale.svg';
import heart from '../assets/svgs/heart-anatomy.svg';
import lungs from '../assets/svgs/lungs.svg';
import temperature from '../assets/svgs/temperature.svg'
import calendar2 from '../assets/svgs/calendar-2.svg';
import Ruler from '../assets/svgs/Ruler.svg'
import heartIcon from '../assets/svgs/heart.svg'
import ID from '../assets/svgs/ID.svg'
import calender3 from '../assets/svgs/calendar-3.svg'
import gender from '../assets/svgs/user.svg'
import chatIcon from '../assets/svgs/messages-2.png'
interface PatientData {
    id: number;
    name: string;
    age: number;
    gender: string;
    paymentType: string;
    status: 'Pending' | 'Seen';
}

interface MedicalCheckup {
    id: number;
    visitDate: string;
    facility: string;
    temperature: string;
    pulseRate: string;
    bloodPressure: string;
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
    }
];

const medicalCheckupData: { [key: number]: MedicalCheckup[] } = {
    1: [
        { id: 1, visitDate: '2024-01-15', facility: 'Central Hospital', temperature: '36.5°C', pulseRate: '72 bpm', bloodPressure: '120/80' },
        { id: 2, visitDate: '2024-01-08', facility: 'Riverside Clinic', temperature: '36.8°C', pulseRate: '68 bpm', bloodPressure: '118/78' },
        { id: 3, visitDate: '2024-01-01', facility: 'Central Hospital', temperature: '36.6°C', pulseRate: '70 bpm', bloodPressure: '122/82' },
        { id: 4, visitDate: '2023-12-25', facility: 'Downtown Medical', temperature: '37.0°C', pulseRate: '75 bpm', bloodPressure: '125/85' },
    ],
    2: [
        { id: 1, visitDate: '2024-01-10', facility: 'Riverside Clinic', temperature: '36.4°C', pulseRate: '65 bpm', bloodPressure: '115/75' },
        { id: 2, visitDate: '2024-01-03', facility: 'Central Hospital', temperature: '36.7°C', pulseRate: '70 bpm', bloodPressure: '120/80' },
        { id: 3, visitDate: '2023-12-27', facility: 'Downtown Medical', temperature: '36.5°C', pulseRate: '68 bpm', bloodPressure: '118/78' },
    ],
    3: [
        { id: 1, visitDate: '2024-01-12', facility: 'Central Hospital', temperature: '36.6°C', pulseRate: '72 bpm', bloodPressure: '121/81' },
        { id: 2, visitDate: '2024-01-05', facility: 'Downtown Medical', temperature: '36.9°C', pulseRate: '73 bpm', bloodPressure: '123/83' },
        { id: 3, visitDate: '2023-12-29', facility: 'Riverside Clinic', temperature: '36.4°C', pulseRate: '70 bpm', bloodPressure: '120/80' },
        { id: 4, visitDate: '2023-12-22', facility: 'Central Hospital', temperature: '36.8°C', pulseRate: '74 bpm', bloodPressure: '124/84' },
        { id: 5, visitDate: '2023-12-15', facility: 'Downtown Medical', temperature: '36.5°C', pulseRate: '72 bpm', bloodPressure: '122/82' },
    ],
    4: [
        { id: 1, visitDate: '2024-01-14', facility: 'Downtown Medical', temperature: '36.7°C', pulseRate: '76 bpm', bloodPressure: '128/88' },
        { id: 2, visitDate: '2024-01-07', facility: 'Central Hospital', temperature: '36.6°C', pulseRate: '74 bpm', bloodPressure: '126/86' },
        { id: 3, visitDate: '2023-12-31', facility: 'Riverside Clinic', temperature: '36.8°C', pulseRate: '75 bpm', bloodPressure: '127/87' },
    ],
    5: [
        { id: 1, visitDate: '2024-01-13', facility: 'Central Hospital', temperature: '36.5°C', pulseRate: '71 bpm', bloodPressure: '119/79' },
        { id: 2, visitDate: '2024-01-06', facility: 'Downtown Medical', temperature: '36.7°C', pulseRate: '70 bpm', bloodPressure: '121/81' },
    ],
    6: [
        { id: 1, visitDate: '2024-01-16', facility: 'Riverside Clinic', temperature: '36.6°C', pulseRate: '73 bpm', bloodPressure: '122/82' },
        { id: 2, visitDate: '2024-01-09', facility: 'Central Hospital', temperature: '36.8°C', pulseRate: '74 bpm', bloodPressure: '123/83' },
        { id: 3, visitDate: '2024-01-02', facility: 'Downtown Medical', temperature: '36.5°C', pulseRate: '72 bpm', bloodPressure: '121/81' },
        { id: 4, visitDate: '2023-12-26', facility: 'Riverside Clinic', temperature: '36.9°C', pulseRate: '75 bpm', bloodPressure: '124/84' },
    ],
    7: [
        { id: 1, visitDate: '2024-01-11', facility: 'Downtown Medical', temperature: '36.7°C', pulseRate: '77 bpm', bloodPressure: '129/89' },
        { id: 2, visitDate: '2024-01-04', facility: 'Central Hospital', temperature: '36.6°C', pulseRate: '76 bpm', bloodPressure: '128/88' },
    ],
    8: [
        { id: 1, visitDate: '2024-01-17', facility: 'Central Hospital', temperature: '36.8°C', pulseRate: '78 bpm', bloodPressure: '130/90' },
        { id: 2, visitDate: '2024-01-10', facility: 'Riverside Clinic', temperature: '36.5°C', pulseRate: '76 bpm', bloodPressure: '128/88' },
        { id: 3, visitDate: '2024-01-03', facility: 'Downtown Medical', temperature: '36.9°C', pulseRate: '77 bpm', bloodPressure: '129/89' },
    ],
    9: [
        { id: 1, visitDate: '2024-01-14', facility: 'Riverside Clinic', temperature: '36.6°C', pulseRate: '74 bpm', bloodPressure: '124/84' },
        { id: 2, visitDate: '2024-01-07', facility: 'Central Hospital', temperature: '36.7°C', pulseRate: '73 bpm', bloodPressure: '123/83' },
    ],
    10: [
        { id: 1, visitDate: '2024-01-18', facility: 'Downtown Medical', temperature: '36.5°C', pulseRate: '69 bpm', bloodPressure: '116/76' },
        { id: 2, visitDate: '2024-01-11', facility: 'Central Hospital', temperature: '36.7°C', pulseRate: '70 bpm', bloodPressure: '118/78' },
        { id: 3, visitDate: '2024-01-04', facility: 'Riverside Clinic', temperature: '36.6°C', pulseRate: '71 bpm', bloodPressure: '119/79' },
        { id: 4, visitDate: '2023-12-28', facility: 'Downtown Medical', temperature: '36.8°C', pulseRate: '72 bpm', bloodPressure: '120/80' },
    ]
};

export function PatientDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [startConsultation, { isLoading: isStartingConsultation }] = useStartConsultationMutation();
    const { data: activeConsultation, refetch: refetchActiveConsultation } = useGetActiveConsultationQuery();
    const [currentPage, setCurrentPage] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [showCalendar, setShowCalendar] = useState(false);
    const checkupsPerPage = 3;

    // Fetch patient data from API
    const { data: patient, isLoading: patientLoading, error: patientError } = useGetPatientByIdQuery(id!, { skip: !id });
    const { data: patientVitals, isLoading: vitalsLoading, error: vitalsError } = useGetPatientVitalsQuery(id!, { skip: !id });
    const { data: patientHistory, isLoading: historyLoading, error: historyError } = useGetPatientHistoryQuery(id!, { skip: !id });

    // Log the fetched data
    useEffect(() => {
        if (patient) {
            console.log('Patient Data:', patient);
        }
        if (patientVitals) {
            console.log('Patient Vitals:', patientVitals);
        }
        if (patientHistory) {
            console.log('Patient History:', patientHistory);
        }
    }, [patient, patientVitals, patientHistory]);

    const heartImages = [heart, temperature, lungs]; // Array of images for slider

    // Get latest vitals for display
    const latestVitals = patientVitals && patientVitals.length > 0 ? patientVitals[0] : null;

    // Slider content data using real vitals or defaults
    const sliderContent = [
        {
            title: 'Blood Pressure',
            icon: <Heart className="w-6 h-6 text-[#E74C3C]" strokeWidth={2} />,
            rate: latestVitals?.blood_pressure || '120/80 mmHg'
        },
        {
            title: 'Temperature',
            icon: <Thermometer className="w-6 h-6 text-[#FF6B35]" strokeWidth={2} />,
            rate: latestVitals?.temperature ? `${latestVitals.temperature}°C` : '36.5°C'
        },
        {
            title: 'Respiratory System',
            icon: <Wind className="w-6 h-6 text-[#4ECDC4]" strokeWidth={2} />,
            rate: latestVitals?.respiratory_rate ? `${latestVitals.respiratory_rate} bpm` : '16 bpm'
        }
    ];

    const handleStartConsultation = async () => {
        if (!patient) return;

        try {
            const vitalsData = {
                blood_pressure: latestVitals?.blood_pressure || sliderContent[0].rate,
                temperature: latestVitals?.temperature || sliderContent[1].rate,
                respiratory_rate: latestVitals?.respiratory_rate || sliderContent[2].rate,
                notes: 'Starting consultation from patient details'
            };

            try {
                const result = await startConsultation({
                    patient_id: patient.id,
                    vitals: vitalsData,
                }).unwrap();

                console.log('=== PATIENT DETAILS CONSULTATION DEBUG ===');
                console.log('Full API Response:', JSON.stringify(result, null, 2));
                console.log('Response ID field:', result.id);
                console.log('Response patient_id field:', result.patient_id);
                console.log('Original patient ID:', patient.id);
                console.log('ID === patient_id?', result.id === result.patient_id);
                console.log('ID === original patient?', result.id === patient.id);
                console.log('==========================================');
                
                // Navigate to consultation page with the consultation ID
                const consultationId = result.id || patient.id;
                navigate(`/consultation/${consultationId}`);
                
            } catch (error: any) {
                console.error('Consultation error:', error);
                
                // Check if user already has an active consultation
                if (error?.data?.detail?.includes('already have an active consultation') || 
                    error?.message?.includes('already have an active consultation')) {
                    
                    console.log('User has active consultation, fetching active consultation details...');
                    
                    try {
                        // Refetch active consultation to get the correct consultation ID
                        const activeConsultationResult = await refetchActiveConsultation();
                        const activeConsultationId = activeConsultationResult.data?.id;
                        
                        if (activeConsultationId) {
                            console.log('Found active consultation ID:', activeConsultationId);
                            navigate(`/consultation/${activeConsultationId}`);
                        } else {
                            console.log('No active consultation ID found, using patient ID as fallback');
                            navigate(`/consultation/${patient.id}`);
                        }
                    } catch (fetchError) {
                        console.error('Error fetching active consultation:', fetchError);
                        // Fallback to patient ID
                        navigate(`/consultation/${patient.id}`);
                    }
                    
                } else {
                    // Handle other errors
                    alert('Failed to start consultation. Please try again.');
                    throw error;
                }
            }

        } catch (error) {
            console.error('Failed to start consultation:', error);
        }
    };

    // Sample heart rate data
    const heartRateData = [
        { name: 'Jan', value: 72 },
        { name: 'Feb', value: 75 },
        { name: 'Mar', value: 68 },
        { name: 'Apr', value: 78 },
        { name: 'May', value: 74 },
        { name: 'Jun', value: 76 },
        { name: 'Jul', value: 70 }
    ];

    if (patientLoading) {
        return (
            <div className="text-center py-20">
                <p className="text-[18px] text-[#080E0D]">Loading patient details...</p>
            </div>
        );
    }

    if (patientError || !patient) {
        return (
            <div className="text-center py-20">
                <p className="text-[18px] text-[#080E0D]">Patient not found</p>
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-[20px] bg-white rounded-[28px] border border-[#FAFAFA] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] p-8'>
            <Breadcrumb items={[
                { label: 'Home' },
                { label: 'Scheduled Patients', path: '/patientTable?tab=scheduled' },
                { label: 'Patient Details', isActive: true }
            ]} />

            {/* Statistics Cards */}


            <div className="bg-[#FAFAFA] p-[20px] border-[1px] border-[#F4F5F6] rounded-[20px] shadow-sm ">
                <div className=" flex justify-between items-center">
                    <div className='flex gap-[10px] items-center'>
                        <div className="w-12 h-12 rounded-full bg-[#E8F0FA] flex items-center justify-center">
                            <span className="font-satoshi font-bold text-[16px] text-[#418BF5]">
                                {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                        </div>
                        <div className='flex flex-col gap-[10px]'>
                            <div className='flex gap-[10px]'>
                                <p className="font-satoshi text-[18px] font-bold text-[#080E0D] mt-2">
                                    {patient.name}
                                </p>
                                <div>
                                    {patient.status === 'Pending' ? (
                                        <div className="inline-flex items-center gap-2 bg-[#FFFAEC] px-4 py-2 rounded-lg">
                                            <TimerIcon className="w-5 h-5 text-[#FFC107]" strokeWidth={2.5} />
                                            <span className="font-mulish font-semibold text-[14px] text-[#FFC107]">
                                                Pending
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-2 bg-[#E6FFE1] px-4 py-2 rounded-lg">
                                            <CheckCircle2Icon className="w-5 h-5 text-[#2CA913]" strokeWidth={2.5} />
                                            <span className="font-mulish font-semibold text-[14px] text-[#2CA913]">
                                                Seen
                                            </span>
                                        </div>
                                    )}
                                </div>

                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <img src={ID} alt="" className="w-5 h-5" />
                                    <div className='flex items-center gap-2'>
                                        <label className="font-mulish font-semibold text-[14px] text-[#7A7A7A]">
                                            ID
                                        </label>
                                        <p className="font-satoshi text-[16px] text-[#080E0D]">
                                            #{String(patient.id).padStart(3, '0')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <img src={calender3} alt="" className="w-5 h-5" />
                                    <div className='flex items-center gap-2'>
                                        <label className="font-mulish font-semibold text-[14px] text-[#7A7A7A]">
                                            Age
                                        </label>
                                        <p className="font-satoshi text-[16px] text-[#080E0D]">
                                            {patient.age} years old
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <img src={gender} alt="" className="w-5 h-5" />
                                    <div className='flex items-center gap-2'>
                                        <label className="font-mulish font-semibold text-[14px] text-[#7A7A7A]">
                                            Gender
                                        </label>
                                        <p className="font-satoshi text-[16px] text-[#080E0D]">
                                            {patient.gender}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleStartConsultation}
                        disabled={isStartingConsultation}
                        className="bg-gradient-to-r from-[#418BF5] via-[#418BF5] to-[#1F5EDB] flex gap-[12px] hover:from-[#3A7BD5] hover:via-[#3A7BD5] hover:to-[#1A52C7] transition-all text-white h-[46px] w-[225px] font-satoshi font-bold text-[16px] px-6 py-3 rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span><img src={chatIcon} /></span>
                        {isStartingConsultation ? 'Starting...' : 'Start Consultations'}
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Weight"
                    value={latestVitals?.weight ? `${latestVitals.weight}kg` : '75kg'}
                    icon={
                        <img src={scale} alt="" className="w-5 h-5" />
                    }
                    iconColor="#ffff"
                    patientIcon={SignalChart} />

                <StatCard
                    title="Height"
                    value={latestVitals?.height ? `${latestVitals.height}cm` : '187cm'}
                    icon={
                        <img src={Ruler} alt="" className="w-5 h-5" />
                    }
                    iconColor="#ffff"
                    patientIcon={Person} />

                <StatCard
                    title="Pulse Rate"
                    value={latestVitals?.heart_rate ? `${latestVitals.heart_rate}bpm` : '72bpm'}
                    icon={
                        <img src={heartIcon} alt="" className="w-5 h-5" />
                    }
                    iconColor="#ffff"
                    patientIcon={Graph} />

                <StatCard
                    title="Last Visit Date"
                    value={latestVitals?.recorded_at ? new Date(latestVitals.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Jan 25, 2026'}
                    icon={
                        <img src={calendar2} alt="" className="w-5 h-5" />
                    }
                    iconColor="#ffff"
                />
            </div>

            {/* Heart Rate Analysis and Blood Pressure Cards */}
            <div className="grid grid-cols-6 gap-6 mt-8">
                {/* Heart Rate Analysis Card - Takes 4 columns */}
                <div className="col-span-4 bg-white rounded-[20px] p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.04)] border border-[#F2F2F2]">
                    <div className="flex items-center gap-3 mb-6">
                        <Activity className="w-6 h-6 text-[#418BF5]" strokeWidth={2} />
                        <h3 className="font-satoshi font-bold text-[20px] text-[#080E0D]">
                            Heart Rate Analysis
                        </h3>
                    </div>
                    <div className="">
                        <ReusableLineChart
                            data={heartRateData}
                            color="#418BF5"
                            height={300}
                        />
                    </div>
                </div>

                {/* Blood Pressure Card - Takes 2 columns with slider */}
                <div className="col-span-2 bg-white rounded-[20px] p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.04)] border border-[#F2F2F2]">
                    <div className="flex items-center gap-3 mb-6">
                        {sliderContent[currentSlide].icon}
                        <h3 className="font-satoshi font-bold text-[18px] text-[#080E0D]">
                            {sliderContent[currentSlide].title}
                        </h3>
                    </div>

                    {/* Slider Container */}
                    <div className="relative h-fit overflow-hidden rounded-lg">
                        <div
                            className="flex transition-transform duration-300 ease-in-out h-full cursor-grab active:cursor-grabbing"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            onTouchStart={(e) => {
                                const startX = e.touches[0].clientX;
                                const handleTouchMove = (e: TouchEvent) => {
                                    const currentX = e.touches[0].clientX;
                                    const diff = startX - currentX;
                                    if (Math.abs(diff) > 50) {
                                        if (diff > 0) {
                                            setCurrentSlide(prev => prev === heartImages.length - 1 ? 0 : prev + 1);
                                        } else {
                                            setCurrentSlide(prev => prev === 0 ? heartImages.length - 1 : prev - 1);
                                        }
                                        document.removeEventListener('touchmove', handleTouchMove);
                                    }
                                };
                                document.addEventListener('touchmove', handleTouchMove);
                                document.addEventListener('touchend', () => {
                                    document.removeEventListener('touchmove', handleTouchMove);
                                }, { once: true });
                            }}
                            onMouseDown={(e) => {
                                const startX = e.clientX;
                                const handleMouseMove = (e: MouseEvent) => {
                                    const currentX = e.clientX;
                                    const diff = startX - currentX;
                                    if (Math.abs(diff) > 50) {
                                        if (diff > 0) {
                                            setCurrentSlide(prev => prev === heartImages.length - 1 ? 0 : prev + 1);
                                        } else {
                                            setCurrentSlide(prev => prev === 0 ? heartImages.length - 1 : prev - 1);
                                        }
                                        document.removeEventListener('mousemove', handleMouseMove);
                                    }
                                };
                                document.addEventListener('mousemove', handleMouseMove);
                                document.addEventListener('mouseup', () => {
                                    document.removeEventListener('mousemove', handleMouseMove);
                                }, { once: true });
                            }}
                        >
                            {heartImages.map((image, index) => (
                                <div key={index} className="w-full h-full flex-shrink-0 flex flex-col items-center justify-center relative">
                                    <img src={image} alt={`Slide ${index + 1}`} className="w-[280px] h-[280px] " />
                                    <div className="absolute bottom-6 right-24 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
                                        <span className="font-satoshi font-bold text-[14px] text-[#080E0D]">
                                            {sliderContent[index].rate}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Dots Indicator */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {heartImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-2 h-2 rounded-full transition-colors ${currentSlide === index ? 'bg-[#418BF5]' : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Medical Checkup History Section */}
            <div className="mt-8 shadow-sm p-[20px] rounded-[20px] border border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-satoshi font-bold text-[20px] text-[#080E0D]">
                        Medical Checkup History
                    </h2>

                    {/* Date Filter */}

                </div>
                <div className='flex justify-between'>

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
                    </div>
                    <div>
                        <div className="relative">
                            <button
                                onClick={() => setShowCalendar(!showCalendar)}
                                className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                            >
                                <span className="font-mulish text-[14px] text-[#7A7A7A]">
                                    {selectedDate || 'Filter by date'}
                                </span>
                                <img src={calender3} alt="" className="w-5 h-5" />
                            </button>

                            {/* Calendar Dropdown */}
                            {showCalendar && (
                                <div className="absolute right-0 top-12 bg-white border border-[#E5E7EB] rounded-lg shadow-lg p-4 z-10 w-64">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value);
                                            setShowCalendar(false);
                                        }}
                                        className="w-full p-2 border border-[#E5E7EB] rounded-lg font-mulish text-[14px] focus:outline-none focus:ring-2 focus:ring-[#418BF5] focus:border-transparent"
                                    />
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => {
                                                setSelectedDate('');
                                                setShowCalendar(false);
                                            }}
                                            className="flex-1 px-3 py-2 text-[12px] font-mulish text-[#7A7A7A] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                                        >
                                            Clear
                                        </button>
                                        <button
                                            onClick={() => setShowCalendar(false)}
                                            className="flex-1 px-3 py-2 text-[12px] font-mulish text-white bg-[#418BF5] rounded-lg hover:bg-[#3A7BD5] transition-colors"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[20px] border border-[#E5E7EB]">
                    {/* Table Header */}
                    <div className="hidden rounded-t-[20px] md:grid grid-cols-6 gap-4 bg-[#F4F5F6] px-6 py-4 border-b border-[#E5E7EB] font-mulish font-semibold text-[14px] text-[#7A7A7A]">
                        <div>Visit Date</div>
                        <div>Facility</div>
                        <div>Temperature</div>
                        <div>Pulse Rate</div>
                        <div>Blood Pressure</div>
                        <div className="text-center">Action</div>
                    </div>

                    {/* Table Body - Real History Data */}
                    <div>
                        {historyLoading ? (
                            <div className="p-8 text-center">
                                <p className="text-[#7A7A7A]">Loading history...</p>
                            </div>
                        ) : historyError ? (
                            <div className="p-8 text-center">
                                <p className="text-red-500">Error loading history</p>
                            </div>
                        ) : !patientHistory?.history || patientHistory.history.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-[#7A7A7A]">No history found</p>
                            </div>
                        ) : (
                            patientHistory.history.slice(currentPage * checkupsPerPage, (currentPage + 1) * checkupsPerPage).map((history) => (
                                <div
                                    key={history.id}
                                    className="hidden md:grid grid-cols-6 gap-4 px-6 py-4 border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors items-center"
                                >
                                    <div className="font-satoshi text-[14px] text-[#080E0D]">
                                        {new Date(history.consultation_date).toLocaleDateString()}
                                    </div>
                                    <div className="font-satoshi text-[14px] text-[#080E0D]">
                                        {history.doctor_name || 'N/A'}
                                    </div>
                                    <div className="font-satoshi text-[14px] text-[#080E0D]">
                                        {history.diagnosis || 'N/A'}
                                    </div>
                                    <div className="font-satoshi text-[14px] text-[#080E0D]">
                                        {history.treatment || 'N/A'}
                                    </div>
                                    <div className="font-satoshi text-[14px] text-[#080E0D]">
                                        {history.status || 'Completed'}
                                    </div>
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => navigate(`/patient-details/${patient.id}`)}
                                            className="p-2 hover:bg-[#E5E7EB] rounded-lg transition-colors"
                                        >
                                            <EyeIcon className="w-5 h-5 text-[#7A7A7A]" strokeWidth={2} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination Controls */}
                </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4 ">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${currentPage === 0
                        ? 'border-[#E5E7EB] hover:bg-[#F9FAFB] opacity-50 cursor-not-allowed'
                        : 'border-[#418BF5] hover:bg-[#F9FAFB]'
                        }`}
                >
                    <ChevronLeft className={`w-5 h-5 strokeWidth-2 ${currentPage === 0 ? 'text-[#080E0D]' : 'text-[#418BF5]'
                        }`} />
                    <span className={`font-mulish font-semibold text-[14px] ${currentPage === 0 ? 'text-[#080E0D]' : 'text-[#418BF5]'
                        }`}>
                        Previous
                    </span>
                </button>

                <div className="font-mulish text-[14px] text-[#7A7A7A]">
                    Page {currentPage + 1} of {Math.ceil((patientHistory?.history?.length || 0) / checkupsPerPage)}
                </div>

                <button
                    onClick={() => {
                        const maxPage = Math.ceil((patientHistory?.history?.length || 0) / checkupsPerPage) - 1;
                        setCurrentPage(prev => Math.min(maxPage, prev + 1));
                    }}
                    disabled={currentPage >= Math.ceil((patientHistory?.history?.length || 0) / checkupsPerPage) - 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${currentPage >= Math.ceil((patientHistory?.history?.length || 0) / checkupsPerPage) - 1
                        ? 'border-[#E5E7EB] hover:bg-[#F9FAFB] opacity-50 cursor-not-allowed'
                        : 'border-[#418BF5] hover:bg-[#F9FAFB]'
                        }`}
                >
                    <span className={`font-mulish font-semibold text-[14px] ${currentPage >= Math.ceil((patientHistory?.history?.length || 0) / checkupsPerPage) - 1
                        ? 'text-[#080E0D]' : 'text-[#418BF5]'
                        }`}>
                        Next
                    </span>
                    <ChevronRight className={`w-5 h-5 strokeWidth-2 ${currentPage >= Math.ceil((patientHistory?.history?.length || 0) / checkupsPerPage) - 1
                        ? 'text-[#080E0D]' : 'text-[#418BF5]'
                        }`} />
                </button>
            </div>
        </div>
    );
}
