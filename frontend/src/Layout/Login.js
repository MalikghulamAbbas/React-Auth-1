import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../Validation/utils';
import '../index.css';

function Login () {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('email and password are required')
        }
        try {
            const url = `http://localhost:8080/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => {
                    navigate('/Home')
                }, 1000)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account</p>
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginInfo.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginInfo.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
          </div>
          
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        <ToastContainer />
        
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="auth-link">Sign up</Link></p>
        </div>
        
        <div className="social-auth">
          <div className="divider">
            <span>Or continue with</span>
          </div>
          <div className="social-buttons">
            <button type="button" className="social-btn google">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M16.5 9.20455C16.5 8.56636 16.4455 7.95273 16.3409 7.36364H9V10.845H13.2955C13.1155 11.97 12.4773 12.9232 11.5091 13.5614V15.6191H13.9818C15.6109 14.1264 16.5 11.9455 16.5 9.20455Z" fill="#4285F4"/>
                <path d="M9 17C11.25 17 13.1364 16.2045 14.4818 14.8614L12.0091 12.8036C11.2773 13.3236 10.3318 13.6591 9.25 13.6591C7.13636 13.6591 5.34091 12.2523 4.65909 10.3682H1.11364V12.4977C2.45455 15.2045 5.45455 17 9 17Z" fill="#34A853"/>
                <path d="M4.65909 10.3682C4.43182 9.70455 4.29545 8.99545 4.29545 8.25C4.29545 7.50455 4.43182 6.79545 4.65909 6.13182V4.00227H1.11364C0.340909 5.54318 0 7.34091 0 9.25C0 11.1591 0.340909 12.9568 1.11364 14.4977L4.65909 10.3682Z" fill="#FBBC05"/>
                <path d="M9 2.84091C10.4318 2.84091 11.7045 3.32955 12.7091 4.29091L14.5682 2.43182C13.1364 1.10909 11.25 0.25 9 0.25C5.45455 0.25 2.45455 2.04545 1.11364 4.75227L4.65909 6.88068C5.34091 4.99659 7.13636 3.59091 9 3.59091V2.84091Z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" className="social-btn facebook">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.0125 3.92578 16.3984 7.8125 16.9375V11.5156H5.48828V9H7.8125V7.23438C7.8125 5.18164 8.94336 4.125 10.8438 4.125C11.7566 4.125 12.7109 4.29688 12.7109 4.29688V6.40625H11.6445C10.5977 6.40625 10.1875 7.06641 10.1875 7.75V9H12.5703L12.1719 11.5156H10.1875V16.9375C14.0742 16.3984 17 13.0125 17 9Z" fill="#1877F2"/>
                <path d="M12.1719 11.5156L12.5703 9H10.1875V7.75C10.1875 7.06641 10.5977 6.40625 11.6445 6.40625H12.7109V4.29688C12.7109 4.29688 11.7566 4.125 10.8438 4.125C8.94336 4.125 7.8125 5.18164 7.8125 7.23438V9H5.48828V11.5156H7.8125V16.9375C8.52344 17.0391 9.24219 17.0391 9.95312 16.9375V11.5156H12.1719Z" fill="white"/>
              </svg>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;