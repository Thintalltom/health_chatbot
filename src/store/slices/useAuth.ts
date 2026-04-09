import { useCallback } from 'react';
import { useAppDispatch } from '../hooks';
import { useRefreshTokenMutation, useLogoutMutation } from './apiSlice';
import { setCredentials, logout } from './authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const [refreshToken] = useRefreshTokenMutation();
  const [logoutApi] = useLogoutMutation();
  
  const refreshUserToken = useCallback(async () => {
    try {
      const result = await refreshToken().unwrap();
      
      if (result.access_token) {
        // Store the new token
        localStorage.setItem('authToken', result.access_token);
        
        // You might want to also fetch updated user data here
        // For now, we'll just update the token in the state
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        
        dispatch(setCredentials({
          user: currentUser,
          token: result.access_token,
        }));
        
        return result.access_token;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      dispatch(logout());
      throw error;
    }
  }, [refreshToken, dispatch]);

  const logoutUser = useCallback(async () => {
    try {
      // Call the logout API endpoint
      await logoutApi().unwrap();
      console.log('Logout API call successful');
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Even if API call fails, we still want to clear local state
    } finally {
      // Always clear local state regardless of API call result
      dispatch(logout());
    }
  }, [logoutApi, dispatch]);

  return {
    refreshUserToken,
    logoutUser,
  };
};