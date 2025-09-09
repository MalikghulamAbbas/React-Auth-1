import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../Validation/utils';
import '../index.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [resetToken, setResetToken] = useState('');
    const [showResetForm, setShowResetForm] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        
        if (!email) {
            return handleError('Email is required');
        }

        try {
            const url = `http://localhost:8080/auth/forgotpassword`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const result = await response.json();
            const { success, message, resetToken } = result;
            
            if (success) {
                handleSuccess(message);
                setIsEmailSent(true);
                if (resetToken) {
                    setResetToken(resetToken);
                    setShowResetForm(true);
                }
            } else {
                handleError(message || 'Failed to send reset email');
            }
        } catch (err) {
            handleError('An error occurred. Please try again.');
        }
    }

    const handleVerifyToken = async () => {
        if (!resetToken) {
            return handleError('Reset token is required');
        }

        try {
            const url = `http://localhost:8080/auth/verifytoken`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: resetToken })
            });
            
            const result = await response.json();
            const { success, message } = result;
            
            if (success) {
                handleSuccess(message);
                setShowResetForm(true);
            } else {
                handleError(message || 'Invalid token');
            }
        } catch (err) {
            handleError('An error occurred. Please try again.');
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (!resetToken) {
            return handleError('Reset token is required');
        }
        
        if (!newPassword || !confirmPassword) {
            return handleError('Please fill in all fields');
        }
        
        if (newPassword !== confirmPassword) {
            return handleError('Passwords do not match');
        }
        
        if (newPassword.length < 7) {
            return handleError('Password must be at least 7 characters long');
        }

        try {
            const url = `http://localhost:8080/auth/resetpassword`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    token: resetToken, 
                    password: newPassword 
                })
            });
            
            const result = await response.json();
            const { success, message } = result;
            
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                handleError(message || 'Failed to reset password');
            }
        } catch (err) {
            handleError('An error occurred. Please try again.');
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Reset Your Password</h2>
                
                {!isEmailSent ? (
                    <>
                        <p className="auth-subtitle">Enter your email to receive a reset link</p>
                        
                        <form onSubmit={handleForgotPassword} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            
                            <button type="submit" className="auth-button">Send Reset Link</button>
                        </form>
                    </>
                ) : !showResetForm ? (
                    <>
                        <p className="auth-subtitle">Check your email for the reset token</p>
                        
                        <div className="form-group">
                            <label htmlFor="token">Reset Token</label>
                            <input
                                type="text"
                                id="token"
                                name="token"
                                value={resetToken}
                                onChange={(e) => setResetToken(e.target.value)}
                                placeholder="Paste your reset token here"
                            />
                        </div>
                        
                        <button 
                            onClick={handleVerifyToken} 
                            className="auth-button"
                            style={{marginBottom: '1rem'}}
                        >
                            Verify Token
                        </button>
                        
                        <p className="auth-note">
                            Note: In development mode, the token is shown in the response. 
                            In production, this would be sent to your email.
                        </p>
                    </>
                ) : (
                    <>
                        <p className="auth-subtitle">Enter your new password</p>
                        
                        <form onSubmit={handleResetPassword} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    minLength="7"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                    minLength="7"
                                />
                            </div>
                            
                            <button type="submit" className="auth-button">Reset Password</button>
                        </form>
                    </>
                )}
                
                <ToastContainer />
                
                <div className="auth-footer">
                    <p>Remember your password? <Link to="/login" className="auth-link">Sign in</Link></p>
                </div>
                
                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register" className="auth-link">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;