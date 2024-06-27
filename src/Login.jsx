import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { toast } from 'react-toastify';

import { useAuth } from './auth/useAuth';

const Login = () => {
  const { sendOtpMutate, verifyOtpMutate, error, clearError } = useAuth();
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');


  const { control, handleSubmit, formState: { errors: phoneErrors } } = useForm();
  const { control: otpControl, handleSubmit: handleOtpSubmit, formState: { errors: otpErrors } } = useForm();

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'An unexpected error occurred');
    }
  }, [error]);

  const handleSendOtp = (data) => {
    clearError();
    sendOtpMutate(data.phoneNumber, {
      onSuccess: () => {
        setOtpSent(true);
        setPhoneNumber(data.phoneNumber);
        toast.success('OTP sent successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to send OTP');
      },
    });
  };

  const handleVerifyOtp = (data) => {
    clearError();
    const otpCode = `${data.otp1}${data.otp2}${data.otp3}${data.otp4}${data.otp5}`;
    verifyOtpMutate({ phoneNumber, otp: otpCode }, {
      onSuccess: () => {
        toast.success('OTP verified successfully');
    
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to verify OTP');
      },
    });
  };

  return (
    <div>
      <h1>Login</h1>

      {!otpSent && (
        <form onSubmit={handleSubmit(handleSendOtp)}>
          <Controller
            name="phoneNumber"
            control={control}
            defaultValue=""
            rules={{ required: 'Phone number is required' }}
            render={({ field }) => (
              <input
                type="text"
                placeholder="Phone Number"
                {...field}
              />
            )}
          />
          {phoneErrors.phoneNumber && <span>{phoneErrors.phoneNumber.message}</span>}
          <button type="submit">Send OTP</button>
        </form>
      )}

      {otpSent && (
        <form onSubmit={handleOtpSubmit(handleVerifyOtp)}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {Array.from({ length: 5 }, (_, i) => (
              <Controller
                key={i}
                name={`otp${i + 1}`}
                control={otpControl}
                defaultValue=""
                rules={{ required: `Digit ${i + 1} is required` }}
                render={({ field }) => (
                  <input
                    type="text"
                    maxLength="1"
                    {...field}
                  />
                )}
              />
            ))}
          </div>
          {otpErrors.otp1 && <span>{otpErrors.otp1.message}</span>}
          {otpErrors.otp2 && <span>{otpErrors.otp2.message}</span>}
          {otpErrors.otp3 && <span>{otpErrors.otp3.message}</span>}
          {otpErrors.otp4 && <span>{otpErrors.otp4.message}</span>}
          {otpErrors.otp5 && <span>{otpErrors.otp5.message}</span>}
          <button type="submit">Verify OTP</button>
        </form>
      )}
    </div>
  );
};

export default Login;
