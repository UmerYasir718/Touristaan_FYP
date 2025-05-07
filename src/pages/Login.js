import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Tab, Nav, InputGroup } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { login, loginAsAdmin } from "../redux/actions/authActions";
import "../styles/password-toggle.css";

const Login = ({
  login,
  loginAsAdmin,
  isAuthenticated,
  error,
  loading,
  user,
}) => {
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If already authenticated, redirect based on role
    if (isAuthenticated) {
      // Check if user is admin and redirect accordingly
      if (user && user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        // Redirect to the page they were trying to access, or to home
        const from = location.state?.from?.pathname || "/";
        navigate(from);
      }
    }

    // Set error message if login fails
    if (error) {
      setLoginError(error);
    }
  }, [isAuthenticated, error, navigate, location, user]);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  // Initial form values
  const initialValues = {
    email: "",
    password: "",
  };

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    setLoginError(""); // Clear any previous errors

    // Call the appropriate login action based on active tab
    if (activeTab === "admin") {
      loginAsAdmin(values.email, values.password);
    } else {
      login(values.email, values.password);
    }

    // Set submitting to false after a delay to show loading state
    setTimeout(() => {
      setSubmitting(false);
    }, 1000);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="auth-page"
      style={{
        minHeight: "100vh",
        width: "100%",
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1530789253388-582c481c54b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "550px",
          background: "rgba(255, 255, 255, 0.95)",
          padding: "3rem",
          borderRadius: "16px",
          // boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div className="text-center mb-4">
          <div className="mb-3">
            <i className="fas fa-mountain fa-3x text-primary"></i>
            <i className="fas fa-plane fa-2x text-info mx-2"></i>
            <i className="fas fa-map-marker-alt fa-3x text-danger"></i>
          </div>
          <h2 className="auth-title fw-bold" style={{ color: "#2c5282" }}>
            Welcome to Touristaan
          </h2>
          <p className="text-muted">Your gateway to incredible adventures</p>
        </div>

        {loginError && (
          <Alert variant="danger" onClose={() => setLoginError("")} dismissible>
            {loginError}
          </Alert>
        )}

        <Tab.Container defaultActiveKey="user">
          <Nav variant="pills" className="mb-4 nav-justified">
            <Nav.Item>
              <Nav.Link
                eventKey="user"
                onClick={() => setActiveTab("user")}
                className="rounded-pill"
              >
                <i className="fas fa-user me-2"></i>Traveler
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="admin"
                onClick={() => setActiveTab("admin")}
                className="rounded-pill"
              >
                <i className="fas fa-user-shield me-2"></i>Admin
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="user">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4" controlId="formEmail">
                      <Form.Label>Email address</Form.Label>
                      <InputGroup className="input-group-seamless shadow-none">
                        <InputGroup.Text className="bg-white border-end-0 rounded-start rounded-0">
                          <i className="fas fa-envelope text-primary"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.email && errors.email}
                          className="py-2 border-start-0 rounded-0 shadow-none"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formPassword">
                      <Form.Label>Password</Form.Label>
                      <InputGroup className="shadow-sm">
                        <InputGroup.Text className="bg-white border-end-0 rounded-start">
                          <i className="fas fa-lock text-primary"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter your password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.password && !!errors.password}
                          autoComplete="current-password"
                          className="py-2 border-start-0 border-end-0"
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={togglePasswordVisibility}
                          tabIndex={-1}
                          className="password-toggle-btn"
                          style={{ display: "block" }}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <i
                            className={
                              showPassword ? "fas fa-eye-slash" : "fas fa-eye"
                            }
                          ></i>
                        </Button>
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check
                        type="checkbox"
                        label="Remember me"
                        id="rememberMe"
                      />
                      <Link
                        to="/forgot-password"
                        className="text-primary small"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-100 py-2 mb-3 rounded-pill shadow-none"
                      disabled={isSubmitting || loading}
                      style={{
                        background:
                          "linear-gradient(to right, #2c5282, #4299e1)",
                        border: "none",
                      }}
                    >
                      {isSubmitting || loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Logging in...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Login
                        </>
                      )}
                    </Button>

                    <div className="text-center mt-4">
                      <p className="mb-0">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-primary fw-bold">
                          Sign up
                        </Link>
                      </p>
                    </div>
                  </Form>
                )}
              </Formik>
            </Tab.Pane>
            <Tab.Pane eventKey="admin">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4" controlId="formAdminEmail">
                      <Form.Label>Admin Email</Form.Label>
                      <InputGroup className="input-group-seamless shadow-none">
                        <InputGroup.Text className="bg-white border-end-0 rounded-start rounded-0">
                          <i className="fas fa-envelope text-primary"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter admin email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.email && errors.email}
                          className="py-2 border-start-0 rounded-0 shadow-none"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formAdminPassword">
                      <Form.Label>Password</Form.Label>
                      <InputGroup className="shadow-sm">
                        <InputGroup.Text className="bg-white border-end-0 rounded-start">
                          <i className="fas fa-lock text-primary"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter admin password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.password && !!errors.password}
                          autoComplete="current-password"
                          className="py-2 border-start-0 border-end-0"
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={togglePasswordVisibility}
                          tabIndex={-1}
                          className="password-toggle-btn"
                          style={{ display: "block" }}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <i
                            className={
                              showPassword ? "fas fa-eye-slash" : "fas fa-eye"
                            }
                          ></i>
                        </Button>
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check
                        type="checkbox"
                        label="Remember me"
                        id="adminRememberMe"
                      />
                      <Link
                        to="/forgot-password"
                        className="text-primary small"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-100 py-2 mb-3 rounded-pill shadow-none"
                      disabled={isSubmitting || loading}
                      style={{
                        background:
                          "linear-gradient(to right, #2c5282, #4299e1)",
                        border: "none",
                      }}
                    >
                      {isSubmitting || loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Logging in...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Admin Login
                        </>
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.auth.error,
  loading: state.auth.loading,
  user: state.auth.user,
});

export default connect(mapStateToProps, { login, loginAsAdmin })(Login);
