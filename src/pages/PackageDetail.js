import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Tab,
  Nav,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  fetchPackageByIdDirectly,
  getPackageReviews,
  getCurrentUser,
  checkUserReviewedPackage,
} from "../utils/api";
import BookingForm from "../components/BookingForm";
import ReviewForm from "../components/reviews/ReviewForm";
import StarRating from "../components/common/StarRating";

// Fix for default marker icon issue in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Simple image carousel component with auto-sliding
const SimpleImageCarousel = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-slide functionality
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  //   }, 5000); // Change slide every 5 seconds

  //   return () => clearInterval(interval);
  // }, [images.length]);

  const nextSlide = () => {
    setActiveIndex((activeIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="simple-carousel position-relative">
      <img
        src={images[activeIndex]}
        alt={`Slide ${activeIndex + 1}`}
        className="w-100"
        style={{ height: "400px", objectFit: "cover" }}
      />

      <button
        className="carousel-control-prev"
        onClick={prevSlide}
        style={{
          position: "absolute",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.5)",
          border: "none",
          color: "white",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
        }}
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      <button
        className="carousel-control-next"
        onClick={nextSlide}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.5)",
          border: "none",
          color: "white",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
        }}
      >
        <i className="fas fa-chevron-right"></i>
      </button>

      <div className="carousel-indicators d-flex justify-content-center mt-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`mx-1 ${index === activeIndex ? "active" : ""}`}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: index === activeIndex ? "#007bff" : "#ccc",
              border: "none",
            }}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Leaflet map component for displaying tour routes
