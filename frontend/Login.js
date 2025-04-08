// frontend/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.endsWith('@students.bowiestate.edu')) {
      alert('Only Bowie State student emails allowed, baby 💛');
      return;
    }

    // Save to session (simulate authentication)
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('loginTime', Date.now().toString());

    // Redirect to Profile
    navigate('/profile');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🔐 Student Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Enter Bowie State Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '400px',
    margin: '50px auto',
    fontFamily: 'Arial, sans-serif',
    background: '#fefefe',
    borderRadius: '16px',
    boxShadow: '0 0 20px #ececff',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#444',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '0.8rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    border: '1px solid #aaa',
    fontSize: '1rem',
  },
  button: {
    padding: '0.8rem',
    background: '#4B2E83',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default Login;
