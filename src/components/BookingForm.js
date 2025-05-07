import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert, Row, Col, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { createBookingPaymentIntent, confirmPayment } from "../utils/api";
import "../styles/BookingForm.css";

// Validation schema for booking form
const bookingSchema = Yup.object().shape({
  travelDate: Yup.date()
    .required("Travel date is required")
    .min(
      new Date(new Date().setDate(new Date().getDate() + 1)),
      "Travel date must be at least tomorrow"
    ),
  travelers: Yup.number()
    .required("Number of travelers is required")
    .min(1, "At least one traveler is required")
    .max(20, "Maximum 20 travelers allowed"),
  customerName: Yup.string().required("Name is required"),
  customerEmail: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  customerPhone: Yup.string().required("Phone number is required"),
});

// Main BookingForm component
const BookingForm = ({ packageData }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [paymentResponse, setPaymentResponse] = useState(null);

  // Calculate total amount
  const calculateTotal = (travelers) => {
    return packageData?.price ? packageData.price * travelers : 0;
  };

  // Handle form submission for step 1 (booking details)
  const handleBookingSubmit = async (values, { setSubmitting }) => {
    setError(null);
    setProcessing(true);

    try {
      // Create booking data
      const data = {
        packageId: packageData._id,
        travelDate: values.travelDate,
        travelers: values.travelers,
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
      };

      // Store booking data for step 2
      setBookingData(data);

      // Create payment intent
      const response = await createBookingPaymentIntent(data);
      setPaymentResponse(response);

      // Show payment form
      setShowPayment(true);
    } catch (err) {
      // console.error("Error creating booking:", err);
      setError(err.message || "An error occurred during booking");
    } finally {
      setProcessing(false);
      setSubmitting(false);
    }
  };

  // Handle payment completion
  const handlePaymentComplete = async (paymentIntentId) => {
    setProcessing(true);
    setError(null);

    try {
      // Confirm payment on backend
      await confirmPayment({
        paymentIntentId: paymentIntentId,
        bookingId: paymentResponse.bookingId,
      });

      // Navigate to success page
      navigate(`/payment-success?bookingId=${paymentResponse.bookingId}`);
    } catch (err) {
      // console.error("Error confirming payment:", err);
      setError(err.message || "An error occurred while confirming payment");
      setProcessing(false);
    }
  };

  return (
    <Card className="booking-form-card border-0 shadow">
      <Card.Body className="p-4">
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {!showPayment ? (
          // Step 1: Booking Details Form
          <Formik
            initialValues={{
              travelDate: new Date(new Date().setDate(new Date().getDate() + 3))
                .toISOString()
                .split("T")[0],
              travelers: 1,
              customerName: "",
              customerEmail: "",
              customerPhone: "",
            }}
            validationSchema={bookingSchema}
            onSubmit={handleBookingSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <div className="booking-steps mb-4">
                  <div className="step active">
                    <div className="step-icon">1</div>
                    <div className="step-text">Details</div>
                  </div>
                  <div className="step-connector"></div>
                  <div className="step">
                    <div className="step-icon">2</div>
                    <div className="step-text">Payment</div>
                  </div>
                  <div className="step-connector"></div>
                  <div className="step">
                    <div className="step-icon">3</div>
                    <div className="step-text">Confirmation</div>
                  </div>
                </div>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Travel Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="travelDate"
                        value={values.travelDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min={
                          new Date(new Date().setDate(new Date().getDate() + 1))
                            .toISOString()
                            .split("T")[0]
                        }
                        isInvalid={touched.travelDate && errors.travelDate}
                        className="rounded-pill"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.travelDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col
                    md={12}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Form.Group className="mb-3">
                      <Form.Label>Number of Travelers</Form.Label>
                      <div className="d-flex align-items-center">
                        <Button
                          variant="outline-secondary"
                          className="me-2"
                          onClick={() => {
                            if (values.travelers > 1) {
                              setFieldValue("travelers", values.travelers - 1);
                            }
                          }}
                          type="button"
                        >
                          <i className="bi bi-dash"></i>
                        </Button>
                        <Form.Control
                          type="number"
                          name="travelers"
                          value={values.travelers}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          min="1"
                          max="20"
                          isInvalid={touched.travelers && errors.travelers}
                          className="text-center mx-2"
                          style={{ width: "80px" }}
                        />
                        <Button
                          variant="outline-secondary"
                          className="ms-2"
                          onClick={() => {
                            if (values.travelers < 20) {
                              setFieldValue("travelers", values.travelers + 1);
                            }
                          }}
                          type="button"
                        >
                          <i className="bi bi-plus"></i>
                        </Button>
                      </div>
                      <Form.Control.Feedback type="invalid">
                        {errors.travelers}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <div className="input-icon-wrapper">
                    <i className="bi bi-person input-icon"></i>
                    <Form.Control
                      type="text"
                      name="customerName"
                      value={values.customerName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.customerName && errors.customerName}
                      placeholder="Enter your full name"
                      className="rounded-pill ps-5"
                    />
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errors.customerName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <div className="input-icon-wrapper">
                    <i className="bi bi-envelope input-icon"></i>
                    <Form.Control
                      type="email"
                      name="customerEmail"
                      value={values.customerEmail}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.customerEmail && errors.customerEmail}
                      placeholder="Enter your email address"
                      className="rounded-pill ps-5"
                    />
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errors.customerEmail}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Phone Number</Form.Label>
                  <div className="input-icon-wrapper">
                    <i className="bi bi-telephone input-icon"></i>
                    <Form.Control
                      type="tel"
                      name="customerPhone"
                      value={values.customerPhone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.customerPhone && errors.customerPhone}
                      placeholder="Enter your phone number"
                      className="rounded-pill ps-5"
                    />
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errors.customerPhone}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="price-summary mb-4">
                  <div className="price-row">
                    <span>Price per person</span>
                    <span>Rs. {packageData?.price?.toLocaleString() || 0}</span>
                  </div>
                  <div className="price-row">
                    <span>Number of travelers</span>
                    <span>{values.travelers}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total Amount</span>
                    <span>
                      Rs. {calculateTotal(values.travelers).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    className="rounded-pill booking-btn"
                    disabled={isSubmitting || processing}
                  >
                    {processing ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-arrow-right-circle-fill me-2"></i>
                        Continue to Payment
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-3 text-center text-muted">
                  <small>
                    <i className="bi bi-shield-check me-1"></i>
                    By continuing, you agree to our{" "}
                    <a href="/terms-conditions">Terms & Conditions</a>.
                  </small>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          // Step 2: Payment Form - This will be loaded only when the user proceeds to payment
          <PaymentForm
            clientSecret={paymentResponse?.clientSecret}
            onPaymentComplete={handlePaymentComplete}
            onCancel={() => setShowPayment(false)}
            amount={calculateTotal(bookingData?.travelers)}
            processing={processing}
          />
        )}
      </Card.Body>
    </Card>
  );
};

// Payment form component - will be loaded on demand
const PaymentForm = ({
  clientSecret,
  onPaymentComplete,
  onCancel,
  amount,
  processing,
}) => {
  const [paymentError, setPaymentError] = useState(null);
  const [loadingStripe, setLoadingStripe] = useState(true);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [stripeJs, setStripeJs] = useState(null);

  // Dynamically load Stripe when component mounts
  useEffect(() => {
    let isMounted = true;

    const loadStripeJs = async () => {
      try {
        // Only load Stripe once
        if (stripeLoaded) return;

        // Import Stripe dynamically to reduce API calls
        const stripeModule = await import("@stripe/stripe-js");

        if (!isMounted) return;

        // Initialize Stripe only when needed
        const stripePromise = stripeModule.loadStripe(
          "pk_test_51NnIorCqPnESIcUCUezx9Ae1Tfcxrnhqaxi0KYluXByG3dEuMUMlLY8FcJG3eUzajEWLL8oyS7OJuzUgMKcOpGlH00QwR1IcOn"
        );
        setStripeJs({ loadStripe: stripeModule.loadStripe, stripePromise });
        setStripeLoaded(true);
      } catch (err) {
        // console.error("Error loading Stripe:", err);
        if (isMounted) {
          setPaymentError("Failed to load payment system. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoadingStripe(false);
        }
      }
    };

    loadStripeJs();

    return () => {
      isMounted = false;
    };
  }, [stripeLoaded]);

  if (loadingStripe) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading payment system...</p>
      </div>
    );
  }

  if (paymentError) {
    return (
      <Alert variant="danger">
        {paymentError}
        <div className="mt-3">
          <Button variant="outline-secondary" onClick={onCancel}>
            Go Back
          </Button>
        </div>
      </Alert>
    );
  }

  if (!stripeLoaded || !stripeJs) {
    return (
      <Alert variant="warning">
        Unable to load payment system. Please try again later.
        <div className="mt-3">
          <Button variant="outline-secondary" onClick={onCancel}>
            Go Back
          </Button>
        </div>
      </Alert>
    );
  }

  // Render actual payment form
  return (
    <div>
      <div className="booking-steps mb-4">
        <div className="step">
          <div className="step-icon">1</div>
          <div className="step-text">Details</div>
        </div>
        <div className="step-connector"></div>
        <div className="step active">
          <div className="step-icon">2</div>
          <div className="step-text">Payment</div>
        </div>
        <div className="step-connector"></div>
        <div className="step">
          <div className="step-icon">3</div>
          <div className="step-text">Confirmation</div>
        </div>
      </div>

      <h5 className="mb-3">Payment Details</h5>
      <p className="text-muted mb-4">
        Total Amount: <strong>Rs. {amount.toLocaleString()}</strong>
      </p>

      <div className="mb-4">
        <p>
          <i className="bi bi-credit-card me-2 text-primary"></i>
          Enter your card details below to complete the booking
        </p>

        {/* Load Stripe Elements only when needed */}
        <LazyStripeForm
          stripePromise={stripeJs.stripePromise}
          clientSecret={clientSecret}
          onPaymentComplete={onPaymentComplete}
          onPaymentError={setPaymentError}
          onCancel={onCancel}
          processing={processing}
        />
      </div>

      <div className="mt-4 text-center">
        <p className="mt-2 text-muted small">
          <i className="bi bi-shield-lock me-1"></i>
          Your payment information is encrypted and secure
        </p>
      </div>
    </div>
  );
};

