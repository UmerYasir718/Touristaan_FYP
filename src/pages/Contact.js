import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import ContactForm from "../components/contact/ContactForm";
import { getSiteSettings } from "../utils/api";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Contact = () => {
  const [settings, setSettings] = useState({
    businessName: 'Touristaan',
    address: '123 Tourism Avenue, Islamabad, Pakistan',
    phone: '+92 300 1234567',
    email: 'info@touristaan.com',
    businessHours: [
      { day: 'Monday', open: '09:00', close: '17:00', isClosed: false },
      { day: 'Tuesday', open: '09:00', close: '17:00', isClosed: false },
      { day: 'Wednesday', open: '09:00', close: '17:00', isClosed: false },
      { day: 'Thursday', open: '09:00', close: '17:00', isClosed: false },
      { day: 'Friday', open: '09:00', close: '17:00', isClosed: false },
      { day: 'Saturday', open: '10:00', close: '15:00', isClosed: false },
      { day: 'Sunday', open: '00:00', close: '00:00', isClosed: true }
    ],
    location: {
      coordinates: [73.0479, 33.6844], // [longitude, latitude]
      address: 'Islamabad, Pakistan'
    },
    socialMedia: {
      facebook: 'https://facebook.com/touristaan',
      twitter: 'https://twitter.com/touristaan',
      instagram: 'https://instagram.com/touristaan',
      linkedin: '',
      youtube: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await getSiteSettings();
        
        if (response?.data) {
          setSettings(prevSettings => ({
            ...prevSettings,
            ...response.data
          }));
        }
      } catch (err) {
        // console.error('Error fetching site settings:', err);
        setError('Could not load business information. Using default values.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []); // Empty dependency array since we're using functional updates

  // Format business hours for display
  const formatBusinessHours = () => {
    if (!settings.businessHours || settings.businessHours.length === 0) {
      return <p className="mb-0">Information not available</p>;
    }

    return settings.businessHours.map((hour) => (
      <p key={hour.day} className="mb-1">
        <span className="fw-bold">{hour.day}:</span>{' '}
        {hour.isClosed ? (
          <span className="text-danger">Closed</span>
        ) : (
          <span>{hour.open} - {hour.close}</span>
        )}
      </p>
    ));
  };

  // Get map position from coordinates
  const getMapPosition = () => {
    // Leaflet uses [latitude, longitude] format while our API uses [longitude, latitude]
    if (settings.location && settings.location.coordinates && settings.location.coordinates.length === 2) {
      return [settings.location.coordinates[1], settings.location.coordinates[0]];
    }
    return [33.6844, 73.0479]; // Default to Islamabad
  };

  return (
    <div className="py-5">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 className="display-4 fw-bold mb-3">Contact Us</h1>
              <p className="lead">
                We'd love to hear from you! Reach out with any questions,
                feedback, or inquiries.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading contact information...</p>
          </div>
        ) : (
          <Row>
            <Col lg={5} className="mb-4 mb-lg-0">
              <h2 className="fw-bold mb-4">Get In Touch</h2>
              <p className="fs-5 mb-4">
                Have questions about our tours or need help planning your trip?
                Our team is here to assist you with any inquiries.
              </p>

              {error && (
                <Alert variant="warning" className="mb-4">
                  {error}
                </Alert>
              )}

              <Card className="border-0 shadow-lg mb-4">
                <Card.Body>
                  <h5 className="fw-bold">
                    <i className="fas fa-map-marker-alt text-primary me-2"></i>{" "}
                    Visit Us
                  </h5>
                  <p className="mb-0">{settings.address}</p>
                </Card.Body>
              </Card>

              <Card className="border-0 shadow-lg mb-4">
                <Card.Body>
                  <h5 className="fw-bold">
                    <i className="fas fa-phone text-primary me-2"></i> Call Us
                  </h5>
                  <p className="mb-0">{settings.phone}</p>
                  <p className="mb-0">{settings.email}</p>
                </Card.Body>
              </Card>

              <Card className="border-0 shadow-lg mb-4">
                <Card.Body>
                  <h5 className="fw-bold">
                    <i className="fas fa-clock text-primary me-2"></i> Business Hours
                  </h5>
                  {formatBusinessHours()}
                </Card.Body>
              </Card>

              <Card className="border-0 shadow-lg mb-4">
                <Card.Body>
                  <h5 className="fw-bold">
                    <i className="fas fa-share-alt text-primary me-2"></i> Connect With Us
                  </h5>
                  <div className="social-links mt-3">
                    {settings.socialMedia.facebook && (
                      <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="me-3 fs-4">
                        <i className="fab fa-facebook text-primary"></i>
                      </a>
                    )}
                    {settings.socialMedia.twitter && (
                      <a href={settings.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="me-3 fs-4">
                        <i className="fab fa-twitter text-info"></i>
                      </a>
                    )}
                    {settings.socialMedia.instagram && (
                      <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="me-3 fs-4">
                        <i className="fab fa-instagram text-danger"></i>
                      </a>
                    )}
                    {settings.socialMedia.linkedin && (
                      <a href={settings.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="me-3 fs-4">
                        <i className="fab fa-linkedin text-primary"></i>
                      </a>
                    )}
                    {settings.socialMedia.youtube && (
                      <a href={settings.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="me-3 fs-4">
                        <i className="fab fa-youtube text-danger"></i>
                      </a>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={7}>
              <ContactForm />
            </Col>
          </Row>
        )}

        {/* Map Section */}
        <div className="mt-5 pt-4">
          <h2 className="fw-bold mb-4">Find Us</h2>
          <Card className="border-0 shadow-lg mb-5">
            <Card.Body className="p-0">
              <div style={{ height: '400px', width: '100%', overflow: 'hidden' }}>
                <MapContainer 
                  center={getMapPosition()} 
                  zoom={14} 
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={getMapPosition()}>
                    <Popup>
                      <div>
                        <strong>{settings.businessName}</strong><br />
                        {settings.address}<br />
                        {settings.phone}
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-5 pt-4">
          <h2 className="fw-bold mb-4">Frequently Asked Questions</h2>
          <Row>
            <Col md={6} className="mb-4">
              <Card className="border-0 shadow-lg h-100">
                <Card.Body>
                  <h5 className="fw-bold mb-3">How do I book a tour?</h5>
                  <p>
                    You can book a tour by browsing our packages, selecting the one you're interested in, and following the booking process. You'll need to provide your details and make a payment to confirm your reservation.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-4">
              <Card className="border-0 shadow-lg h-100">
                <Card.Body>
                  <h5 className="fw-bold mb-3">What payment methods do you accept?</h5>
                  <p>
                    We accept credit/debit cards, bank transfers, and mobile payment methods. All payments are secure and encrypted.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-4">
              <Card className="border-0 shadow-lg h-100">
                <Card.Body>
                  <h5 className="fw-bold mb-3">Can I cancel my booking?</h5>
                  <p>
                    Yes, you can cancel your booking subject to our cancellation policy. Cancellations made 7 days or more before the tour date typically receive a full refund.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-4">
              <Card className="border-0 shadow-lg h-100">
                <Card.Body>
                  <h5 className="fw-bold mb-3">Do you offer custom tour packages?</h5>
                  <p>
                    Yes, we offer customized tour packages tailored to your preferences and requirements. Contact us to discuss your needs and we'll create a personalized itinerary for you.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Contact;
