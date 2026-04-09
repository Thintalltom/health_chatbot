import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';

// Define types for the dashboard API responses
export interface DashboardStats {
  total_patients: number;
  total_consultations: number;
  completed_consultations: number;
  patients_waiting: number;
  upcoming_appointments: any[]; // You can define a more specific type if needed
}

export interface StartConsultationRequest {
  patient_id: string;
  vitals: Record<string, any>; // Generic object for vitals data
}

export interface StartConsultationResponse {
  id: string; // This should be the consultation ID, not patient ID
  patient_id: string;
  status: string;
  created_at: string;
  vitals: Record<string, any>;
  // Add other fields as needed based on your API response
}

// Create the dashboard API slice
export const dashboardApiSlice = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Dashboard', 'Consultation'],
  endpoints: (builder) => ({
    // Get dashboard statistics
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => 'dashboard',
      providesTags: ['Dashboard'],
    }),
    
    // Start a new consultation
    startConsultation: builder.mutation<StartConsultationResponse, StartConsultationRequest>({
      query: (consultationData) => ({
        url: 'consultations',
        method: 'POST',
        body: consultationData,
      }),
      invalidatesTags: ['Dashboard', 'Consultation'],
    }),
    
    // Get active consultation for current user
    getActiveConsultation: builder.query<StartConsultationResponse, void>({
      query: () => 'consultations/active',
      providesTags: ['Consultation'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetDashboardStatsQuery,
  useStartConsultationMutation,
  useGetActiveConsultationQuery,
} = dashboardApiSlice;