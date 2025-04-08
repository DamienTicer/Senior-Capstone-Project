import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: '', loginTime: '' });

  useEffect(() => {
    const email = localStorage.getItem('email');
    const loginTime = localStorage.getItem('loginTime');

    if (!email || !loginTime) {
      navigate('/login');
    } else {
      setUser({ email, loginTime });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="profile-container" style={{ padding: '20px' }}>
      <h2>👤 Profile</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Login Time:</strong> {user.loginTime}</p>

      <div style={{ marginTop: '30px', padding: '10px', border: '1px dashed #ccc' }}>
        <h3>🚧 Coming Soon</h3>
        <p>More profile features are in the works!</p>
      </div>

      <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px 20px', background: 'red', color: '#fff', border: 'none', borderRadius: '5px' }}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
