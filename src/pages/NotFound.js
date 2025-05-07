import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(120deg,#2c5282 60%,#4299e1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: 'white'
    }}>
      <div>
        <h1 style={{ fontSize: '5rem', fontWeight: 'bold' }}>404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="mb-4">Sorry, the page you are looking for does not exist or has been moved.</p>
        <Button variant="light" size="lg" onClick={() => navigate('/')}>Go to Home</Button>
      </div>
    </div>
  );
};

export default NotFound;
