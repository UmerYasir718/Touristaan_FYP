import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { fetchPackageByIdDirectly, createBookingPaymentIntent, confirmPayment } from '../utils/api';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_your_publishable_key');

// Card element styling
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

// Checkout Form Component with Stripe integration
const CheckoutForm = ({ packageDetails, travelers }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission and payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Start loading
    setLoading(true);
    setError(null);
    
    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create booking and payment intent
      const bookingData = {
        packageId: packageDetails.id,
        travelDate: new Date().toISOString().split('T')[0], // Today's date as default
        travelers: travelers,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone
      };

      // Create payment intent on the server
      const paymentResponse = await createBookingPaymentIntent(bookingData);
      
      // Confirm card payment with Stripe
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
        paymentResponse.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              address: {
                line1: formData.address || 'Not provided'
              }
            }
          }
        }
      );

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      // Payment succeeded, confirm on backend
      if (paymentIntent.status === 'succeeded') {
        // Confirm the payment on the backend
        await confirmPayment({
          paymentIntentId: paymentIntent.id,
          bookingId: paymentResponse.bookingId
        });
        
        // Redirect to success page
        navigate(`/payment-success?bookingId=${paymentResponse.bookingId}`);
      } else {
        throw new Error(`Payment status: ${paymentIntent.status}`);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'An error occurred while processing your payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h4 className="mb-4">Personal Information</h4>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
            />
          </Form.Group>
        </Col>
      </Row>

      <h4 className="mt-4 mb-4">Payment Information</h4>
      <div className="mb-4">
        <label htmlFor="card-element" className="mb-2">Credit or Debit Card</label>
        <div className="card-element-container p-3 border rounded">
          <CardElement 
            id="card-element"
            options={cardElementOptions}
          />
        </div>
        <div className="text-muted mt-2" style={{fontSize: '0.8rem'}}>
          <p className="mb-1">For testing, use these card numbers:</p>
          <p className="mb-1">Success: 4242 4242 4242 4242</p>
          <p className="mb-0">Decline: 4000 0000 0000 0002</p>
          <p className="mb-0">Expiry date: Any future date (e.g., 12/29)</p>
          <p className="mb-0">CVC: Any 3 digits (e.g., 123)</p>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="d-flex justify-content-between">
        <Link to="/" className="btn btn-outline-secondary">Cancel</Link>
        <Button 
          variant="primary" 
          type="submit" 
          disabled={!stripe || loading}
          className="px-4"
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" role="status" aria-hidden="true"></Spinner>
              Processing...
            </>
          ) : (
            `Pay ${(packageDetails.price * travelers).toLocaleString()} PKR`
          )}
        </Button>
      </div>
    </Form>
  );
};

// Main checkout component
const CheckoutPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [packageDetails, setPackageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get travelers from URL query params
  const queryParams = new URLSearchParams(location.search);
  const travelers = parseInt(queryParams.get('travelers')) || 1;
  
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchPackageByIdDirectly(id);
        setPackageDetails(data);
      } catch (err) {
        console.error('Error fetching package details:', err);
        setError('Failed to load package details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPackageDetails();
  }, [id]);
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading checkout details...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-center mt-3">
            <Button as={Link} to="/packages" variant="primary">
              Browse Packages
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }
  
  if (!packageDetails) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Package Not Found</Alert.Heading>
          <p>The package you're looking for could not be found.</p>
          <div className="d-flex justify-content-center mt-3">
            <Button as={Link} to="/packages" variant="primary">
              Browse Packages
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <h2 className="mb-4">Checkout</h2>
          
          <Row className="mb-5">
            <Col md={8}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Elements stripe={stripePromise}>
                    <CheckoutForm 
                      packageDetails={packageDetails} 
                      travelers={travelers} 
                    />
                  </Elements>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">Order Summary</h5>
                </Card.Header>
                <Card.Body>
                  <h5>{packageDetails.title}</h5>
                  <p className="text-muted">
                    {travelers} {travelers === 1 ? 'traveler' : 'travelers'}
                  </p>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Package Price:</span>
                    <span>{packageDetails.price.toLocaleString()} PKR</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Travelers:</span>
                    <span>× {travelers}</span>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span>{(packageDetails.price * travelers).toLocaleString()} PKR</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
