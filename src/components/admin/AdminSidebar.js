import React from 'react';
import { Nav, Button, Image } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authActions';
import avatar from '../../assets/avatar-2.jpg';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const isActive = (path) => {
    return location.pathname === path ? 'active bg-primary text-white' : '';
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Default profile image if user doesn't have one
  const profileImage = user?.profileImage || avatar;

  // Custom styles for sidebar links
  const linkStyle = {
    color: '#495057',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    transition: 'all 0.2s ease',
    marginBottom: '0.5rem'
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* User Profile Section */}
      <div className="p-3 border-bottom">
        <div className="d-flex align-items-center">
          <Image 
            src={profileImage} 
            roundedCircle 
            width={50} 
            height={50} 
            className="me-3 border"
            style={{ objectFit: 'cover' }}
          />
          <div>
            <h6 className="mb-0 fw-bold">{user?.name || 'Admin User'}</h6>
            <small className="text-muted">{user?.email || 'admin@example.com'}</small>
          </div>
        </div>
      </div>
      
      {/* Navigation Links */}
      <Nav className="flex-column p-3">
        <Nav.Link 
          as={Link} 
          to="/admin/dashboard" 
          className={`${isActive('/admin/dashboard')}`}
          style={linkStyle}
          hover={{ backgroundColor: '#e9ecef' }}
        >
          <i className="fas fa-tachometer-alt me-2 text-primary"></i> Dashboard
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/admin/packages" 
          className={`${isActive('/admin/packages')}`}
          style={linkStyle}
        >
          <i className="fas fa-box me-2 text-primary"></i> Packages
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/admin/bookings" 
          className={`${isActive('/admin/bookings')}`}
          style={linkStyle}
        >
          <i className="fas fa-calendar-check me-2 text-primary"></i> Bookings
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/admin/users" 
          className={`${isActive('/admin/users')}`}
          style={linkStyle}
        >
          <i className="fas fa-users me-2 text-primary"></i> Users
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/admin/payments" 
          className={`${isActive('/admin/payments')}`}
          style={linkStyle}
        >
          <i className="fas fa-credit-card me-2 text-primary"></i> Payments
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/admin/transactions" 
          className={`${isActive('/admin/transactions')}`}
          style={linkStyle}
        >
          <i className="fas fa-exchange-alt me-2 text-primary"></i> Transactions
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/admin/reviews" 
          className={`${isActive('/admin/reviews')}`}
          style={linkStyle}
        >
          <i className="fas fa-star me-2 text-primary"></i> Reviews
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/admin/contacts" 
          className={`${isActive('/admin/contacts')}`}
          style={linkStyle}
        >
          <i className="fas fa-envelope me-2 text-primary"></i> Contact Messages
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/admin/settings" 
          className={`${isActive('/admin/settings')}`}
          style={linkStyle}
        >
          <i className="fas fa-cog me-2 text-primary"></i> Settings
        </Nav.Link>
      </Nav>
      
      {/* Logout button at the bottom */}
      <div className="mt-auto p-3 border-top">
        <Button 
          variant="danger" 
          size="sm" 
          onClick={handleLogout}
          className="w-100"
        >
          <i className="fas fa-sign-out-alt me-2"></i> Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
