import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Dropdown,
  Badge,
  Image,
} from "react-bootstrap";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../redux/actions/authActions";
import { getCurrentUser } from "../utils/api";
import UserMessagesModal from "./messages/UserMessagesModal";

const navLinks = [
  { path: "/", label: "Home", exact: true },
  { path: "/about", label: "About" },
  { path: "/services", label: "Services" },
  { path: "/packages", label: "Packages" },
  { path: "/leave-review", label: "Leave Review" },
  { path: "/contact", label: "Contact" },
];

const Header = ({ auth: { isAuthenticated, loading }, logout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Fetch user data directly from API
  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated) {
        try {
          const userData = await getCurrentUser();
          if (userData?.data?.data) {
            setUser(userData.data.data);
          }
        } catch (err) {
          // console.error("Error fetching user data:", err);
        } finally {
          setUserLoading(false);
        }
      } else {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [isAuthenticated]);

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const handleOpenMessagesModal = () => {
    setShowMessagesModal(true);
  };

  const handleCloseMessagesModal = () => {
    setShowMessagesModal(false);
  };

  // Function to update unread count (called from modal)
  const updateUnreadCount = (count) => {
    setUnreadMessages(count);
  };

  const authLinks = (
    <div className="d-flex align-items-center">
      {/* Message Icon */}
      <Button
        variant="link"
        className="me-3 p-0 position-relative"
        onClick={handleOpenMessagesModal}
        title="My Messages"
      >
        <div
          className="rounded-circle p-2 d-flex align-items-center justify-content-center"
          style={{
            width: 40,
            height: 40,
            background: 'transparent'
          }}
        >
          <i className="fas fa-envelope fa-lg text-primary"></i>
          {unreadMessages > 0 && (
            <Badge
              bg="danger"
              pill
              className="position-absolute"
              style={{
                top: "-5px",
                right: "-5px",
                fontSize: "0.6rem",
                padding: "0.25rem 0.4rem",
              }}
            >
              {unreadMessages > 9 ? "9+" : unreadMessages}
            </Badge>
          )}
        </div>
      </Button>

      <Dropdown>
        <Dropdown.Toggle
          variant="outline-primary"
          className="rounded-4 px-4 d-flex align-items-center border-0"
          id="dropdown-basic"
          style={{ background: 'transparent' }}
        >
          {!userLoading && user && (
            <>
              <div className="position-relative">
                <Image
                  src={
                    user.profileImage ||
                    "https://via.placeholder.com/150?text=User"
                  }
                  roundedCircle
                  className="me-2 border border-2 border-primary"
                  width="36"
                  height="36"
                  style={{ objectFit: "cover" }}
                />
                <div
                  className="position-absolute"
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: "#4CAF50",
                    borderRadius: "50%",
                    bottom: 0,
                    right: 8,
                    border: "2px solid white",
                  }}
                ></div>
              </div>
              <span className="fw-semibold text-primary">
                {user.name || "User"}
              </span>
            </>
          )}
          {(userLoading || !user) && "User"}
        </Dropdown.Toggle>

        <Dropdown.Menu
          className="shadow-lg border-0 p-0 overflow-hidden"
          style={{ borderRadius: "1rem", marginTop: "0.5rem" }}
          align="end"
        >
          <div className="p-3 bg-primary text-white">
            <div className="d-flex align-items-center">
              <Image
                src={
                  user?.profileImage ||
                  "https://via.placeholder.com/150?text=User"
                }
                roundedCircle
                className="me-2 border border-2 border-white"
                width="40"
                height="40"
                style={{ objectFit: "cover" }}
              />
              <div>
                <div className="fw-bold">{user?.name || "User"}</div>
                <div className="small opacity-75">{user?.email || ""}</div>
              </div>
            </div>
          </div>
          <Dropdown.Item as={NavLink} to="/profile" className="py-2">
            <i className="fas fa-user me-2 text-primary"></i>
            Profile
          </Dropdown.Item>
          <Dropdown.Item as={NavLink} to="/bookings" className="py-2">
            <i className="fas fa-calendar-check me-2 text-primary"></i>
            My Bookings
          </Dropdown.Item>
          <Dropdown.Item onClick={handleOpenMessagesModal} className="py-2">
            <i className="fas fa-envelope me-2 text-primary"></i>
            My Messages
            {unreadMessages > 0 && (
              <Badge bg="danger" pill className="ms-2">
                {unreadMessages}
              </Badge>
            )}
          </Dropdown.Item>
          {user && user.role === "admin" && (
            <Dropdown.Item as={NavLink} to="/admin/dashboard" className="py-2">
              <i className="fas fa-tachometer-alt me-2 text-primary"></i>
              Admin Dashboard
            </Dropdown.Item>
          )}
          <Dropdown.Divider className="my-0" />
          <Dropdown.Item onClick={logout} className="py-2 text-danger">
            <i className="fas fa-sign-out-alt me-2"></i>
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );

  const guestLinks = (
    <>
      <Button
        variant="outline-primary"
        className="me-2 rounded-pill px-4 shadow-sm"
        onClick={() => navigate("/login")}
      >
        <i className="fas fa-sign-in-alt me-1"></i> Login
      </Button>
      <Button
        variant="primary"
        className="rounded-pill px-4 shadow-sm"
        onClick={() => navigate("/signup")}
      >
        <i className="fas fa-user-plus me-1"></i> Sign Up
      </Button>
    </>
  );

  return (
    <>
      <Navbar
        bg="white"
        expand="lg"
        className="shadow-sm sticky-top"
        style={{
          borderBottom: "2px solid #f6ad55",
          zIndex: 1030,
          padding: "0.8rem 0",
          transition: "all 0.3s ease",
        }}
      >
        <Container fluid className="px-4">
          {/* Logo and Site Name - Left Side */}
          <Navbar.Brand
            as={NavLink}
            to="/"
            className="fw-bold text-primary d-flex align-items-center"
            style={{
              fontSize: "2rem",
              letterSpacing: "1px",
            }}
          >
            <span
              className="d-inline-block rounded-circle me-2"
              style={{
                background: "linear-gradient(135deg, #2c5282 0%, #4299e1 100%)",
                width: 45,
                height: 45,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(44, 82, 130, 0.2)",
              }}
            >
              <i className="fas fa-globe-asia text-white"></i>
            </span>
            Touristaan
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            {/* Navigation Links - Center */}
            <Nav
              className="mx-auto align-items-center justify-content-center"
              style={{ flex: 1 }}
            >
              {navLinks.map((link) => (
                <Nav.Link
                  key={link.path}
                  as={NavLink}
                  to={link.path}
                  className={`mx-1 ${isActive(link.path)}`}
                  style={({ isActive }) => ({
                    fontWeight: isActive ? "bold" : "normal",
                    color: isActive ? "#2c5282" : "",
                    background: isActive ? "rgba(246,173,85,0.12)" : "none",
                    borderRadius: isActive ? "1rem" : "0",
                    paddingLeft: 16,
                    paddingRight: 16,
                    transition: "all 0.2s",
                    boxShadow: isActive
                      ? "0 2px 8px rgba(44,82,130,0.08)"
                      : "none",
                  })}
                  end={link.exact}
                >
                  {link.label}
                </Nav.Link>
              ))}
            </Nav>

            {/* User Actions - Right Side */}
            <Nav className="ms-auto d-flex align-items-center">
              {!loading && <>{isAuthenticated ? authLinks : guestLinks}</>}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* User Messages Modal */}
      {isAuthenticated && (
        <UserMessagesModal
          show={showMessagesModal}
          onHide={handleCloseMessagesModal}
          updateUnreadCount={updateUnreadCount}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Header);
