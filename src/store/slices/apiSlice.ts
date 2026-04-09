import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';

// Define types for the API responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    facility_id: string;
    gender: string;
    status: string;
  };
}

export interface RefreshTokenResponse {
  access_token: string;
}

export interface LogoutResponse {
  message: string;
}

export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  facility_id: string;
  gender: string;
  status: string;
}

export interface ApiError {
  status: number;
  data: {
    success: boolean;
    message: string;
    errors?: string[];
  };
}

// Create the API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User'],
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    
    // Refresh token endpoint
    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: 'auth/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    
    // Logout endpoint
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    
    // Get current user profile (/me endpoint)
    getCurrentUser: builder.query<UserProfileResponse, void>({
      query: () => 'auth/me',
      providesTags: ['User'],
    }),
    
    // Legacy endpoint (keeping for backward compatibility)
    getUserProfile: builder.query<UserProfileResponse, void>({
      query: () => 'user/profile',
      providesTags: ['User'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useGetUserProfileQuery,
} = apiSlice;