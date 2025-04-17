// frontend/Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loginTime, setLoginTime] = useState('');

  useEffect(() => {
    // Simulate retrieving session info (you can replace this with real auth later)
    const userEmail = sessionStorage.getItem('email');
    const loginTimestamp = sessionStorage.getItem('loginTime');

    if (!userEmail || !loginTimestamp) {
      navigate('/login'); // Redirect if not logged in
    } else {
      setEmail(userEmail);
      setLoginTime(new Date(parseInt(loginTimestamp)).toLocaleString());
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear(); // Clear session
    window.location.reload(); // Reload page (or navigate to login)
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>👤 User Profile</h2>
      <div style={styles.infoBox}>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Login Time:</strong> {loginTime}</p>
      </div>

      <div style={styles.placeholder}>
        <p>✨ Future Features Coming Here!</p>
        <ul>
          <li>Order History</li>
          <li>Saved Items</li>
          <li>Exclusive Student Discounts</li>
        </ul>
      </div>

      <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    background: '#f3f3ff',
    borderRadius: '16px',
    boxShadow: '0 0 16px #dcdcff',
  },
  heading: {
    color: '#333',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  infoBox: {
    background: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },
  placeholder: {
    background: '#e8f0ff',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '2rem',
  },
  logoutButton: {
    display: 'block',
    margin: '0 auto',
    padding: '0.8rem 2rem',
    background: '#ff4f4f',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Profile;
