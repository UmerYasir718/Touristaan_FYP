import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Badge,
  Form,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import AddPackageModal from "../../components/admin/packages/AddPackageModal";
import EditPackageModal from "../../components/admin/packages/EditPackageModal";
import {
  getAdminPackages,
  enablePackage,
  disablePackage,
  deletePackage,
} from "../../utils/api";
import { formatDate } from "../../utils/helpers";
import { reactDataTableCustomStyles } from "../../utils/helpers";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [refreshData, setRefreshData] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getAdminPackages(currentPage, itemsPerPage);

        if (!response?.data) {
          throw new Error("Invalid response format from server");
        }

        const packagesData = response.data || [];
        setPackages(packagesData);
        setTotalItems(response.total || 0);

        if (packagesData.length === 0 && totalItems === 0) {
          setError(
            "No packages found. Please add a new package to get started."
          );
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError(
          "Failed to load packages: " +
            (err.response?.data?.message ||
              err.message ||
              "Unknown error occurred")
        );
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [currentPage, itemsPerPage, refreshData, totalItems]);

  // Toggle package status (active/inactive)
  const toggleStatus = async (id, isActive) => {
    try {
      if (isActive) {
        await disablePackage(id);
      } else {
        await enablePackage(id);
      }

      // Refresh the data
      setRefreshData((prev) => !prev);
    } catch (err) {
      setError(
        "Failed to update package status. " +
          (err.response?.data?.message || err.message)
      );
      console.error("Error updating package status:", err);
    }
  };

  // Delete package
  const deletePackageHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await deletePackage(id);

        // Refresh the data
        setRefreshData((prev) => !prev);
      } catch (err) {
        setError(
          "Failed to delete package. " +
            (err.response?.data?.message || err.message)
        );
        console.error("Error deleting package:", err);
      }
    }
  };

  // Open edit package modal
  const handleEditPackage = (packageData) => {
    setSelectedPackage(packageData);
    setShowEditModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedPackage(null);
    // Refresh data when modal is closed to show new/updated packages
    setRefreshData((prev) => !prev);
  };

  // Format price
  const formatPrice = (price) => {
    return `Rs. ${Number(price).toLocaleString()}`;
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // DataTable columns
  const columns = [
    {
      name: "Package",
      selector: (row) => row.title,
      sortable: true,

      cell: (row) => (
        <div className="d-flex align-items-center">
          <div
            className="package-thumbnail me-2"
            style={{
              backgroundImage: `url(${row.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "4px",
            }}
          ></div>
          <div>
            <h6 className="mb-0">{row.title}</h6>
            <small className="text-muted">{row.location}</small>
          </div>
        </div>
      ),
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,

      cell: (row) => formatPrice(row.price),
    },
    {
      name: "Duration",
      selector: (row) => row.duration,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.active,
      sortable: true,
      cell: (row) => (
        <Badge bg={row.active ? "success" : "danger"}>
          {row.active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      name: "Rating",
      selector: (row) => row.rating,
      sortable: true,
      cell: (row) => (
        <>
          <span className="me-1">{row.rating}</span>
          <i className="bi bi-star text-warning"></i>
        </>
      ),
    },
    {
      name: "Created",
      selector: (row) => row.createdAt,
      sortable: true,
      cell: (row) => formatDate(row.createdAt),
    },
    {
      name: "Edit",
      cell: (row) => (
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleEditPackage(row)}
          title="Edit Package"
        >
          <i className="bi bi-pencil"></i>
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Enable/Disable",
      cell: (row) => (
        <Button
          variant={row.active ? "outline-danger" : "outline-success"}
          size="sm"
          onClick={() => toggleStatus(row._id, row.active)}
          title={row.active ? "Disable Package" : "Enable Package"}
        >
          <i
            className={`bi bi-${row.active ? "dash-circle" : "check-circle"}`}
          ></i>
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Delete",
      cell: (row) => (
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => deletePackageHandler(row._id)}
          title="Delete Package"
        >
          <i className="bi bi-trash"></i>
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
    data: packages,
  };

  return (
    <div className="packages-admin p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">Package Management</h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>
          Add New Package
        </Button>
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
                  <i className="bi bi-box me-1"></i> Total: {totalItems || 0}{" "}
                  packages
                </span>
                <span className="text-success me-3">
                  <i className="bi bi-check-circle me-1"></i> Active:{" "}
                  {packages?.filter((pkg) => pkg?.active)?.length || 0}
                </span>
                <span className="text-danger">
                  <i className="bi bi-x-circle me-1"></i> Inactive:{" "}
                  {packages?.filter((pkg) => !pkg?.active)?.length || 0}
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

      {/* Packages Table */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <DataTableExtensions
            {...tableData}
            filterPlaceholder="Search packages..."
          >
            <DataTable
              columns={columns}
              data={packages}
              defaultSortField="createdAt"
              defaultSortAsc={false}
              pagination
              paginationServer
              paginationTotalRows={totalItems}
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
                  <p className="mt-2">Loading packages...</p>
                </div>
              }
              noDataComponent={
                <div className="text-center my-3 py-4">
                  {error ? (
                    <>
                      <i className="bi bi-exclamation-triangle fa-3x text-danger mb-3"></i>
                      <h5>Unable to load packages</h5>
                      <p className="text-muted mb-0">
                        Please try again later or contact support
                      </p>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box fa-3x text-muted mb-3"></i>
                      <h5>No packages found</h5>
                      <p className="text-muted mb-0">
                        Click the "Add New Package" button to create your first
                        package
                      </p>
                    </>
                  )}
                </div>
              }
              customStyles={reactDataTableCustomStyles}
              highlightOnHover
              pointerOnHover
              responsive
              dense
            />
          </DataTableExtensions>
        </Card.Body>
      </Card>

      {/* Add Package Modal */}
      <AddPackageModal show={showAddModal} onHide={handleModalClose} />

      {/* Edit Package Modal */}
      {selectedPackage && (
        <EditPackageModal
          show={showEditModal}
          onHide={handleModalClose}
          packageData={selectedPackage}
        />
      )}
    </div>
  );
};

export default Packages;
