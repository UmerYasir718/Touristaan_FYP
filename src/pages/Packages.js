import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchPackagesDirectly } from "../utils/api";

// Fallback packages data if API fails
const fallbackPackages = [
  {
    id: 1,
    title: "Swat Valley Adventure",
    desc: "Explore the stunning green meadows, rivers, and cultural heritage of Swat.",
    img: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    startPoint: "Islamabad",
    destinations: ["Kalam", "Malam Jabba", "Swat Valley"],
    duration: "5 days",
    price: 45000,
    rating: 4.8,
  },
  {
    id: 2,
    title: "Kashmir Paradise Tour",
    desc: "Experience paradise on earth with mesmerizing valleys and serene lakes.",
    img: "https://images.unsplash.com/photo-1566837497312-7be4a9daf7a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    startPoint: "Lahore",
    destinations: ["Muzaffarabad", "Neelum Valley", "Pir Chinasi"],
    duration: "7 days",
    price: 65000,
    rating: 4.9,
  },
  {
    id: 3,
    title: "Naran Kaghan Expedition",
    desc: "Visit the enchanting Saif-ul-Malook Lake and the lush Kaghan Valley.",
    img: "https://images.unsplash.com/photo-1586002990553-8850c4049470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    startPoint: "Islamabad",
    destinations: ["Shogran", "Naran", "Lake Saif-ul-Malook"],
    duration: "6 days",
    price: 55000,
    rating: 4.7,
  },
  {
    id: 4,
    title: "Islamabad City Tour",
    desc: "Discover the modern capital city with its parks, museums, and Margalla Hills.",
    img: "https://images.unsplash.com/photo-1529245856630-f4853233d2ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    startPoint: "Rawalpindi",
    destinations: ["Faisal Mosque", "Pakistan Monument", "Margalla Hills"],
    duration: "3 days",
    price: 25000,
    rating: 4.5,
  },
  {
    id: 5,
    title: "Lahore Cultural Heritage",
    desc: "Immerse yourself in the vibrant culture, history, and cuisine of Lahore.",
    img: "https://images.unsplash.com/photo-1567604130959-7ea7ab2a7807?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    startPoint: "Islamabad",
    destinations: ["Badshahi Mosque", "Lahore Fort", "Shalimar Gardens"],
    duration: "4 days",
    price: 35000,
    rating: 4.6,
  },
  {
    id: 6,
    title: "Karachi Coastal Retreat",
    desc: "Experience the bustling life of Karachi with its beaches and diverse culture.",
    img: "https://images.unsplash.com/photo-1567604737697-aa489e0b157a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    startPoint: "Hyderabad",
    destinations: ["Clifton Beach", "Mazar-e-Quaid", "Port Grand"],
    duration: "5 days",
    price: 40000,
    rating: 4.4,
  },
];

const Packages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch packages from API
  const loadPackages = async () => {
    try {
      setLoading(true);
      console.log("Loading packages...");
      const result = await fetchPackagesDirectly();
      if (!result.error) {
        setPackages(result.data || []);
      } else {
        console.error(result.error);
        setError(result.error);
        // Use fallback data if API fails
        // setPackages(fallbackPackages);
      }
    } catch (err) {
      console.error("Error loading packages:", err);
      setError("Failed to load packages");
      // Use fallback data if API fails
      // setPackages(fallbackPackages);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPackages();
  }, []);

  // Filter packages based on search term
  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.desc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destinations?.some((dest) =>
        dest.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <Container className="my-5">
      <h2
        className="text-center mb-2"
        style={{ fontWeight: 700, fontSize: "2.3rem" }}
      >
        Browse Tours
      </h2>
      <p className="text-center mb-4 text-muted">
        Discover the breathtaking beauty of Pakistan's northern and urban areas.
      </p>
      <Form className="d-flex justify-content-center mb-4">
        <Form.Control
          style={{ maxWidth: 400 }}
          type="text"
          placeholder="Search for a tour..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading tours...</p>
        </div>
      ) : error && packages.length === 0 ? (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      ) : (
        <Row>
          {filteredPackages.length > 0 ? (
            filteredPackages.map((pkg) => (
              <Col md={4} className="mb-4" key={pkg.id}>
                <Card className="h-100 border-0 shadow-lg">
                  <Card.Img
                    variant="top"
                    src={pkg.img}
                    style={{ height: 200, objectFit: "cover" }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold">{pkg.title}</Card.Title>
                    <Card.Text>{pkg.desc}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-primary fw-bold">
                        {pkg.price.toLocaleString()} PKR
                      </span>
                      <span className="badge bg-warning text-dark">
                        {pkg.duration}
                      </span>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted">
                        <i className="fas fa-map-marker-alt me-1"></i> From:{" "}
                        {pkg.startPoint}
                      </small>
                      <div>
                        <small className="text-muted">
                          <i className="fas fa-map-signs me-1"></i> To:{" "}
                          {pkg.destinations.join(" → ")}
                        </small>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      className="mt-auto"
                      onClick={() => navigate(`/packagesDetail?id=${pkg._id}`)}
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center my-5">
              <p>No packages found matching your search.</p>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Packages;
