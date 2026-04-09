import { useEffect } from 'react';
import { useGetCurrentUserQuery } from '../store/slices/apiSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCredentials, logout } from '../store/slices/authSlice';

export const AuthValidator = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  
  const {
    data: currentUser,
    error,
    isLoading,
  } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated || !token,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (error) {
      // If there's an error fetching user data (like 401), logout
      console.error('Failed to fetch current user:', error);
      if ('status' in error && error.status === 401) {
        dispatch(logout());
      }
    } else if (currentUser && token) {
      // Update user data in Redux if we got fresh data
      dispatch(setCredentials({
        user: currentUser,
        token: token,
      }));
    }
  }, [currentUser, error, token, dispatch]);

  // Show loading state while validating token
  if (isAuthenticated && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#418BF5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-mulish text-[14px] text-[#7A7A7A]">Validating session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};