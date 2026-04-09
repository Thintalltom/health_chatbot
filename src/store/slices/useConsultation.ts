import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStartConsultationMutation } from './dashboardApiSlice';

export interface StartConsultationParams {
  patient_id: string;
  vitals?: Record<string, any>;
}

export const useConsultation = () => {
  const navigate = useNavigate();
  const [startConsultationApi, { isLoading }] = useStartConsultationMutation();

  const startConsultation = useCallback(async (params: StartConsultationParams) => {
    try {
      const consultationData = {
        patient_id: params.patient_id,
        vitals: params.vitals || {}, // Default to empty object if no vitals provided
      };

      const result = await startConsultationApi(consultationData).unwrap();
      
      console.log('Consultation started successfully:', result);
      
      // Navigate to the consultation session page
      navigate(`/consultation/${params.patient_id}`, {
        state: { 
          consultationId: result.id,
          patientId: params.patient_id 
        }
      });
      
      return result;
    } catch (error) {
      console.error('Failed to start consultation:', error);
      throw error;
    }
  }, [startConsultationApi, navigate]);

  return {
    startConsultation,
    isStartingConsultation: isLoading,
  };
};