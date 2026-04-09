import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';

export interface Patient {
  id: string;
  facility_id: string;
  patient_id_display: string;
  name: string;
  age: number;
  date_of_birth: string;
  gender: string;
  payment_type: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  source: string;
  external_id: string | null;
  created_at: string;
  updated_at: string;
  type: string;
  _rid: string;
  _self: string;
  _etag: string;
  _attachments: string;
  _ts: number;
}

export interface PatientsResponse {
  patients: Patient[];
  next_page_token: string | null;
}

export interface PatientVitals {
  id: string;
  patient_id: string;
  blood_pressure: string;
  heart_rate: number;
  temperature: number;
  respiratory_rate: number;
  oxygen_saturation: number;
  weight: number;
  height: number;
  recorded_at: string;
}

export interface PatientHistory {
  id: string;
  patient_id: string;
  consultation_date: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  doctor_name: string;
  status: string;
}

export const patientApiSlice = createApi({
  reducerPath: 'patientApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Patient', 'PatientVitals', 'PatientHistory'],
  endpoints: (builder) => ({
    getAllPatients: builder.query<PatientsResponse, { page_token?: string }>({
      query: ({ page_token }) => ({
        url: '/patients',
        params: page_token ? { page_token } : undefined,
      }),
      providesTags: ['Patient'],
    }),
    getPatientById: builder.query<Patient, string>({
      query: (patientId) => `/patients/${patientId}`,
      providesTags: (result, error, patientId) => [{ type: 'Patient', id: patientId }],
    }),
    getPatientVitals: builder.query<PatientVitals[], string>({
      query: (patientId) => `/patients/${patientId}/vitals`,
      providesTags: (result, error, patientId) => [{ type: 'PatientVitals', id: patientId }],
    }),
    getPatientHistory: builder.query<PatientHistory[], string>({
      query: (patientId) => `/patients/${patientId}/history`,
      providesTags: (result, error, patientId) => [{ type: 'PatientHistory', id: patientId }],
    }),
  }),
});

export const {
  useGetAllPatientsQuery,
  useGetPatientByIdQuery,
  useGetPatientVitalsQuery,
  useGetPatientHistoryQuery,
} = patientApiSlice;