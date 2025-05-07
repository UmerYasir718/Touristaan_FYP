import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-dark text-white">
      <Container className="text-center">
        <div>
          &copy; {new Date().getFullYear()} Touristaan. All rights reserved. |
          <Link to="/privacy-policy" className="text-white ms-2 me-2">Privacy Policy</Link>|
          <Link to="/terms-conditions" className="text-white ms-2">Terms of Service</Link>
        </div>
        <div className="mt-2">
          <a href="https://facebook.com" className="text-white me-3" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
          <a href="https://twitter.com" className="text-white me-3" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="https://instagram.com" className="text-white" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
        </div>
        <div className="mt-2" style={{ fontSize: '0.9rem' }}>
          Contact us: <a href="mailto:support@touristaan.com" className="text-white">support@touristaan.com</a>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
