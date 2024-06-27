import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setError, clearError } from '../redux/authSlice';
import axiosInstance from '../axios/axiosInstance';

const login = async (credentials) => {
  const response = await axiosInstance.post('/api/login', credentials);
  return response.data;
};

const register = async (userData) => {
  const response = await axiosInstance.post('/api/register', userData);
  return response.data;
};

const refreshToken = async (refreshToken) => {
  const response = await axiosInstance.post('/api/refresh-token', { refreshToken });
  return response.data;
};

const sendOtp = async (phoneNumber) => {
    
  const response = await axiosInstance.post('/api/send-otp', { phoneNumber });
  return response.data;
};

const verifyOtp = async (otpData) => {
  const response = await axiosInstance.post('/api/verify-otp', otpData);
  return response.data;
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const error = useSelector((state) => state.auth.error);

  const handleError = (error) => {
    dispatch(setError(error.response?.data || { message: 'An unexpected error occurred' }));
  };

  const { mutate: loginMutate } = useMutation( {
    mutationFn:login,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
    },
    onError: handleError,
  });

  const { mutate: registerMutate } = useMutation( {
    mutationFn:register,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
    },
    onError: handleError,
  });

  const { mutate: refreshTokenMutate } = useMutation( {
    mutationFn:refreshToken,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
    },
    onError: handleError,
  });

  const { mutate: sendOtpMutate } = useMutation({
    mutationFn:sendOtp,
    onError: handleError,
  });

  const { mutate: verifyOtpMutate } = useMutation({
    mutationFn:verifyOtp,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
    },
    onError: handleError,
  });

  return {
    loginMutate,
    registerMutate,
    refreshTokenMutate,
    sendOtpMutate,
    verifyOtpMutate,
    error,
    clearError: () => dispatch(clearError()),
  };
};
