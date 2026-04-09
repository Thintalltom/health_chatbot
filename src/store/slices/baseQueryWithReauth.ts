import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { setCredentials, logout } from './authSlice';
import type { RootState } from '../index';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://medaux.vercel.app/api/',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('content-type', 'application/json');
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 (Unauthorized), try to refresh the token
  if (result.error && result.error.status === 401) {
    console.log('Token expired, attempting to refresh...');
    
    // Try to refresh the token
    const refreshResult = await baseQuery(
      {
        url: 'auth/refresh',
        method: 'POST',
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const refreshData = refreshResult.data as { access_token: string };
      
      // Get current user data to update the state
      const userResult = await baseQuery(
        {
          url: 'auth/me',
          headers: {
            authorization: `Bearer ${refreshData.access_token}`,
          },
        },
        api,
        extraOptions
      );

      if (userResult.data) {
        // Update the credentials in Redux
        api.dispatch(setCredentials({
          user: userResult.data as any,
          token: refreshData.access_token,
        }));

        // Retry the original query with the new token
        result = await baseQuery(args, api, extraOptions);
      }
    } else {
      // Refresh failed, logout the user
      console.log('Token refresh failed, logging out...');
      api.dispatch(logout());
    }
  }

  return result;
};