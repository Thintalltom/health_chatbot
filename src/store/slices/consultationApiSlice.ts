import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

interface TranscriptEntry {
  speaker: string;
  speaker_label: string;
  text: string;
  timestamp: string;
}

interface AISuggestion {
  type: "follow_up" | "recommendation";
  text: string;
  generated_at: string;
  used: boolean;
}

interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  is_draft: boolean;
  edited_by_doctor: boolean;
  generated_at: string;
}

interface ConsultationData {
  id: string;
  patient_id: string;
  facility_id: string;
  facility_name: string;
  doctor_id: string;
  doctor_name: string;
  status: "in_progress" | "completed";
  started_at: string;
  ended_at?: string;
  vitals: Record<string, any>;
  transcript: TranscriptEntry[];
  ai_suggestions: AISuggestion[];
  soap_note?: SoapNote;
  doctor_notes: string;
  audio_blob_name?: string;
  created_at: string;
  updated_at: string;
}

export const consultationApiSlice = createApi({
  reducerPath: "consultationApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Consultation"],
  endpoints: (builder) => ({
    // End consultation - PATCH /consultations/{consultation_id}/end
    endConsultation: builder.mutation<
      ConsultationData,
      { consultation_id: string; patient_id: string }
    >({
      query: ({ consultation_id, patient_id }) => ({
        url: `/consultations/${consultation_id}/end`,
        method: "PATCH",
        params: { patient_id },
      }),
      invalidatesTags: ["Consultation"],
    }),

    // Update transcript - PUT /consultations/{consultation_id}/transcript
    updateTranscript: builder.mutation<
      ConsultationData,
      {
        consultation_id: string;
        patient_id: string;
        transcript: TranscriptEntry[];
      }
    >({
      query: ({ consultation_id, patient_id, transcript }) => ({
        url: `/consultations/${consultation_id}/transcript`,
        method: "PUT",
        params: { patient_id },
        body: { transcript },
      }),
      invalidatesTags: ["Consultation"],
    }),

    // Update SOAP note - PUT /consultations/{consultation_id}/soap
    updateSoapNote: builder.mutation<
      ConsultationData,
      {
        consultation_id: string;
        patient_id: string;
        soap_note: Partial<SoapNote>;
      }
    >({
      query: ({ consultation_id, patient_id, soap_note }) => ({
        url: `/consultations/${consultation_id}/soap`,
        method: "PUT",
        params: { patient_id },
        body: soap_note,
      }),
      invalidatesTags: ["Consultation"],
    }),

    // Generate SOAP note - POST /consultations/{consultation_id}/generate-soap
    generateSoap: builder.mutation<
      string,
      { consultation_id: string; patient_id: string }
    >({
      query: ({ consultation_id, patient_id }) => ({
        url: `/consultations/${consultation_id}/generate-soap`,
        method: "POST",
        params: { patient_id },
        body: { consultation_id, patient_id },
      }),
      invalidatesTags: ["Consultation"],
    }),

    // Upload audio - POST /consultations/{consultation_id}/audio
    uploadAudio: builder.mutation<
      ConsultationData,
      {
        consultation_id: string;
        patient_id: string;
        audio: File | Blob;
      }
    >({
      query: ({ consultation_id, patient_id, audio }) => {
        const formData = new FormData();
        formData.append("audio", audio, "consultation-audio.webm");

        return {
          url: `/consultations/${consultation_id}/audio`,
          method: "POST",
          params: { patient_id },
          body: formData,
        };
      },
      invalidatesTags: ["Consultation"],
    }),

    // Get consultation details
    getConsultation: builder.query<
      ConsultationData,
      { consultation_id: string; patient_id: string }
    >({
      query: ({ consultation_id, patient_id }) => ({
        url: `/consultations/${consultation_id}`,
        params: { patient_id },
      }),
      providesTags: ["Consultation"],
    }),

    // Get audio URL for playback
    getAudioUrl: builder.query<
      string,
      { consultation_id: string; patient_id: string }
    >({
      query: ({ consultation_id, patient_id }) => ({
        url: `/consultations/${consultation_id}/audio-url`,
        params: { patient_id },
      }),
      transformResponse: (response: { audio_url: string } | string) =>
        typeof response === "string" ? response : response.audio_url,
    }),
  }),
});

export const {
  useEndConsultationMutation,
  useUpdateTranscriptMutation,
  useUpdateSoapNoteMutation,
  useGenerateSoapMutation,
  useUploadAudioMutation,
  useGetConsultationQuery,
  useGetAudioUrlQuery,
  useLazyGetAudioUrlQuery,
} = consultationApiSlice;
