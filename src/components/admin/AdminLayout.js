import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Close sidebar on mobile when clicking a link
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    // Set initial state based on screen size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Container fluid className="p-0">
      {/* Top navbar with toggle button on the right */}
      <div className="bg-primary text-white p-2 d-flex justify-content-between align-items-center" style={{ zIndex: 1030, position: 'sticky', top: 0 }}>
        <h4 className="mb-0 ms-3">Admin Dashboard</h4>
        <Button 
          variant="outline-light" 
          size="sm" 
          onClick={toggleSidebar}
          className="me-3 border-0"
        >
          <i className={`fas ${showSidebar ? 'fa-times' : 'fa-bars'}`}></i>
        </Button>
      </div>
      
      <Row className="g-0">
        {/* Sidebar */}
        <Col 
          md={3} 
          lg={2} 
          className={`sidebar ${showSidebar ? 'd-block' : 'd-none'}`} 
          style={{ 
            height: 'calc(100vh - 50px)', 
            overflowY: 'auto',
            position: 'fixed',
            zIndex: 1020,
            maxWidth: '70%',
            background: '#fff',
            borderRight: '1px solid #dee2e6'
          }}
        >
          <AdminSidebar />
        </Col>
        
        {/* Main content */}
        <Col 
          className="main-content"
          md={{ span: showSidebar ? 9 : 12, offset: showSidebar ? 3 : 0 }} 
          lg={{ span: showSidebar ? 10 : 12, offset: showSidebar ? 2 : 0 }}
          style={{ 
            transition: 'all 0.3s'
          }}
        >
          <div className="p-4 bg-light" style={{ 
            minHeight: 'calc(100vh - 50px)',
            background: '#f8f9fa' 
          }}>
            {children}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLayout;
