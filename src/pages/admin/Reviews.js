import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Badge,
  Modal,
  Form,
  Alert,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { getAllReviewsAdmin, approveReview } from "../../utils/api";
import { formatDate, reactDataTableCustomStyles } from "../../utils/helpers";
import StarRating from "../../components/common/StarRating";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateId, setStatusUpdateId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getAllReviewsAdmin(currentPage, itemsPerPage);

        if (!response?.data) {
          throw new Error("Invalid response format from server");
        }

        setReviews(response.data || []);
        setTotalItems(response.total || 0);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(
          "Failed to load reviews: " +
            (err.response?.data?.message ||
              err.message ||
              "Unknown error occurred")
        );
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [currentPage, itemsPerPage, refreshData]);

  // Handle review approval/rejection
  const handleApproveReview = async (id, approved) => {
    setUpdatingStatus(true);
    setStatusUpdateId(id);

    try {
      await approveReview(id, approved);

      // Update local state
      setReviews(
        reviews.map((review) =>
          review._id === id ? { ...review, approved } : review
        )
      );

      // If the review is currently selected in the modal, update it
      if (selectedReview && selectedReview._id === id) {
        setSelectedReview({ ...selectedReview, approved });
      }

      setError(null);
    } catch (err) {
      console.error("Error updating review status:", err);
      setError(
        "Failed to update review status: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setUpdatingStatus(false);
      setStatusUpdateId(null);
    }
  };

  // View review details
  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedReview(null);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get status badge variant
  const getStatusBadgeVariant = (approved) => {
    if (approved === true) return "success";
    if (approved === false) return "danger";
    return "warning";
  };

  // Get status text
  const getStatusText = (approved) => {
    if (approved === true) return "Approved";
    if (approved === false) return "Rejected";
    return "Pending";
  };

  // DataTable columns
  const columns = [
    {
      name: "Package",
      selector: (row) => row.packageId?.title,
      sortable: true,
      cell: (row) => (
        <div>
          <h6 className="mb-0">{row.packageId?.title || "N/A"}</h6>
          {/* <small className="text-muted">{row.package?.location || ""}</small> */}
        </div>
      ),
    },
    {
      name: "User",
      selector: (row) => row.userId?.name,
      sortable: true,
      cell: (row) => (
        <div>
          <h6 className="mb-0">{row.userId?.name || "N/A"}</h6>
          <small className="text-muted">{row.userId?.email || ""}</small>
        </div>
      ),
    },
    {
      name: "Rating",
      selector: (row) => row.rating,
      sortable: true,
      cell: (row) => <StarRating rating={row.rating} />,
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.approved,
      sortable: true,
      cell: (row) => (
        <Badge
          bg={getStatusBadgeVariant(row.approved)}
          className="text-capitalize"
        >
          {getStatusText(row.approved)}
        </Badge>
      ),
    },
    {
      name: "Date",
      selector: (row) => row.createdAt,
      sortable: true,
      cell: (row) => formatDate(row.createdAt),
    },
    {
      name: "View",
      cell: (row) => (
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleViewReview(row)}
          title="View Review"
        >
          <i className="bi bi-eye"></i>
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Approve",
      cell: (row) => (
        <Button
          variant="outline-success"
          size="sm"
          onClick={() => handleApproveReview(row._id, true)}
          title={row.approved !== true ? "Approve Review" : "Already Approved"}
          disabled={
            (updatingStatus && statusUpdateId === row._id) ||
            row.approved === true
          }
        >
          {updatingStatus && statusUpdateId === row._id ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <i className="bi bi-check-circle"></i>
          )}
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Reject",
      cell: (row) => (
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => handleApproveReview(row._id, false)}
          disabled={
            (updatingStatus && statusUpdateId === row._id) ||
            row.approved === false
          }
          title={row.approved !== false ? "Reject Review" : "Already Rejected"}
        >
          {updatingStatus && statusUpdateId === row._id ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <i className="bi bi-x-circle"></i>
          )}
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // DataTable configuration
  const tableData = {
    columns,
    data: reviews,
  };

  return (
    <div className="reviews-admin p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">Review Management</h2>
      </div>

      {error && (
        <Alert
          variant="danger"
          className="mb-4"
          dismissible
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="py-3">
          <Row className="align-items-center">
            <Col md={6}>
              <div className="d-flex align-items-center">
                <span className="text-muted me-3">
                  <i className="bi bi-star me-1"></i> Total: {totalItems || 0}{" "}
                  reviews
                </span>
                <span className="text-success me-3">
                  <i className="bi bi-check-circle me-1"></i> Approved:{" "}
                  {reviews?.filter((review) => review?.approved === true)
                    ?.length || 0}
                </span>
                <span className="text-danger me-3">
                  <i className="bi bi-x-circle me-1"></i> Rejected:{" "}
                  {reviews?.filter((review) => review?.approved === false)
                    ?.length || 0}
                </span>
                <span className="text-warning">
                  <i className="bi bi-clock me-1"></i> Pending:{" "}
                  {reviews?.filter(
                    (review) =>
                      review?.approved === null ||
                      review?.approved === undefined
                  )?.length || 0}
                </span>
              </div>
            </Col>
            <Col md={6} className="text-md-end mt-3 mt-md-0">
              <div className="d-flex justify-content-md-end">
                <Form.Select
                  className="me-2"
                  style={{ width: "80px" }}
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </Form.Select>
                <span className="mt-2">per page</span>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Reviews Table */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="mb-4">
            <Col md={8}>
              <div className="d-flex align-items-center flex-wrap">
                <Button
                  variant={
                    activeFilter === "all" ? "primary" : "outline-primary"
                  }
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setActiveFilter("all")}
                >
                  All Reviews
                </Button>
                <Button
                  variant={
                    activeFilter === "pending" ? "warning" : "outline-warning"
                  }
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setActiveFilter("pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={
                    activeFilter === "approved" ? "success" : "outline-success"
                  }
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setActiveFilter("approved")}
                >
                  Approved
                </Button>
                <Button
                  variant={
                    activeFilter === "rejected" ? "danger" : "outline-danger"
                  }
                  size="sm"
                  className="mb-2 mb-md-0"
                  onClick={() => setActiveFilter("rejected")}
                >
                  Rejected
                </Button>
              </div>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <div className="d-flex justify-content-md-end">
                <span className="text-success me-3">
                  <i className="bi bi-check-circle me-1"></i> Approved:{" "}
                  {reviews?.filter((review) => review?.approved === true)
                    ?.length || 0}
                </span>
                <span className="text-danger me-3">
                  <i className="bi bi-x-circle me-1"></i> Rejected:{" "}
                  {reviews?.filter((review) => review?.approved === false)
                    ?.length || 0}
                </span>
                <span className="text-warning">
                  <i className="bi bi-clock me-1"></i> Pending:{" "}
                  {reviews?.filter(
                    (review) =>
                      review?.approved === null ||
                      review?.approved === undefined
                  )?.length || 0}
                </span>
              </div>
            </Col>
          </Row>

          <DataTableExtensions
            {...tableData}
            filterPlaceholder="Search reviews..."
            print={false}
            export={false}
          >
            <DataTable
              columns={columns}
              data={
                activeFilter === "all"
                  ? reviews
                  : activeFilter === "pending"
                  ? reviews.filter(
                      (review) =>
                        review?.approved === null ||
                        review?.approved === undefined
                    )
                  : activeFilter === "approved"
                  ? reviews.filter((review) => review?.approved === true)
                  : reviews.filter((review) => review?.approved === false)
              }
              noHeader
              defaultSortField="createdAt"
              defaultSortAsc={false}
              pagination
              paginationServer
              paginationTotalRows={
                activeFilter === "all"
                  ? totalItems
                  : activeFilter === "pending"
                  ? reviews?.filter(
                      (review) =>
                        review?.approved === null ||
                        review?.approved === undefined
                    )?.length || 0
                  : activeFilter === "approved"
                  ? reviews?.filter((review) => review?.approved === true)
                      ?.length || 0
                  : reviews?.filter((review) => review?.approved === false)
                      ?.length || 0
              }
              paginationPerPage={itemsPerPage}
              paginationComponentOptions={{
                rowsPerPageText: "Rows per page:",
                rangeSeparatorText: "of",
                noRowsPerPage: false,
                selectAllRowsItem: false,
                selectAllRowsItemText: "All",
              }}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={(perPage) => {
                setItemsPerPage(perPage);
                setCurrentPage(1);
              }}
              progressPending={loading}
              progressComponent={
                <div className="text-center my-3">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading reviews...</p>
                </div>
              }
              noDataComponent={
                <div className="text-center my-3">
                  <p>No reviews found</p>
                </div>
              }
              customStyles={reactDataTableCustomStyles}
              highlightOnHover
              pointerOnHover
              responsive
            />
          </DataTableExtensions>
        </Card.Body>
      </Card>

      {/* Review Detail Modal */}
      <Modal
        show={showModal}
        onHide={handleModalClose}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Review Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          {selectedReview && (
            <div className="p-3 bg-light rounded-1 mb-4 border-start border-5 border-primary">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">{selectedReview.title}</h4>
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <StarRating rating={selectedReview.rating} size="sm" />
                  </div>
                  <Badge
                    bg={
                      selectedReview.approved === true
                        ? "success"
                        : selectedReview.approved === false
                        ? "danger"
                        : "warning"
                    }
                    className="px-3 py-2"
                  >
                    {selectedReview.approved === true
                      ? "Approved"
                      : selectedReview.approved === false
                      ? "Rejected"
                      : "Pending"}
                  </Badge>
                </div>
              </div>

              <div className="review-info mb-3">
                <div className="d-flex align-items-center mb-2">
                  <div className="review-icon me-2">
                    <i className="bi bi-box text-primary"></i>
                  </div>
                  <p className="mb-0">
                    <strong>Package:</strong>{" "}
                    {selectedReview.packageId?.title || "N/A"}
                  </p>
                </div>

                <div className="d-flex align-items-center mb-2">
                  <div className="review-icon me-2">
                    <i className="bi bi-person-circle text-primary"></i>
                  </div>
                  <p className="mb-0">
                    <strong>Reviewer:</strong>{" "}
                    {selectedReview.userId?.name || "N/A"} (
                    {selectedReview.userId?.email || "N/A"})
                  </p>
                </div>

                <div className="d-flex align-items-center">
                  <div className="review-icon me-2">
                    <i className="bi bi-calendar-date text-primary"></i>
                  </div>
                  <p className="mb-0">
                    <strong>Date:</strong>{" "}
                    {formatDate(selectedReview.createdAt)}
                  </p>
                </div>
              </div>

              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-primary text-white">
                  <i className="bi bi-chat-quote me-2"></i>
                  Review Content
                </Card.Header>
                <Card.Body className="bg-white">
                  <p className="mb-0">{selectedReview.text}</p>
                </Card.Body>
              </Card>

              {selectedReview.approved === null && (
                <div className="d-flex justify-content-center">
                  <Button
                    variant="success"
                    className="me-2 px-4"
                    onClick={() =>
                      handleApproveReview(selectedReview._id, true)
                    }
                    disabled={updatingStatus}
                  >
                    {updatingStatus && statusUpdateId === selectedReview._id ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                    ) : (
                      <i className="bi bi-check-circle me-2"></i>
                    )}
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    className="px-4"
                    onClick={() =>
                      handleApproveReview(selectedReview._id, false)
                    }
                    disabled={updatingStatus}
                  >
                    {updatingStatus && statusUpdateId === selectedReview._id ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                    ) : (
                      <i className="bi bi-x-circle me-2"></i>
                    )}
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Reviews;
