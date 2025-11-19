import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserLogin.css';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

function UserLogin() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/user/register`, { email, password });
      if (response.data.success) {
        setMessage('Account created successfully! Please login.');
        setIsRegister(false);
        setPassword('');
        setConfirmPassword('');
      } else {
        setMessage(response.data.message || 'Error creating account');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setMessage(error.response?.data?.message || 'Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/user/login`, { email, password });
      if (response.data.success) {
        setOtpSent(true);
        setMessage('OTP sent to your email! Please check your inbox.');
      } else {
        setMessage(response.data.message || 'Error logging in');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage(error.response?.data?.message || 'Error logging in. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    try {
      if (showForgotPassword) {
        // For password reset, verify password reset OTP
        const response = await axios.post(`${API_URL}/user/verify-password-reset-otp`, { email, otp });
        if (response.data.success) {
          setOtpVerified(true);
          setMessage('OTP verified! Please enter your new password.');
        } else {
          setMessage(response.data.message || 'Invalid OTP');
        }
      } else {
        // For login, verify login OTP
        const response = await axios.post(`${API_URL}/user/verify-otp`, { email, otp });
        if (response.data.success) {
          localStorage.setItem('userToken', response.data.token);
          localStorage.setItem('userEmail', response.data.email);
          navigate(`/personal-dashboard?email=${encodeURIComponent(email)}`);
        } else {
          setMessage(response.data.message || 'Invalid OTP');
        }
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage(error.response?.data?.message || 'Error verifying OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/user/forgot-password`, { email });
      if (response.data.success) {
        setOtpSent(true);
        setMessage('Password reset OTP sent to your email! Please check your inbox.');
      } else {
        setMessage(response.data.message || 'Error sending password reset OTP');
      }
    } catch (error) {
      console.error('Error requesting password reset:', error);
      setMessage(error.response?.data?.message || 'Error requesting password reset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (newPassword !== confirmNewPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/user/reset-password`, { 
        email, 
        otp, 
        newPassword 
      });
      if (response.data.success) {
        setMessage('Password reset successfully! Please login with your new password.');
        setTimeout(() => {
          setShowForgotPassword(false);
          setOtpSent(false);
          setOtpVerified(false);
          setOtp('');
          setNewPassword('');
          setConfirmNewPassword('');
          setEmail('');
          setMessage('');
        }, 2000);
      } else {
        setMessage(response.data.message || 'Error resetting password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage(error.response?.data?.message || 'Error resetting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-login-page">
      <div className="user-login-container">
        <div className="login-box">
          <h2>{isRegister ? 'Create Account' : 'Login to Your Dashboard'}</h2>
          <p>{isRegister ? 'Create an account to access your personal dashboard' : 'Enter your email and password to access your personal dashboard'}</p>
          
          {message && (
            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          {showForgotPassword ? (
            // Forgot Password Flow
            !otpSent ? (
              // Step 1: Enter email
              <form onSubmit={handleForgotPassword} className="login-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset OTP'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setEmail('');
                    setMessage('');
                  }}
                  className="btn-secondary"
                >
                  ← Back to Login
                </button>
              </form>
            ) : !otpVerified ? (
              // Step 2: Verify OTP
              <form onSubmit={handleVerifyOTP} className="login-form">
                <div className="otp-sent-message">
                  <p>Password reset OTP has been sent to your email address.</p>
                  <p>Please check your inbox and enter the 6-digit code below.</p>
                </div>
                
                <div className="form-group">
                  <label>Enter OTP Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    required
                    className="otp-input"
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                    setMessage('');
                  }}
                  className="btn-secondary"
                >
                  ← Back
                </button>
              </form>
            ) : (
              // Step 3: Enter new password
              <form onSubmit={handleResetPassword} className="login-form">
                <div className="otp-sent-message">
                  <p>OTP verified! Please enter your new password.</p>
                </div>
                
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 characters)"
                    required
                    minLength={6}
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpVerified(false);
                    setOtp('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                    setMessage('');
                  }}
                  className="btn-secondary"
                >
                  ← Back
                </button>
              </form>
            )
          ) : !otpSent ? (
            <form onSubmit={isRegister ? handleRegister : handleLogin} className="login-form">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>

              {isRegister && (
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                  />
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Login')}
              </button>

              <div className="form-footer">
                {isRegister ? (
                  <p>
                    Already have an account?{' '}
                    <button type="button" onClick={() => { setIsRegister(false); setMessage(''); }} className="link-button">
                      Login here
                    </button>
                  </p>
                ) : (
                  <>
                    <p>
                      Don't have an account?{' '}
                      <button type="button" onClick={() => { setIsRegister(true); setMessage(''); }} className="link-button">
                        Create one here
                      </button>
                    </p>
                    <p style={{ marginTop: '10px' }}>
                      <button 
                        type="button" 
                        onClick={() => { 
                          setShowForgotPassword(true); 
                          setMessage(''); 
                        }} 
                        className="link-button"
                      >
                        Forgot Password?
                      </button>
                    </p>
                  </>
                )}
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="login-form">
              <div className="otp-sent-message">
                <p>OTP has been sent to your email address.</p>
                <p>Please check your inbox and enter the 6-digit code below.</p>
              </div>
              
              <div className="form-group">
                <label>Enter OTP Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  required
                  className="otp-input"
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  setMessage('');
                }}
                className="btn-secondary"
              >
                ← Back to Login
              </button>
            </form>
          )}

          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;

