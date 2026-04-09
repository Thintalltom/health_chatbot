import React from 'react';
import { useAuth } from '../store/slices/useAuth';
import { useGetCurrentUserQuery } from '../store/slices/apiSlice';
import { useAppSelector } from '../store/hooks';

export const TokenManager = () => {
  const { refreshUserToken, logoutUser } = useAuth();
  const { user, token } = useAppSelector((state) => state.auth);
  const { data: currentUserData, refetch } = useGetCurrentUserQuery();

  const handleRefreshToken = async () => {
    try {
      const newToken = await refreshUserToken();
      console.log('Token refreshed successfully:', newToken);
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  };

  const handleFetchCurrentUser = () => {
    refetch();
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 m-4">
      <h3 className="font-bold text-lg mb-4">Token Manager (Dev Tool)</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Current User:</p>
          <pre className="text-xs bg-gray-100 p-2 rounded">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div>
          <p className="text-sm text-gray-600">Token (first 50 chars):</p>
          <p className="text-xs bg-gray-100 p-2 rounded font-mono">
            {token ? `${token.substring(0, 50)}...` : 'No token'}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleRefreshToken}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Token
          </button>
          
          <button
            onClick={handleFetchCurrentUser}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Fetch Current User
          </button>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {currentUserData && (
          <div>
            <p className="text-sm text-gray-600">Current User Data from API:</p>
            <pre className="text-xs bg-gray-100 p-2 rounded">
              {JSON.stringify(currentUserData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};