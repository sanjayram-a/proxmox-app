import { useEffect } from 'react';
// Removed plain useDispatch, useSelector
import { useNavigate } from 'react-router-dom';
// Import the typed hooks
import { useAppDispatch, useAppSelector } from '../store/hooks'; // Adjust path if needed
import { RootState, User, ProfileUpdateData } from '../types'; // Added User, ProfileUpdateData if needed
import {
  login as loginAction,
  fetchUser,
  logout as logoutAction,
} from '../store/slices/authSlice';
import api from '../services/api'; // Assuming ProfileUpdateData is defined in types

export const useAuth = () => {
  // Use the typed hooks
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token, isLoading, error } = useAppSelector(
    // Explicit state type is good practice but often inferred with useAppSelector
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Fetch user data if we have a token but no user
    if (token && !user && !isLoading) {
      // Dispatch call should now be type-safe
      dispatch(fetchUser());
    }
    // Removed dispatch from dependency array if fetchUser doesn't change
    // Or keep it if your lint rules require it
  }, [token, user, isLoading, dispatch]);

  const login = async (username: string, password: string) => {
    try {
      // Dispatch call should now be type-safe
      const result = await dispatch(
        loginAction({ username, password })
      ).unwrap();
      // Optional: Check if loginAction actually returns something useful in result
      // For now, just navigating on success
      navigate('/');
    } catch (error) {
      // Let the calling component handle UI feedback based on the thrown error
      console.error('Login failed Hook:', error);
      // Re-throw the error so UI layer can catch it if needed
      throw error;
    }
  };

  const logout = () => {
    // Dispatch call should now be type-safe
    dispatch(logoutAction());
    // Consider clearing other local state if necessary
    navigate('/login');
  };

  // Ensure ProfileUpdateData matches the type expected by api.updateProfile
  const updateProfile = async (data: ProfileUpdateData) => {
    try {
      await api.updateProfile(data);
      // Refresh user data after update
      // Dispatch call should now be type-safe
      dispatch(fetchUser());
    } catch (error) {
      console.error('Profile update failed Hook:', error);
      // Re-throw for UI layer
      throw error;
    }
  };

  return {
    user,
    token,
    isLoading,
    error, // The component using the hook can access the error state
    isAuthenticated: !!token && !!user, // Consider checking for user object too
    login,
    logout,
    updateProfile,
  };
};

// Default export is usually unnecessary if you only export one thing
// export default useAuth;
