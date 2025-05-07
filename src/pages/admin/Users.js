import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  Badge,
  Form,
  Row,
  Col,
  Modal,
  Spinner,
  Alert,
  InputGroup,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { getAllUsers, getUserById, updateUserStatus } from "../../utils/api";
import { formatDate, reactDataTableCustomStyles } from "../../utils/helpers";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });

  // Fetch users from API
  const fetchUsers = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllUsers(page, itemsPerPage);

        let filteredUsers = response.data || [];

        // Apply status filter if not "all"
        if (userTypeFilter !== "all") {
          filteredUsers = filteredUsers.filter(
            (user) => user.status === userTypeFilter
          );
        }

        // Apply date filter if set
        if (dateFilter.startDate && dateFilter.endDate) {
          const startDate = new Date(dateFilter.startDate);
          const endDate = new Date(dateFilter.endDate);
          endDate.setHours(23, 59, 59, 999); // Set to end of day

          filteredUsers = filteredUsers.filter((user) => {
            const userDate = new Date(user.createdAt);
            return userDate >= startDate && userDate <= endDate;
          });
        }

        // Apply search query if set
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredUsers = filteredUsers.filter(
            (user) =>
              user.name?.toLowerCase().includes(query) ||
              user.email?.toLowerCase().includes(query) ||
              user.phone?.toLowerCase().includes(query) ||
              user._id?.toLowerCase().includes(query)
          );
        }

        setUsers(filteredUsers);
        setTotalItems(response.total);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again later.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage, userTypeFilter, dateFilter, searchQuery]
  );

  // Initial data load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle page change
  const handlePageChange = (page) => {
    fetchUsers(page);
  };

  // View user details
  const viewUserDetails = async (userId) => {
    setShowDetailsModal(true);
    setUserDetailsLoading(true);

    try {
      const response = await getUserById(userId);
      setSelectedUser(response.data);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to load user details. Please try again later.");
    } finally {
      setUserDetailsLoading(false);
    }
  };

  // Toggle user status
  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setStatusUpdateLoading(true);

    try {
      await updateUserStatus(userId, newStatus);

      // Update the user in the list
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );

      // If the user is currently selected in the modal, update it
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }

      setError(null);
    } catch (err) {
      console.error("Error updating user status:", err);
      setError(
        "Failed to update user status: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "warning";
      case "suspended":
        return "danger";
      default:
        return "secondary";
    }
  };

  // Get role badge variant
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "admin":
        return "primary";
      case "guide":
        return "info";
      case "user":
        return "secondary";
      default:
        return "light";
    }
  };

  // DataTable columns
  const columns = [
    {
      name: "User",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="d-flex align-items-center">
          <div
            className="user-avatar me-2"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#e9ecef",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              color: "#495057",
            }}
          >
            {row.name
              ? row.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .substring(0, 2)
              : "U"}
          </div>
          <div>
            <h6 className="mb-0">{row.name}</h6>
            <small className="text-muted">{row.email}</small>
          </div>
        </div>
      ),
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
      cell: (row) => (
        <Badge bg={row.role === "admin" ? "danger" : "primary"}>
          {row.role}
        </Badge>
      ),
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
      cell: (row) => row.phone || "N/A",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <Badge
          bg={getStatusBadgeVariant(row.status)}
          className="text-capitalize"
        >
          {row.status}
        </Badge>
      ),
    },
    {
      name: "Joined",
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
          onClick={() => viewUserDetails(row._id)}
          title="View User Details"
        >
          <i className="fas fa-eye"></i>
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Set Active",
      cell: (row) => (
        <Button
          variant="outline-success"
          size="sm"
          onClick={() => toggleUserStatus(row._id, row.status)}
          title="Set as Active"
          disabled={row.status === "active" || statusUpdateLoading}
        >
          <i className="fas fa-user-check"></i>
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Set Inactive",
      cell: (row) => (
        <Button
          variant="outline-warning"
          size="sm"
          onClick={() => toggleUserStatus(row._id, row.status)}
          title="Set as Inactive"
          disabled={row.status === "inactive" || statusUpdateLoading}
        >
          <i className="fas fa-user-slash"></i>
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Set Suspended",
      cell: (row) => (
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => toggleUserStatus(row._id, row.status)}
          title="Set as Suspended"
          disabled={row.status === "suspended" || statusUpdateLoading}
        >
          <i className="fas fa-ban"></i>
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
    data: users,
  };

  return (
    <div className="users-admin p-4">
      <h2 className="mb-4">User Management</h2>

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
          <Row className="align-items-center mb-3">
            <Col md={8}>
              <div className="d-flex align-items-center flex-wrap">
                <Button
                  variant={
                    userTypeFilter === "all" ? "primary" : "outline-primary"
                  }
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setUserTypeFilter("all")}
                >
                  All Users
                </Button>
                <Button
                  variant={
                    userTypeFilter === "active" ? "success" : "outline-success"
                  }
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setUserTypeFilter("active")}
                >
                  <i className="bi bi-person-check me-1"></i>
                  Active
                </Button>
                <Button
                  variant={
                    userTypeFilter === "inactive"
                      ? "warning"
                      : "outline-warning"
                  }
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setUserTypeFilter("inactive")}
                >
                  <i className="bi bi-person-dash me-1"></i>
                  Inactive
                </Button>
                <Button
                  variant={
                    userTypeFilter === "suspended" ? "danger" : "outline-danger"
                  }
                  size="sm"
                  className="mb-2 mb-md-0"
                  onClick={() => setUserTypeFilter("suspended")}
                >
                  <i className="bi bi-person-x me-1"></i>
                  Suspended
                </Button>
              </div>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <div className="d-flex justify-content-md-end">
                <Form.Select
                  className="me-2"
                  style={{ width: "80px" }}
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    fetchUsers(1);
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

          <Row>
            <Col md={6} className="mb-2 mb-md-0">
              <Form.Group>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button
                      variant="outline-secondary"
                      onClick={() => setSearchQuery("")}
                    >
                      <i className="bi bi-x"></i>
                    </Button>
                  )}
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Row>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Control
                      type="date"
                      placeholder="Start Date"
                      value={dateFilter.startDate}
                      onChange={(e) =>
                        setDateFilter({
                          ...dateFilter,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="d-flex">
                    <Form.Control
                      type="date"
                      placeholder="End Date"
                      value={dateFilter.endDate}
                      onChange={(e) =>
                        setDateFilter({
                          ...dateFilter,
                          endDate: e.target.value,
                        })
                      }
                    />
                    {(dateFilter.startDate || dateFilter.endDate) && (
                      <Button
                        variant="outline-secondary"
                        className="ms-2"
                        onClick={() =>
                          setDateFilter({ startDate: "", endDate: "" })
                        }
                      >
                        <i className="bi bi-x"></i>
                      </Button>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <DataTableExtensions
            {...tableData}
            filterPlaceholder="Search users..."
          >
            <DataTable
              columns={columns}
              data={users}
              noHeader
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
                fetchUsers(1);
              }}
              progressPending={loading}
              progressComponent={
                <div className="text-center my-3">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading users...</p>
                </div>
              }
              noDataComponent={
                <div className="text-center my-3">
                  <p>No users found</p>
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

      {/* User Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <i className="fas fa-user me-2"></i>
            User Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userDetailsLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading user details...</p>
            </div>
          ) : selectedUser ? (
            <div>
              <Row>
                <Col md={6}>
                  <Card className="border-0 mb-4">
                    <Card.Body>
                      <h5 className="mb-3">Basic Information</h5>
                      <p className="mb-2">
                        <strong>Name:</strong> {selectedUser.name}
                      </p>
                      <p className="mb-2">
                        <strong>Email:</strong> {selectedUser.email}
                      </p>
                      <p className="mb-2">
                        <strong>Phone:</strong> {selectedUser.phone || "N/A"}
                      </p>
                      <p className="mb-2">
                        <strong>Role:</strong>{" "}
                        <Badge
                          bg={getRoleBadgeVariant(selectedUser.role)}
                          className="text-capitalize"
                        >
                          {selectedUser.role}
                        </Badge>
                      </p>
                      <p className="mb-0">
                        <strong>Status:</strong>{" "}
                        <Badge
                          bg={getStatusBadgeVariant(selectedUser.status)}
                          className="text-capitalize"
                        >
                          {selectedUser.status}
                        </Badge>
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 mb-4">
                    <Card.Body>
                      <h5 className="mb-3">Account Information</h5>
                      <p className="mb-2">
                        <strong>Joined:</strong>{" "}
                        {formatDate(selectedUser.createdAt)}
                      </p>
                      <p className="mb-2">
                        <strong>Last Updated:</strong>{" "}
                        {formatDate(selectedUser.updatedAt)}
                      </p>
                      <p className="mb-0">
                        <strong>Last Login:</strong>{" "}
                        {selectedUser.lastLogin
                          ? formatDate(selectedUser.lastLogin)
                          : "Never"}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {selectedUser.bookings && selectedUser.bookings.length > 0 && (
                <Card className="border-0 mb-0">
                  <Card.Body>
                    <h5 className="mb-3">Recent Bookings</h5>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Package</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedUser.bookings.map((booking) => (
                            <tr key={booking._id}>
                              <td>{booking.packageName}</td>
                              <td>{formatDate(booking.travelDate)}</td>
                              <td>Rs. {booking.amount?.toLocaleString()}</td>
                              <td>
                                <Badge
                                  bg={getStatusBadgeVariant(booking.status)}
                                  className="text-capitalize"
                                >
                                  {booking.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p>User not found</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedUser && (
            <Button
              variant={
                selectedUser.status === "active"
                  ? "warning"
                  : selectedUser.status === "inactive"
                  ? "danger"
                  : "success"
              }
              onClick={() =>
                toggleUserStatus(selectedUser._id, selectedUser.status)
              }
              disabled={statusUpdateLoading}
              title={
                selectedUser.status === "active"
                  ? "Set as Inactive"
                  : selectedUser.status === "inactive"
                  ? "Set as Suspended"
                  : "Set as Active"
              }
            >
              {statusUpdateLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : selectedUser.status === "active" ? (
                <>
                  <i className="fas fa-user-slash me-2"></i>
                  Set as Inactive
                </>
              ) : selectedUser.status === "inactive" ? (
                <>
                  <i className="fas fa-ban me-2"></i>
                  Set as Suspended
                </>
              ) : (
                <>
                  <i className="fas fa-user-check me-2"></i>
                  Set as Active
                </>
              )}
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
            title="Close Modal"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
