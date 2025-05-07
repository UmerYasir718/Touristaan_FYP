import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Tab,
  Nav,
  Image,
  InputGroup,
  Badge,
  Spinner,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { Link, Navigate } from "react-router-dom";
import {
  getCurrentUser,
  updateUserProfile,
  updateUserPhoto,
  changeUserPassword,
  getUserBookings,
} from "../utils/api";

// Booking History Component
const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getUserBookings();
        setBookings(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again.");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-3">
        {error}
      </Alert>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card className="border-0">
        <Card.Body className="p-4">
          <div className="text-center py-4">
            <i className="bi bi-calendar-x fs-1 text-muted mb-3"></i>
            <h4>No Bookings Found</h4>
            <p className="text-muted">
              You haven't made any bookings yet. Explore our packages and start
              your adventure!
            </p>
            <Link to="/packages" className="btn btn-primary">
              Explore Packages
            </Link>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border-0">
      <Card.Body className="p-4">
        <h3 className="mb-4">My Bookings</h3>

        {bookings.map((booking) => (
          <Card key={booking._id} className="mb-3 border-0 shadow-sm">
            <Card.Body>
              <Row>
                <Col md={3}>
                  <img
                    src={
                      booking.packageImage ||
                      "https://via.placeholder.com/300x200?text=Tour+Package"
                    }
                    alt={booking.packageName}
                    className="img-fluid rounded mb-3 mb-md-0"
                    style={{
                      maxHeight: "120px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                </Col>
                <Col md={9}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="mb-0">
                      {booking.packageName || booking.package?.title}
                    </h5>
                    <Badge bg={getBadgeColor(booking.status)}>
                      {booking.status?.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="mb-2 text-muted small">
                    <i className="bi bi-calendar me-2"></i>
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </div>
                  <div className="mb-2 text-muted small">
                    <i className="bi bi-people me-2"></i>
                    {booking.travelers} Travelers
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <strong>
                        Total: PKR {booking.totalAmount?.toLocaleString()}
                      </strong>
                      <Badge
                        bg={getPaymentBadgeColor(booking.paymentStatus)}
                        className="ms-2"
                      >
                        {booking.paymentStatus?.toUpperCase()}
                      </Badge>
                    </div>
                    <Link
                      to={`/bookings/${booking._id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
      </Card.Body>
    </Card>
  );
};

// Helper function to get badge color based on status
const getBadgeColor = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "success";
    case "pending":
      return "warning";
    case "cancelled":
      return "danger";
    case "completed":
      return "info";
    default:
      return "secondary";
  }
};

// Helper function to get payment badge color
const getPaymentBadgeColor = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "success";
    case "pending":
      return "warning";
    case "refunded":
      return "info";
    case "failed":
      return "danger";
    default:
      return "secondary";
  }
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    "https://via.placeholder.com/150?text=User"
  );
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Update preview URL when user data is loaded
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData?.data?.data);
        if (userData?.data?.data?.profileImage) {
          setPreviewUrl(userData?.data?.data?.profileImage);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // If not authenticated, redirect to login
  if (!loading && !user) {
    return <Navigate to="/login" />;
  }

  // Validation schema for profile form
  const profileSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    currentPassword: Yup.string().min(
      6,
      "Password must be at least 6 characters"
    ),
    newPassword: Yup.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("newPassword"), null],
      "Passwords must match"
    ),
  });

  // Handle image change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (values, { setSubmitting, resetForm }) => {
    try {
      // First update profile information (name and email)
      const profileData = {
        name: values.name,
        email: values.email,
      };

      const response = await updateUserProfile(profileData);

      // Update local user state with the new data
      if (response?.data) {
        setUser({
          ...user,
          name: values.name,
          email: values.email,
        });
      }

      // If there's a new profile image, upload it separately
      if (profileImage) {
        try {
          const photoResponse = await updateUserPhoto(profileImage);

          if (photoResponse?.data?.profileImage) {
            // Update the preview URL with the new image URL
            setPreviewUrl(photoResponse.data.profileImage);

            // Update user state with new profile image
            setUser((prev) => ({
              ...prev,
              profileImage: photoResponse.data.profileImage,
            }));
          }
        } catch (photoErr) {
          console.error("Error uploading profile photo:", photoErr);
          setError(
            "Profile updated but failed to upload photo. Please try again."
          );
          setSubmitting(false);
          return;
        }
      }

      setUpdateSuccess(true);
      setSubmitting(false);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to update profile"
      );
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <Container>
          <h2>Loading profile...</h2>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-5">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 className="display-4 fw-bold mb-3">My Profile</h1>
              <p className="lead">
                Manage your account information and view your bookings
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row>
          <Col lg={3} md={4} className="mb-4">
            <Card className="border-0">
              <Card.Body>
                <div className="text-center mb-4">
                  <Image
                    src={previewUrl}
                    roundedCircle
                    className="mb-3"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                  {user && (
                    <>
                      <h5 className="mb-0">{user.name}</h5>
                      <p className="text-muted">{user.email}</p>
                    </>
                  )}
                </div>

                <Nav
                  className="flex-column"
                  variant="pills"
                  activeKey={activeTab}
                  onSelect={setActiveTab}
                >
                  <Nav.Item>
                    <Nav.Link eventKey="profile" className="mb-2">
                      Profile Information
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="security" className="mb-2">
                      Security
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="bookings">My Bookings</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={9} md={8}>
            <Tab.Content>
              <Tab.Pane eventKey="profile" active={activeTab === "profile"}>
                <Card className="border-0">
                  <Card.Body className="p-4">
                    <h3 className="mb-4">Profile Information</h3>

                    {updateSuccess && (
                      <Alert variant="success" className="mb-4">
                        Profile updated successfully!
                      </Alert>
                    )}

                    {error && (
                      <Alert variant="danger" className="mb-4">
                        {error}
                      </Alert>
                    )}

                    <Formik
                      initialValues={{
                        name: user ? user.name : "",
                        email: user ? user.email : "",
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      }}
                      validationSchema={profileSchema}
                      onSubmit={handleProfileUpdate}
                      enableReinitialize={true}
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
                          <Form.Group className="mb-3">
                            <Form.Label>Profile Picture</Form.Label>
                            <div className="d-flex align-items-center mb-3">
                              <Image
                                src={previewUrl}
                                roundedCircle
                                className="me-3"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                }}
                              />
                              <div>
                                <Form.Control
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  className="mb-2"
                                />
                                <small className="text-muted">
                                  Maximum file size: 2MB
                                </small>
                              </div>
                            </div>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={values.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.name && errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.name}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.email && errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.email}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <Button
                              variant="primary"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Updating..." : "Update Profile"}
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="security" active={activeTab === "security"}>
                <Card className="border-0">
                  <Card.Body className="p-4">
                    <h3 className="mb-4">Security</h3>

                    {updateSuccess && (
                      <Alert variant="success" className="mb-4">
                        Password updated successfully!
                      </Alert>
                    )}

                    {error && (
                      <Alert variant="danger" className="mb-4">
                        {error}
                      </Alert>
                    )}

                    <Formik
                      initialValues={{
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      }}
                      validationSchema={Yup.object({
                        currentPassword: Yup.string().required(
                          "Current password is required"
                        ),
                        newPassword: Yup.string()
                          .min(6, "Password must be at least 6 characters")
                          .required("New password is required"),
                        confirmPassword: Yup.string()
                          .oneOf(
                            [Yup.ref("newPassword"), null],
                            "Passwords must match"
                          )
                          .required("Confirm password is required"),
                      })}
                      onSubmit={async (
                        values,
                        { setSubmitting, resetForm }
                      ) => {
                        try {
                          // Use the correct API function and data format
                          const passwordData = {
                            currentPassword: values.currentPassword,
                            newPassword: values.newPassword,
                          };

                          await changeUserPassword(passwordData);

                          setUpdateSuccess(true);
                          setSubmitting(false);
                          resetForm();

                          // Reset success message after 3 seconds
                          setTimeout(() => {
                            setUpdateSuccess(false);
                          }, 3000);
                        } catch (err) {
                          setError(
                            err.response?.data?.message ||
                              err.message ||
                              "Failed to update password"
                          );
                          setSubmitting(false);
                        }
                      }}
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
                          <Form.Group className="mb-3">
                            <Form.Label>Current Password</Form.Label>
                            <InputGroup>
                              <Form.Control
                                type={showCurrentPassword ? "text" : "password"}
                                name="currentPassword"
                                value={values.currentPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  touched.currentPassword &&
                                  errors.currentPassword
                                }
                              />
                              <Button
                                variant="outline-secondary"
                                onClick={() =>
                                  setShowCurrentPassword(!showCurrentPassword)
                                }
                              >
                                <i
                                  className={`bi ${
                                    showCurrentPassword
                                      ? "bi-eye-slash"
                                      : "bi-eye"
                                  }`}
                                ></i>
                              </Button>
                              <Form.Control.Feedback type="invalid">
                                {errors.currentPassword}
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <InputGroup>
                              <Form.Control
                                type={showNewPassword ? "text" : "password"}
                                name="newPassword"
                                value={values.newPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  touched.newPassword && errors.newPassword
                                }
                              />
                              <Button
                                variant="outline-secondary"
                                onClick={() =>
                                  setShowNewPassword(!showNewPassword)
                                }
                              >
                                <i
                                  className={`bi ${
                                    showNewPassword ? "bi-eye-slash" : "bi-eye"
                                  }`}
                                ></i>
                              </Button>
                              <Form.Control.Feedback type="invalid">
                                {errors.newPassword}
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Confirm New Password</Form.Label>
                            <InputGroup>
                              <Form.Control
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  touched.confirmPassword &&
                                  errors.confirmPassword
                                }
                              />
                              <Button
                                variant="outline-secondary"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                <i
                                  className={`bi ${
                                    showConfirmPassword
                                      ? "bi-eye-slash"
                                      : "bi-eye"
                                  }`}
                                ></i>
                              </Button>
                              <Form.Control.Feedback type="invalid">
                                {errors.confirmPassword}
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>

                          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <Button
                              variant="primary"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Updating..." : "Update Password"}
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="bookings" active={activeTab === "bookings"}>
                <BookingHistory />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
