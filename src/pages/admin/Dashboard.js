import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Badge, Spinner, Alert } from "react-bootstrap";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import {
  getDashboardStats,
  getBookingChartData,
  getRevenueChartData,
  getRecentActivity,
} from "../../utils/api";
import { formatDate } from "../../utils/helpers";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [bookingChartData, setBookingChartData] = useState(null);
  const [revenueChartData, setRevenueChartData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState({
    stats: true,
    bookingChart: true,
    revenueChart: true,
    activity: true,
  });
  const [error, setError] = useState(null);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats
        const statsResponse = await getDashboardStats();
        setStats(statsResponse.data);
        setLoading((prev) => ({ ...prev, stats: false }));

        // Fetch booking chart data
        const bookingChartResponse = await getBookingChartData();
        setBookingChartData(bookingChartResponse.data);
        setLoading((prev) => ({ ...prev, bookingChart: false }));

        // Fetch revenue chart data
        const revenueChartResponse = await getRevenueChartData();
        setRevenueChartData(revenueChartResponse.data);
        setLoading((prev) => ({ ...prev, revenueChart: false }));

        // Fetch recent activity
        const activityResponse = await getRecentActivity();
        setRecentActivity(activityResponse.data);
        setLoading((prev) => ({ ...prev, activity: false }));
      } catch (err) {
        // console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading({
          stats: false,
          bookingChart: false,
          revenueChart: false,
          activity: false,
        });
      }
    };

    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs. ${amount?.toLocaleString() || 0}`;
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "succeeded":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
      case "failed":
        return "danger";
      case "refunded":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <div className="dashboard p-4">
      <h2 className="mb-4">Dashboard</h2>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={6} xl={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex flex-column">
              {loading.stats ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" size="sm" />
                </div>
              ) : (
                <>
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                      <i className="fas fa-money-bill-wave text-primary fa-lg"></i>
                    </div>
                    <h6 className="mb-0 text-muted">Total Revenue</h6>
                  </div>
                  <h3 className="mb-0 mt-auto">
                    {formatCurrency(stats?.totalRevenue)}
                  </h3>
                  <div className="d-flex justify-content-between mt-2">
                    <p className="text-muted mb-0 small">
                      Available:{" "}
                      {formatCurrency(stats?.stripeBalance?.available)}
                    </p>
                    <p className="text-muted mb-0 small">
                      Pending: {formatCurrency(stats?.stripeBalance?.pending)}
                    </p>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex flex-column">
              {loading.stats ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="success" size="sm" />
                </div>
              ) : (
                <>
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                      <i className="fas fa-users text-success fa-lg"></i>
                    </div>
                    <h6 className="mb-0 text-muted">Total Users</h6>
                  </div>
                  <h3 className="mb-0 mt-auto">{stats?.userCount || 0}</h3>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex flex-column">
              {loading.stats ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="info" size="sm" />
                </div>
              ) : (
                <>
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                      <i className="fas fa-box text-info fa-lg"></i>
                    </div>
                    <h6 className="mb-0 text-muted">Total Packages</h6>
                  </div>
                  <h3 className="mb-0 mt-auto">{stats?.packageCount || 0}</h3>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex flex-column">
              {loading.stats ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="warning" size="sm" />
                </div>
              ) : (
                <>
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                      <i className="fas fa-calendar-check text-warning fa-lg"></i>
                    </div>
                    <h6 className="mb-0 text-muted">Total Bookings</h6>
                  </div>
                  <h3 className="mb-0 mt-auto">{stats?.bookingCount || 0}</h3>
                  <div className="d-flex justify-content-between mt-2">
                    <span className="badge bg-warning text-dark">
                      Pending: {stats?.pendingBookings || 0}
                    </span>
                    <span className="badge bg-success">
                      Confirmed: {stats?.confirmedBookings || 0}
                    </span>
                    <span className="badge bg-danger">
                      Cancelled: {stats?.cancelledBookings || 0}
                    </span>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="card-title mb-4">
                Revenue Overview (Last 6 Months)
              </h5>
              {loading.revenueChart ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading revenue data...</p>
                </div>
              ) : (
                <div style={{ height: "300px" }}>
                  {revenueChartData ? (
                    <Line
                      data={revenueChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: (value) =>
                                `Rs. ${value.toLocaleString()}`,
                            },
                          },
                        },
                        plugins: {
                          legend: {
                            position: "top",
                          },
                          tooltip: {
                            callbacks: {
                              label: function (context) {
                                return `Revenue: Rs. ${context.raw.toLocaleString()}`;
                              },
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <div className="text-center py-5">
                      <p>No revenue data available</p>
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="card-title mb-4">Booking Status</h5>
              {loading.bookingChart ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading booking data...</p>
                </div>
              ) : (
                <div
                  style={{
                    height: "300px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {bookingChartData ? (
                    <Doughnut
                      data={bookingChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                          tooltip: {
                            callbacks: {
                              label: function (context) {
                                const label = context.label || "";
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce(
                                  (a, b) => a + b,
                                  0
                                );
                                const percentage = Math.round(
                                  (value / total) * 100
                                );
                                return `${label}: ${value} (${percentage}%)`;
                              },
                            },
                          },
                        },
                        cutout: "70%",
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <p>No booking data available</p>
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Card className="border-0 shadow-sm mt-4">
        <Card.Body>
          <h5 className="card-title mb-4">Recent Activity</h5>
          {loading.activity ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading recent activity...</p>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-4">
              <p>No recent activity found</p>
            </div>
          ) : (
            <Table responsive hover className="align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Type</th>
                  <th>User</th>
                  <th>Package</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity, index) => (
                  <tr key={activity.id || index}>
                    <td>
                      <Badge
                        bg={activity.type === "booking" ? "info" : "primary"}
                        className="text-capitalize"
                      >
                        {activity.type}
                      </Badge>
                    </td>
                    <td>
                      <div>
                        <h6 className="mb-0">{activity.user?.name || "N/A"}</h6>
                        <small className="text-muted">
                          {activity.user?.email || "N/A"}
                        </small>
                      </div>
                    </td>
                    <td>{activity.package?.title || "N/A"}</td>
                    <td>{formatCurrency(activity.amount)}</td>
                    <td>
                      <Badge bg={getStatusBadgeVariant(activity.status)}>
                        {activity.status}
                      </Badge>
                    </td>
                    <td>{formatDate(activity.date)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
