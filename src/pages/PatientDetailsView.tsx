import { useMemo, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { StatCard } from '../components/ui/StatCard';
import { Activity, Heart, Thermometer, Wind, } from 'lucide-react';
import SignalChart from '../assets/svgs/LineGroup.svg';
import Person from '../assets/svgs/image 5.svg';
import Graph from '../assets/svgs/graph.svg';
import scale from '../assets/svgs/scale.svg';
import heart from '../assets/svgs/heart-anatomy.svg';
import temperature from '../assets/svgs/temperature.svg';
import calendar2 from '../assets/svgs/calendar-2.svg';
import Ruler from '../assets/svgs/Ruler.svg';
import heartIcon from '../assets/svgs/heart.svg';
import lungs from '../assets/svgs/lungs.svg';
import clipboardText from '../assets/svgs/clipboard-text.svg';
import { ReusableLineChart } from '../components/ui/ReusableLineChart';
import doctor from '../assets/svgs/doctor.svg'
import hospital from '../assets/svgs/hospital.svg'
interface PatientData {
    id: number;
    name: string;
    age: number;
    gender: string;
    paymentType: string;
    status: 'Pending' | 'Seen';
    weight?: string;
    height?: string;
    pulseRate?: string;
    lastVisit?: string;
    temperature?: string;
    bloodPressure?: string;
}

const patientsData: PatientData[] = [
    {
        id: 1,
        name: 'Adaobi Nnaji',
        age: 18,
        gender: 'Female',
        paymentType: 'HMO',
        status: 'Pending',
        weight: '65kg',
        height: '165cm',
        pulseRate: '68bpm',
        lastVisit: 'Jan 15, 2024',
        temperature: '36.5°C',
        bloodPressure: '120/80'
    },
    {
        id: 2,
        name: 'Bola Kazeem',
        age: 22,
        gender: 'Female',
        paymentType: 'HMO',
        status: 'Pending',
        weight: '58kg',
        height: '160cm',
        pulseRate: '70bpm',
        lastVisit: 'Jan 10, 2024',
        temperature: '36.4°C',
        bloodPressure: '115/75'
    },
    {
        id: 3,
        name: 'Emeka Okafor',
        age: 25,
        gender: 'Male',
        paymentType: 'Self-pay',
        status: 'Seen',
        weight: '78kg',
        height: '175cm',
        pulseRate: '72bpm',
        lastVisit: 'Jan 12, 2024',
        temperature: '36.6°C',
        bloodPressure: '121/81'
    },
    {
        id: 4,
        name: 'Chika Anozie',
        age: 30,
        gender: 'Female',
        paymentType: 'HMO',
        status: 'Pending',
        weight: '62kg',
        height: '168cm',
        pulseRate: '76bpm',
        lastVisit: 'Jan 14, 2024',
        temperature: '36.7°C',
        bloodPressure: '128/88'
    },
    {
        id: 5,
        name: 'Nkechi Uche',
        age: 35,
        gender: 'Male',
        paymentType: 'Self Pay',
        status: 'Pending',
        weight: '82kg',
        height: '180cm',
        pulseRate: '71bpm',
        lastVisit: 'Jan 13, 2024',
        temperature: '36.5°C',
        bloodPressure: '119/79'
    },
    {
        id: 6,
        name: 'Ifeanyi Eze',
        age: 40,
        gender: 'Male',
        paymentType: 'HMO',
        status: 'Seen',
        weight: '85kg',
        height: '182cm',
        pulseRate: '73bpm',
        lastVisit: 'Jan 16, 2024',
        temperature: '36.6°C',
        bloodPressure: '122/82'
    },
    {
        id: 7,
        name: 'Ogechi Onwuka',
        age: 45,
        gender: 'Male',
        paymentType: 'Self Pay',
        status: 'Seen',
        weight: '79kg',
        height: '177cm',
        pulseRate: '77bpm',
        lastVisit: 'Jan 11, 2024',
        temperature: '36.7°C',
        bloodPressure: '129/89'
    },
    {
        id: 8,
        name: 'Tunde Balogun',
        age: 50,
        gender: 'Male',
        paymentType: 'Self Pay',
        status: 'Seen',
        weight: '88kg',
        height: '185cm',
        pulseRate: '78bpm',
        lastVisit: 'Jan 17, 2024',
        temperature: '36.8°C',
        bloodPressure: '130/90'
    },
    {
        id: 9,
        name: 'Sofia Adeyemi',
        age: 55,
        gender: 'Female',
        paymentType: 'HMO',
        status: 'Pending',
        weight: '70kg',
        height: '170cm',
        pulseRate: '74bpm',
        lastVisit: 'Jan 14, 2024',
        temperature: '36.6°C',
        bloodPressure: '124/84'
    },
    {
        id: 10,
        name: 'Daniel Obinna',
        age: 28,
        gender: 'Male',
        paymentType: 'Self Pay',
        status: 'Seen',
        weight: '73kg',
        height: '172cm',
        pulseRate: '69bpm',
        lastVisit: 'Jan 18, 2024',
        temperature: '36.5°C',
        bloodPressure: '116/76'
    }
];

export function PatientDetailsView() {
    const { id } = useParams();
    const location = useLocation();

    // Determine the source page from the location state or referrer
    const isFromScheduledPatients = location.state?.from === 'scheduled' ||
        location.pathname.includes('scheduled') ||
        window.document.referrer.includes('scheduled');

    const sourcePage = isFromScheduledPatients ? 'Scheduled Patients' : 'All Patients';
    const sourcePath = isFromScheduledPatients ? '/patientTable?tab=scheduled' : '/patientTable?tab=all';

    const patient = useMemo(() => {
        return patientsData.find(p => p.id === Number(id));
    }, [id]);


    const [currentSlide, setCurrentSlide] = useState(0);
    const heartImages = [heart, temperature, lungs]; // Array of images for slider

    // Slider content data
    const sliderContent = [
        { title: 'Blood Pressure', icon: <Heart className="w-6 h-6 text-[#E74C3C]" strokeWidth={2} />, rate: '120/80 mmHg' },
        { title: 'Temperature', icon: <Thermometer className="w-6 h-6 text-[#FF6B35]" strokeWidth={2} />, rate: '36.5°C' },
        { title: 'Respiratory System', icon: <Wind className="w-6 h-6 text-[#4ECDC4]" strokeWidth={2} />, rate: '16 bpm' }
    ];

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
    if (!patient) {
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
                { label: sourcePage, path: sourcePath },
                { label: 'Patient Details', path: `/patient/${id}` },
                { label: 'Checkup Details', isActive: true }
            ]} />

            {/* Patient Header */}
            <div className="bg-[#FAFAFA] p-[20px] border-[1px] border-[#F4F5F6] rounded-[20px] shadow-sm">
                <div className="flex justify-between items-center">
                    <div className='flex gap-[10px] items-center'>

                        <div className='flex flex-col gap-[10px]'>

                            <div className="flex items-center gap-12">
                                <div className="flex items-center gap-2">
                                    <img src={doctor} alt="" className="w-5 h-5" />
                                    <div className='flex items-center gap-2'>
                                        <label className="font-mulish font-semibold text-[14px] text-[#7A7A7A]">
                                            Attending Doctor
                                        </label>
                                        <p className="font-satoshi text-[16px] text-[#080E0D]">
                                            Dr. Ayomide
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <img src={hospital} alt="" className="w-5 h-5" />
                                    <div className='flex items-center gap-2'>
                                        <label className="font-mulish font-semibold text-[14px] text-[#7A7A7A]">
                                            Facility
                                        </label>
                                        <p className="font-satoshi text-[16px] text-[#080E0D]">
                                            Ikeja
                                        </p>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                    {/* <button className="bg-[#1F5EDB] flex gap-[2px] hover:bg-gray-50 transition-colors text-white h-[46px] w-[225px] font-satoshi font-bold text-[16px] px-6 py-3 rounded-xl shadow-sm">
                        <span>icon</span>
                        Start Consultations
                    </button> */}
                </div>
            </div>

            {/* Patient Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Weight"
                    value={patient.weight || '75kg'}
                    icon={
                        <img src={scale} alt="" className="w-5 h-5" />
                    }
                    iconColor="#ffff"
                    patientIcon={SignalChart} />

                <StatCard
                    title="Height"
                    value={patient.height || '187cm'}
                    icon={
                        <img src={Ruler} alt="" className="w-5 h-5" />
                    }
                    iconColor="#ffff"
                    patientIcon={Person} />

                <StatCard
                    title="Pulse Rate"
                    value={patient.pulseRate || '72bpm'}
                    icon={
                        <img src={heartIcon} alt="" className="w-5 h-5" />
                    }
                    iconColor="#ffff"
                    patientIcon={Graph} />

                <StatCard
                    title="Last Visit Date"
                    value={patient.lastVisit || 'Jan 25, 2026'}
                    icon={
                        <img src={calendar2} alt="" className="w-5 h-5" />
                    }
                    iconColor="#ffff" />
            </div>

            {/* Additional Patient Information */}
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

            {/* Diagnosis Section */}
            <div className="bg-white rounded-[20px] p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.04)] border border-[#F2F2F2] mt-6">
                <div className="flex items-center gap-3 mb-6">
                    <img src={clipboardText} alt="" className="w-6 h-6" />
                    <h3 className="font-satoshi font-bold text-[20px] text-[#080E0D]">
                        Diagnosis
                    </h3>
                </div>

                {/* Header Information */}
                <div className="mb-6 space-y-2">
                    <p className="font-mulish text-[14px] text-[#080E0D]">
                        <span className="font-semibold">Doctor:</span> Dr. A. Adeyemi
                    </p>
                    <p className="font-mulish text-[14px] text-[#080E0D]">
                        <span className="font-semibold">Visit Type:</span> Routine Consultation
                    </p>
                    <p className="font-mulish text-[14px] text-[#080E0D]">
                        <span className="font-semibold">Consultation Time:</span> 10:00:30 am
                    </p>
                </div>

                {/* SOAP Notes */}
                <div className="space-y-6">
                    {/* Subjective */}
                    <div>
                        <h4 className="font-satoshi font-bold text-[16px] text-[#080E0D] mb-3">
                            S — Subjective
                        </h4>
                        <p className="font-mulish text-[14px] text-[#7A7A7A] leading-relaxed">
                            The patient reports experiencing intermittent headaches for the past week, primarily occurring in the evenings. They also report occasional dizziness and increased work-related stress. Sleep duration has decreased to approximately 5–6 hours per night. The patient denies blurred vision, nausea, vomiting, or any recent head trauma.
                        </p>
                    </div>

                    {/* Objective */}
                    <div>
                        <h4 className="font-satoshi font-bold text-[16px] text-[#080E0D] mb-3">
                            O — Objective
                        </h4>
                        <div className="space-y-2 mb-3">
                            <p className="font-mulish text-[14px] text-[#7A7A7A]">
                                <span className="font-semibold text-[#080E0D]">Blood Pressure:</span> 142/90 mmHg (Elevated)
                            </p>
                            <p className="font-mulish text-[14px] text-[#7A7A7A]">
                                <span className="font-semibold text-[#080E0D]">Pulse:</span> 84 bpm
                            </p>
                            <p className="font-mulish text-[14px] text-[#7A7A7A]">
                                <span className="font-semibold text-[#080E0D]">Temperature:</span> 36.9°C
                            </p>
                            <p className="font-mulish text-[14px] text-[#7A7A7A]">
                                <span className="font-semibold text-[#080E0D]">Blood Sugar (Random):</span> 102 mg/dL
                            </p>
                        </div>
                        <p className="font-mulish text-[14px] text-[#7A7A7A] leading-relaxed">
                            The patient appears clinically stable with no signs of acute neurological deficits observed during the consultation.
                        </p>
                    </div>

                    {/* Assessment */}
                    <div>
                        <h4 className="font-satoshi font-bold text-[16px] text-[#080E0D] mb-3">
                            A — Assessment
                        </h4>
                        <p className="font-mulish text-[14px] text-[#7A7A7A] leading-relaxed">
                            Symptoms are consistent with likely stress-induced headaches. Blood pressure reading falls within the Stage 1 hypertension range. No indications of an acute neurological condition are present.
                        </p>
                    </div>

                    {/* Plan */}
                    <div>
                        <h4 className="font-satoshi font-bold text-[16px] text-[#080E0D] mb-3">
                            P — Plan
                        </h4>

                        {/* Investigations Ordered */}
                        <div className="mb-4">
                            <h5 className="font-satoshi font-semibold text-[14px] text-[#080E0D] mb-2">
                                Investigations Ordered
                            </h5>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li className="font-mulish text-[14px] text-[#7A7A7A]">Fasting Blood Sugar</li>
                                <li className="font-mulish text-[14px] text-[#7A7A7A]">Lipid Profile</li>
                                <li className="font-mulish text-[14px] text-[#7A7A7A]">Urinalysis</li>
                            </ul>
                        </div>

                        {/* Treatment & Recommendations */}
                        <div className="mb-4">
                            <h5 className="font-satoshi font-semibold text-[14px] text-[#080E0D] mb-2">
                                Treatment & Recommendations
                            </h5>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li className="font-mulish text-[14px] text-[#7A7A7A]">Prescribed a mild analgesic for headache relief</li>
                                <li className="font-mulish text-[14px] text-[#7A7A7A]">Recommended stress management strategies</li>
                                <li className="font-mulish text-[14px] text-[#7A7A7A]">Advised reduction of dietary salt intake</li>
                                <li className="font-mulish text-[14px] text-[#7A7A7A]">Encouraged at least 30 minutes of moderate exercise daily</li>
                            </ul>
                        </div>

                        {/* Follow-Up */}
                        <div>
                            <h5 className="font-satoshi font-semibold text-[14px] text-[#080E0D] mb-2">
                                Follow-Up
                            </h5>
                            <p className="font-mulish text-[14px] text-[#7A7A7A] leading-relaxed">
                                Patient advised to return for a follow-up visit in two weeks, or earlier if headaches worsen or new symptoms appear.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}