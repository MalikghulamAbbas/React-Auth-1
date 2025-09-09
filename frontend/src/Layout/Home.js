import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../Validation/utils';
import { ToastContainer } from 'react-toastify';
import '../index.css';

function Home ()  {
    const [loggedInUser, setLoggedInUser] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }
    //     const fetchProducts = async () => {
    //     try {
    //         const url = "https://deploy-mern-app-1-api.vercel.app/products";
    //         const headers = {
    //             headers: {
    //                 'Authorization': localStorage.getItem('token')
    //             }
    //         }
    //         const response = await fetch(url, headers);
    //         const result = await response.json();
    //         console.log(result);
    //         setProducts(result);
    //     } catch (err) {
    //         handleError(err);
    //     }
    // }
    useEffect(() => {
    }, [])

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1>Welcome to Our Platform</h1>
          <p>{loggedInUser} have successfully logged in to your account.</p>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>
      
      <main className="home-main">
        <section className="features-section">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Fast Performance</h3>
              <p>Our platform is optimized for speed and efficiency.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure</h3>
              <p>Your data is protected with industry-standard security.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Professional</h3>
              <p>Tools designed for professionals who mean business.</p>
            </div>
          </div>
          <ToastContainer />
        </section>
      </main>
      
      <footer className="home-footer">
        <p>&copy; 2023 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;