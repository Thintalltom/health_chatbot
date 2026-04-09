import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStartConsultationMutation, useGetActiveConsultationQuery } from '../../store/slices/dashboardApiSlice';
import { useGetAllPatientsQuery } from '../../store/slices/patientApiSlice';
import Person from '../../assets/svgs/person.svg'
import sun from '../../assets/svgs/sun.svg'

export function WelcomeBanner() {
  const navigate = useNavigate();
  const [startConsultation, { isLoading }] = useStartConsultationMutation();
  const { data: patientsResponse } = useGetAllPatientsQuery({});
  const { data: activeConsultation, refetch: refetchActiveConsultation } = useGetActiveConsultationQuery();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartConsultation = async () => {
    try {
      setIsStarting(true);
      
      // Get the first available patient (you can modify this logic)
      const patients = patientsResponse?.patients || [];
      if (patients.length === 0) {
        alert('No patients available for consultation');
        return;
      }

      const firstPatient = patients[0];
      
      try {
        // Start consultation with basic vitals data
        const result = await startConsultation({
          patient_id: firstPatient.id,
          vitals: {
            blood_pressure: '120/80',
            heart_rate: 72,
            temperature: 98.6,
            notes: 'Starting consultation from dashboard'
          }
        }).unwrap();

        console.log('=== CONSULTATION CREATION DEBUG ===');
        console.log('Full API Response:', JSON.stringify(result, null, 2));
        console.log('Response ID field:', result.id);
        console.log('Response patient_id field:', result.patient_id);
        console.log('Original patient ID:', firstPatient.id);
        console.log('ID === patient_id?', result.id === result.patient_id);
        console.log('ID === original patient?', result.id === firstPatient.id);
        console.log('=====================================');
        
        // Navigate to consultation page with the consultation ID
        const consultationId = result.id || firstPatient.id;
        console.log('Using consultation ID for navigation:', consultationId);
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
              console.log('Patient ID for comparison:', firstPatient.id);
              console.log('Are they the same?', activeConsultationId === firstPatient.id);
              navigate(`/consultation/${activeConsultationId}`);
            } else {
              console.log('No active consultation ID found, using patient ID as fallback');
              console.log('Fallback patient ID:', firstPatient.id);
              navigate(`/consultation/${firstPatient.id}`);
            }
          } catch (fetchError) {
            console.error('Error fetching active consultation:', fetchError);
            // Fallback to patient ID
            navigate(`/consultation/${firstPatient.id}`);
          }
          
        } else {
          // Handle other errors
          alert('Failed to start consultation. Please try again.');
          throw error;
        }
      }
      
    } catch (error) {
      console.error('Failed to start consultation:', error);
    } finally {
      setIsStarting(false);
    }
  };
  return (
    <div
      className="w-full rounded-[32px] overflow-hidden relative shadow-[0px_1px_1px_rgba(0,0,0,0.04)] px-8 py-10 md:px-10 md:py-12"
      style={{
        background:
        'linear-gradient(180deg, #6AA8FF 0%, #418BF5 45%, #1F5EDB 100%)'
      }}>

      <div className="max-w-[600px] relative z-10 flex flex-col items-start">
        <h1 className="font-satoshi font-medium text-[36px] flex gap-[2px] items-center text-white tracking-tight mb-3">
          Welcome, Dr Joanne! <span> <img src={sun}  alt='weather' /></span>
        </h1>
        <p className="font-satoshi text-[18px] text-[#FAFAFA] opacity-90 leading-relaxed mb-8 max-w-[540px]">
          Lorem ipsum elementum maecenas placerat faucibus bibendum senectus
          lacinia lacinia duis quis
        </p>
        <button 
          onClick={handleStartConsultation}
          disabled={isLoading || isStarting}
          className="bg-white hover:bg-gray-50 transition-colors text-[#418BF5] font-satoshi font-bold text-[16px] px-6 py-3 rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isStarting ? 'Starting...' : 'Start Consultations'}
        </button>
      </div>

      {/* Doctor Image */}
      <div className="absolute right-0 -bottom-0 w-[280px] md:w-[320px] h-auto pointer-events-none hidden sm:block" style={{ top: '-10%' }}>
        <img
          src={Person}
          alt="Doctor"
          className="w-full h-full "
          // style={{
          //   WebkitMaskImage:
          //   'linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)',
          //   maskImage:
          //   'linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)'
          // }} 
          />

      </div>
    </div>);

}