// Lazy-loaded Stripe form component
const LazyStripeForm = ({
  stripePromise,
  clientSecret,
  onPaymentComplete,
  onPaymentError,
  onCancel,
  processing,
}) => {
  const [stripeReady, setStripeReady] = useState(false);
  const [stripeElements, setStripeElements] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadStripeElements = async () => {
      try {
        // Import Stripe React components only when needed
        const stripeReactModule = await import("@stripe/react-stripe-js");

        if (!isMounted) return;

        setStripeElements({
          Elements: stripeReactModule.Elements,
          CardElement: stripeReactModule.CardElement,
          useStripe: stripeReactModule.useStripe,
          useElements: stripeReactModule.useElements,
        });
        setStripeReady(true);
      } catch (err) {
        // console.error("Error loading Stripe React components:", err);
        if (isMounted) {
          onPaymentError("Failed to load payment form. Please try again.");
        }
      }
    };

    loadStripeElements();

    return () => {
      isMounted = false;
    };
  }, [onPaymentError]);

  if (!stripeReady || !stripeElements) {
    return (
      <div className="card-element-container">
        <div className="text-center py-3">
          <Spinner animation="border" size="sm" className="me-2" />
          Loading secure payment form...
        </div>
      </div>
    );
  }

  const { Elements, CardElement, useStripe, useElements } = stripeElements;

  // The actual Stripe card form
  const StripeCardForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!stripe || !elements) {
        return;
      }

      const cardElement = elements.getElement(CardElement);

      try {
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );

        if (error) {
          onPaymentError(`Payment failed: ${error.message}`);
        } else if (paymentIntent.status === "succeeded") {
          onPaymentComplete(paymentIntent.id);
        }
      } catch (err) {
        onPaymentError(err.message || "An error occurred during payment");
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="card-element-container mb-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>

        <div className="d-flex justify-content-between">
          <Button
            variant="outline-secondary"
            onClick={onCancel}
            disabled={processing}
            type="button"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back
          </Button>

          <Button
            variant="primary"
            className="rounded-pill px-4"
            disabled={processing || !stripe}
            type="submit"
          >
            {processing ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Processing...
              </>
            ) : (
              <>
                <i className="bi bi-lock-fill me-2"></i>
                Pay Securely
              </>
            )}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <Elements stripe={stripePromise}>
      <StripeCardForm />
    </Elements>
  );
};

export default BookingForm;