const TourRouteMap = ({ coordinates }) => {
  // If no coordinates are provided, show a placeholder
  if (!coordinates || coordinates.length === 0) {
    return (
      <div className="text-center p-5 bg-light">
        <p>Map data not available</p>
      </div>
    );
  }

  // Create a string of location names for the title
  const locationNames = coordinates.map((coord) => coord.place).join(" → ");

  // Convert coordinates to format needed for Leaflet [lat, lng]
  const positions = coordinates.map((coord) => [
    parseFloat(coord.lat),
    parseFloat(coord.lng),
  ]);

  // Set center of the map to Pakistan's coordinates
  const center = [30.3753, 69.3451]; // Pakistan's geographical center
  const defaultZoom = 0; // Lower zoom level to show more of Pakistan

  // Function to set map bounds
  const MapBounds = () => {
    const map = useMap();

    useEffect(() => {
      if (positions.length > 0) {
        const bounds = L.latLngBounds(positions);
        map.fitBounds(bounds, { padding: [50, 50] });

        // Force a map refresh to ensure it renders correctly
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      }
    }, [map]);

    return null;
  };

  return (
    <div className="map-container">
      <h5 className="mb-3">Tour Route: {locationNames}</h5>
      <div style={{ height: "400px", width: "100%", position: "relative" }}>
        <MapContainer
          center={center}
          zoom={defaultZoom}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          dragging={true}
          touchZoom={true}
          doubleClickZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapBounds />

          {/* Draw route line between points */}
          <Polyline
            positions={positions}
            color="#2c7be5"
            weight={4}
            opacity={0.7}
          />

          {/* Add markers for each location */}
          {coordinates.map((coord, index) => (
            <Marker
              key={index}
              position={[parseFloat(coord.lat), parseFloat(coord.lng)]}
            >
              <Popup>
                <div>
                  <strong>{coord.place}</strong>
                  <br />
                  {index === 0
                    ? "Starting Point"
                    : index === coordinates.length - 1
                    ? "Destination"
                    : `Stop ${index}`}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <p className="text-muted mt-2 small">
        <i className="fas fa-info-circle me-1"></i>
        This map shows the approximate route. Actual travel paths may vary.
      </p>
    </div>
  );
};

// Package detail page component
const PackageDetail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [hasCompletedBooking, setHasCompletedBooking] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Fetch package details
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        // Get package ID from URL
        const packageId = id || location.pathname.split("/").pop();

        // Fetch package details
        const response = await fetchPackageByIdDirectly(packageId);
        // console.log(response);
        setPkg(response.data);

        // Check if user is logged in
        try {
          const userResponse = await getCurrentUser();
          if (userResponse?.data) {
            setCurrentUser(userResponse.data);

            // Check if user has completed bookings for this package
            // This would typically come from a separate API call to get user's bookings
            const userBookingsResponse = await fetch(
              `/api/bookings/user?packageId=${packageId}`
            );
            const bookingsData = await userBookingsResponse.json();

            // Check if any booking is completed
            const completedBooking = bookingsData.find(
              (booking) =>
                booking.status === "completed" &&
                booking.packageId === packageId
            );

            setHasCompletedBooking(!!completedBooking);

            // Check if user has already reviewed this package
            try {
              const reviewCheckResponse = await checkUserReviewedPackage(
                packageId
              );
              setHasReviewed(!!reviewCheckResponse.data.hasReviewed);
            } catch (reviewCheckError) {
              // console.error(
              //   "Error checking if user reviewed package:",
              //   reviewCheckError
              // );
            }
          }
        } catch (userError) {
          // console.log("User not logged in or error fetching user data");
        }
      } catch (err) {
        // console.error("Error fetching package details:", err);
        setError("Failed to load package details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id, location.pathname]);

  // Fetch package reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!pkg) return;

      try {
        setReviewsLoading(true);
        // Get reviews only for this specific package
        const response = await getPackageReviews(pkg._id);

        if (response?.data) {
          setReviews(response.data?.data);
        }
      } catch (err) {
        // console.error("Error fetching package reviews:", err);
        setReviewsError("Failed to load reviews. Please try again.");
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [pkg]);

  // Calculate rating stats
  const calculateRatingStats = () => {
    if (!reviews || reviews.length === 0) {
      return {
        average: 0,
        total: 0,
        distribution: [0, 0, 0, 0, 0],
      };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = (sum / total).toFixed(1);

    // Calculate distribution
    const distribution = [0, 0, 0, 0, 0]; // 5-star, 4-star, 3-star, 2-star, 1-star

    reviews.forEach((review) => {
      const ratingIndex = Math.min(
        Math.max(Math.floor(review.rating) - 1, 0),
        4
      );
      distribution[4 - ratingIndex]++; // Reverse index for 5-star first
    });

    // Convert to percentages
    const percentages = distribution.map((count) =>
      total > 0 ? Math.round((count / total) * 100) : 0
    );

    return {
      average,
      total,
      distribution: percentages,
    };
  };

  const ratingStats = calculateRatingStats();

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading package details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!pkg) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Package not found.</Alert>
      </Container>
    );
  }

  return (
    <div className="py-5">
      {/* Hero Section */}
      <div
        className="bg-dark text-white py-5 mb-5"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${pkg.images[0]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md={10} className="text-center">
              <h1 className="display-4 fw-bold mb-3">{pkg.title}</h1>
              <div className="d-flex justify-content-center align-items-center mb-3">
                <div className="me-3">
                  <i className="fas fa-star text-warning me-1"></i>
                  <span className="fw-bold">{ratingStats.average}</span>
                  <span className="text-white-50">
                    {" "}
                    ({ratingStats.total} reviews)
                  </span>
                </div>
                <div className="mx-3">
                  <i className="fas fa-map-marker-alt text-danger me-1"></i>
                  <span>{pkg.destinations.join(", ")}</span>
                </div>
                <div className="mx-3">
                  <i className="fas fa-clock text-info me-1"></i>
                  <span>{pkg.duration} days</span>
                </div>
              </div>
              <Badge bg="primary" className="p-2 fs-6">
                <i className="fas fa-tag me-1"></i> PKR{" "}
                {pkg.price.toLocaleString()}
              </Badge>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row>
          <Col lg={8}>
            {/* Image Carousel */}
            <SimpleImageCarousel images={pkg.images} />

            {/* Package Details */}
            <Card className="border-0 shadow-lg mt-4 mb-4">
              <Card.Body>
                <Tab.Container
                  id="package-details-tabs"
                  defaultActiveKey="overview"
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                >
                  <Nav variant="tabs" className="mb-3">
                    <Nav.Item>
                      <Nav.Link eventKey="overview">Overview</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="itinerary">Itinerary</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="map">Map</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="reviews">
                        Reviews <Badge bg="primary">{ratingStats.total}</Badge>
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content>
                    <Tab.Pane eventKey="overview">
                      <h4 className="mb-3">Package Overview</h4>
                      <p>{pkg.desc}</p>
                      <h5 className="mt-4 mb-3">Package Includes</h5>
                      <ul className="list-unstyled">
                        <li>
                          <i className="fas fa-check-circle text-success me-2"></i>{" "}
                          Hotel accommodation
                        </li>
                        <li>
                          <i className="fas fa-check-circle text-success me-2"></i>{" "}
                          Breakfast and dinner
                        </li>
                        <li>
                          <i className="fas fa-check-circle text-success me-2"></i>{" "}
                          Transportation
                        </li>
                        <li>
                          <i className="fas fa-check-circle text-success me-2"></i>{" "}
                          Tour guide
                        </li>
                        <li>
                          <i className="fas fa-check-circle text-success me-2"></i>{" "}
                          Sightseeing activities
                        </li>
                      </ul>
                      <h5 className="mt-4 mb-3">Destinations</h5>
                      <div className="d-flex flex-wrap">
                        {pkg.destinations.map((dest, index) => (
                          <Badge
                            key={index}
                            bg="light"
                            text="dark"
                            className="me-2 mb-2 p-2"
                          >
                            <i className="fas fa-map-pin me-1 text-danger"></i>{" "}
                            {dest}
                          </Badge>
                        ))}
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="itinerary">
                      <h4 className="mb-3">Tour Itinerary</h4>
                      {pkg.itinerary ? (
                        pkg.itinerary.map((day, index) => (
                          <Card key={index} className="mb-3 border-0 shadow-sm">
                            <Card.Body>
                              <div className="d-flex align-items-center mb-2">
                                <div
                                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    minWidth: "40px",
                                  }}
                                >
                                  <strong>D{day.day}</strong>
                                </div>
                                <h5 className="mb-0">{day.title}</h5>
                              </div>
                              <p className="ms-5 ps-2 mb-0">
                                {day.description}
                              </p>
                            </Card.Body>
                          </Card>
                        ))
                      ) : (
                        <p>Itinerary details not available</p>
                      )}
                    </Tab.Pane>

                    <Tab.Pane eventKey="map">
                      <h4 className="mb-3">Tour Map</h4>
                      {pkg.coordinates ? (
                        <TourRouteMap coordinates={pkg.coordinates} />
                      ) : (
                        <p>Map data not available</p>
                      )}
                    </Tab.Pane>

                    <Tab.Pane eventKey="reviews">
                      <h4 className="mb-3">Customer Reviews</h4>

                      {reviewsLoading ? (
                        <div className="text-center py-4">
                          <Spinner
                            animation="border"
                            variant="primary"
                            size="sm"
                          />
                          <p>Loading reviews...</p>
                        </div>
                      ) : reviewsError ? (
                        <Alert variant="danger">{reviewsError}</Alert>
                      ) : (
                        <>
                          <div className="d-flex align-items-center mb-4">
                            <div className="bg-light rounded p-3 text-center me-3">
                              <h2 className="mb-0">{ratingStats.average}</h2>
                              <StarRating
                                rating={parseFloat(ratingStats.average)}
                              />
                              <small>
                                Based on {ratingStats.total} reviews
                              </small>
                            </div>
                            <div>
                              <h5>Rating Breakdown</h5>
                              <div className="d-flex align-items-center mb-1">
                                <span className="me-2">5★</span>
                                <div
                                  className="progress flex-grow-1"
                                  style={{ height: "8px" }}
                                >
                                  <div
                                    className="progress-bar bg-success"
                                    style={{
                                      width: `${ratingStats.distribution[0]}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="ms-2">
                                  {ratingStats.distribution[0]}%
                                </span>
                              </div>
                              <div className="d-flex align-items-center mb-1">
                                <span className="me-2">4★</span>
                                <div
                                  className="progress flex-grow-1"
                                  style={{ height: "8px" }}
                                >
                                  <div
                                    className="progress-bar bg-primary"
                                    style={{
                                      width: `${ratingStats.distribution[1]}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="ms-2">
                                  {ratingStats.distribution[1]}%
                                </span>
                              </div>
                              <div className="d-flex align-items-center mb-1">
                                <span className="me-2">3★</span>
                                <div
                                  className="progress flex-grow-1"
                                  style={{ height: "8px" }}
                                >
                                  <div
                                    className="progress-bar bg-info"
                                    style={{
                                      width: `${ratingStats.distribution[2]}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="ms-2">
                                  {ratingStats.distribution[2]}%
                                </span>
                              </div>
                              <div className="d-flex align-items-center mb-1">
                                <span className="me-2">2★</span>
                                <div
                                  className="progress flex-grow-1"
                                  style={{ height: "8px" }}
                                >
                                  <div
                                    className="progress-bar bg-warning"
                                    style={{
                                      width: `${ratingStats.distribution[3]}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="ms-2">
                                  {ratingStats.distribution[3]}%
                                </span>
                              </div>
                              <div className="d-flex align-items-center">
                                <span className="me-2">1★</span>
                                <div
                                  className="progress flex-grow-1"
                                  style={{ height: "8px" }}
                                >
                                  <div
                                    className="progress-bar bg-danger"
                                    style={{
                                      width: `${ratingStats.distribution[4]}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="ms-2">
                                  {ratingStats.distribution[4]}%
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Write a review section - only show if user has completed booking and hasn't reviewed yet */}
                          {currentUser &&
                            hasCompletedBooking &&
                            !hasReviewed && (
                              <div className="mb-4">
                                <Card className="border-0 shadow-lg">
                                  <Card.Body>
                                    <h5>Write a Review</h5>
                                    <p className="text-muted">
                                      Share your experience with this tour
                                      package.
                                    </p>
                                    <ReviewForm
                                      packageId={pkg._id}
                                      onReviewSubmitted={() => {
                                        setHasReviewed(true);
                                        // Refresh reviews after submission
                                        const refreshReviews = async () => {
                                          try {
                                            const response =
                                              await getPackageReviews(pkg._id);
                                            if (response?.data) {
                                              setReviews(response.data);
                                            }
                                          } catch (err) {
                                            // console.error(
                                            //   "Error refreshing reviews:",
                                            //   err
                                            // );
                                          }
                                        };
                                        refreshReviews();
                                      }}
                                    />
                                  </Card.Body>
                                </Card>
                              </div>
                            )}

                          {/* Reviews list */}
                          <h5 className="mb-3">
                            {reviews.length > 0
                              ? "Recent Reviews"
                              : "No reviews yet"}
                          </h5>

                          {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                              <Card
                                key={index}
                                className="border-0 shadow-sm mb-3"
                              >
                                <Card.Body>
                                  <div className="d-flex justify-content-between mb-2">
                                    <div>
                                      <h5 className="mb-0">
                                        {review.userId.name}
                                      </h5>
                                      <h6 className="mb-0">{review.name}</h6>
                                      <StarRating rating={review.rating} />
                                    </div>
                                    <small className="text-muted">
                                      {new Date(
                                        review.createdAt
                                      ).toLocaleDateString()}
                                    </small>
                                  </div>
                                  <h6 className="mt-2">{review.title}</h6>
                                  <p className="mb-0">{review.review}</p>

                                  {review.photos &&
                                    review.photos.length > 0 && (
                                      <div className="mt-2 d-flex flex-wrap">
                                        {review.photos.map(
                                          (photo, photoIndex) => (
                                            <img
                                              key={photoIndex}
                                              src={photo}
                                              alt={`Review ${photoIndex + 1}`}
                                              className="me-2 mb-2 rounded"
                                              style={{
                                                width: "80px",
                                                height: "80px",
                                                objectFit: "cover",
                                              }}
                                            />
                                          )
                                        )}
                                      </div>
                                    )}
                                </Card.Body>
                              </Card>
                            ))
                          ) : (
                            <p className="text-muted">
                              Be the first to review this package!
                            </p>
                          )}
                        </>
                      )}
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Booking Form */}
            <div className="sticky-top" style={{ top: "20px", zIndex: 100 }}>
              <Card className="border-0 shadow-lg mb-4">
                <Card.Body>
                  <h4 className="mb-3">Book This Package</h4>
                  <BookingForm packageData={pkg} />
                </Card.Body>
              </Card>

              {/* Need Help Card */}
              <Card className="border-0 shadow-lg">
                <Card.Body>
                  <h5 className="mb-3">Need Help?</h5>
                  <p>
                    Have questions about this tour? Our travel experts are here
                    to help.
                  </p>
                  <div className="d-grid">
                    <Button
                      variant="outline-primary"
                      className="mb-2"
                      href="tel:+923001234567"
                    >
                      <i className="fas fa-phone-alt me-2"></i> Call Us
                    </Button>
                    <Button variant="outline-success" href="/contact">
                      <i className="fas fa-envelope me-2"></i> Email Us
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PackageDetail;
