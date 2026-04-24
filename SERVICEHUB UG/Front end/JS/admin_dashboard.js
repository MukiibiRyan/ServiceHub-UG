// ======== ADMIN DASHBOARD PAGE - JAVASCRIPT ========
// This file manages the admin dashboard functionality
// Handles section navigation, profile dropdown, and admin-specific features

// ======== DOM ELEMENT REFERENCES ========
const sidebarItems = document.querySelectorAll(".sidebar-item");
const sections = document.querySelectorAll(".section");
const profileDropdown = document.querySelector(".profile-dropdown");
const dropdownMenu = document.querySelector(".dropdown-menu");
const notificationsBell = document.querySelector(".notifications-bell");
const mainContent = document.querySelector(".main-content");

// ======== SAMPLE ADMIN DATA ========
const currentAdmin = {
  id: "ADM001",
  name: "Admin",
  email: "admin@servicehubug.com",
  role: "administrator",
  avatar: "👑",
  phone: "+256 791 469 205",
  location: "Kampala, Uganda",
  joinedDate: "2024-01-01"
};

// ======== SAMPLE DASHBOARD DATA ========
const adminDashboardData = {
  overview: {
    totalUsers: 1247,
    activeTechnicians: 89,
    totalBookings: 3456,
    monthlyRevenue: 12500000,
    pendingVerifications: 5,
    recentBookings: [
      { id: "BK0345", service: "Plumbing Service", status: "pending" },
      { id: "BK0344", service: "Electrical Repair", status: "confirmed" },
      { id: "BK0343", service: "Carpentry Work", status: "completed" }
    ]
  },
  users: [
    { id: "U001", name: "Mary Johnson", email: "mary@example.com", type: "client", status: "active", joined: "2026-01-15" },
    { id: "U002", name: "Ahmed Hassan", email: "ahmed@example.com", type: "technician", status: "active", joined: "2026-02-20" }
  ],
  technicians: [
    { id: "T001", name: "Ahmed Hassan", skills: "Electrical, Plumbing", rating: 4.8, status: "verified", bookings: 45 },
    { id: "T002", name: "Sarah Nakato", skills: "Plumbing", rating: 4.6, status: "pending", bookings: 12 }
  ],
  bookings: [
    { id: "BK0345", customer: "Mary Johnson", technician: "Ahmed Hassan", service: "Plumbing", date: "2026-04-25", time: "2:00 PM", status: "pending" },
    { id: "BK0344", customer: "John Mukasa", technician: "Sarah Nakato", service: "Electrical", date: "2026-04-24", time: "10:00 AM", status: "confirmed" }
  ],
  payments: [
    { id: "PY0345", bookingId: "BK0344", customer: "John Mukasa", amount: 150000, method: "Mobile Money", status: "completed", date: "2026-04-24" }
  ],
  messages: [
    { id: "SUP001", title: "Support Ticket #SUP001", status: "open", messages: [
      { sender: "User", text: "Having issues with booking confirmation" },
      { sender: "Admin", text: "We'll look into this right away." }
    ]}
  ]
};

// ======== EVENT LISTENERS ========

// Sidebar Navigation - Switches between dashboard sections
sidebarItems.forEach((item) => {
  item.addEventListener("click", () => {
    handleSidebarNavigation(item);
  });
});

// Profile Dropdown Toggle - Shows/hides profile menu
if (profileDropdown) {
  profileDropdown.addEventListener("click", () => {
    renderProfileDropdown();
  });
}

// Dropdown Menu Link Click - Handles dropdown menu actions
if (dropdownMenu) {
  dropdownMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (link.getAttribute("href") === "#logout") {
        event.preventDefault();
        handleLogout();
      }
    });
  });
}

// Notifications Click - Shows notifications
if (notificationsBell) {
  notificationsBell.addEventListener("click", () => {
    showNotifications();
  });
}

// Window Click Outside Dropdown - Closes dropdown menu
window.addEventListener("click", (event) => {
  if (dropdownMenu && !profileDropdown.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.style.display = "none";
  }
});

// Search and Filter Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // User search and filters
  const userSearch = document.getElementById("userSearch");
  const userTypeFilter = document.getElementById("userTypeFilter");
  const userStatusFilter = document.getElementById("userStatusFilter");

  if (userSearch) {
    userSearch.addEventListener("input", () => filterUsers());
  }
  if (userTypeFilter) {
    userTypeFilter.addEventListener("change", () => filterUsers());
  }
  if (userStatusFilter) {
    userStatusFilter.addEventListener("change", () => filterUsers());
  }

  // Technician search and filters
  const techSearch = document.getElementById("techSearch");
  const verificationFilter = document.getElementById("verificationFilter");

  if (techSearch) {
    techSearch.addEventListener("input", () => filterTechnicians());
  }
  if (verificationFilter) {
    verificationFilter.addEventListener("change", () => filterTechnicians());
  }

  // Booking search and filters
  const bookingSearch = document.getElementById("bookingSearch");
  const bookingStatusFilter = document.getElementById("bookingStatusFilter");

  if (bookingSearch) {
    bookingSearch.addEventListener("input", () => filterBookings());
  }
  if (bookingStatusFilter) {
    bookingStatusFilter.addEventListener("change", () => filterBookings());
  }

  // Payment search and filters
  const paymentSearch = document.getElementById("paymentSearch");
  const paymentStatusFilter = document.getElementById("paymentStatusFilter");

  if (paymentSearch) {
    paymentSearch.addEventListener("input", () => filterPayments());
  }
  if (paymentStatusFilter) {
    paymentStatusFilter.addEventListener("change", () => filterPayments());
  }
});

// ======== NAVIGATION FUNCTIONS ========

// Handle Sidebar Navigation
function handleSidebarNavigation(item) {
  const sectionId = item.getAttribute("onclick").match(/showSection\('(\w+)'\)/)[1];
  showSection(sectionId);
}

// Show Section - Main navigation function
function showSection(sectionId) {
  // Remove active class from all sidebar items
  sidebarItems.forEach((item) => {
    item.classList.remove("active");
  });

  // Add active class to clicked item
  const activeItem = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
  if (activeItem) {
    activeItem.classList.add("active");
  }

  // Hide all sections
  sections.forEach((section) => {
    section.classList.remove("active");
  });

  // Show selected section
  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.classList.add("active");
    // Scroll to top of main content
    mainContent.scrollTop = 0;
  }

  console.log("Navigation to section:", sectionId);
}

// ======== HEADER NAVIGATION FUNCTIONS ========

// Handle Header Navigation Clicks
function handleHeaderNavigation(event, target) {
  event.preventDefault();

  // Add click animation
  event.target.style.transform = "scale(0.95)";
  setTimeout(() => {
    event.target.style.transform = "scale(1)";
  }, 150);

  // Navigate to target
  if (target === "home") {
    window.location.href = "./index.html";
  } else if (target === "login") {
    window.location.href = "./login.htm";
  } else if (target === "register") {
    window.location.href = "./register.htm";
  }
}

// Initialize Header Navigation
document.addEventListener("DOMContentLoaded", () => {
  // Add click handlers to header navigation links
  const headerLinks = document.querySelectorAll("header .navbar a");

  headerLinks.forEach(link => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (href === "./index.html") {
        handleHeaderNavigation(event, "home");
      } else if (href === "./login.htm") {
        handleHeaderNavigation(event, "login");
      } else if (href === "./register.htm") {
        handleHeaderNavigation(event, "register");
      }
    });
  });

  console.log("Header navigation initialized");
});

// ======== RENDER FUNCTIONS ========

// Render Profile Dropdown
function renderProfileDropdown() {
  if (dropdownMenu.style.display === "block") {
    dropdownMenu.style.display = "none";
  } else {
    dropdownMenu.style.display = "block";
  }
}

// Show Notifications
function showNotifications() {
  alert("Admin Notifications:\n• 3 pending technician verifications\n• 2 unresolved support tickets\n• 1 system maintenance reminder");
}

// Handle Logout
function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    // In a real app, this would clear session/token and redirect
    alert("Logged out successfully!");
    window.location.href = "./login.htm";
  }
}

// ======== FILTER FUNCTIONS ========

// Filter Users
function filterUsers() {
  const searchTerm = document.getElementById("userSearch").value.toLowerCase();
  const typeFilter = document.getElementById("userTypeFilter").value;
  const statusFilter = document.getElementById("userStatusFilter").value;

  const tableBody = document.querySelector("#usersTable tbody");
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach(row => {
    const name = row.cells[1].textContent.toLowerCase();
    const type = row.cells[3].textContent.toLowerCase();
    const status = row.cells[4].textContent.toLowerCase();

    const matchesSearch = name.includes(searchTerm);
    const matchesType = typeFilter === "" || type === typeFilter;
    const matchesStatus = statusFilter === "" || status === statusFilter;

    row.style.display = (matchesSearch && matchesType && matchesStatus) ? "" : "none";
  });
}

// Filter Technicians
function filterTechnicians() {
  const searchTerm = document.getElementById("techSearch").value.toLowerCase();
  const verificationFilter = document.getElementById("verificationFilter").value;

  const tableBody = document.querySelector("#techniciansTable tbody");
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach(row => {
    const name = row.cells[1].textContent.toLowerCase();
    const status = row.cells[4].textContent.toLowerCase();

    const matchesSearch = name.includes(searchTerm);
    const matchesVerification = verificationFilter === "" ||
      (verificationFilter === "verified" && status === "verified") ||
      (verificationFilter === "pending" && status === "pending") ||
      (verificationFilter === "unverified" && status === "unverified");

    row.style.display = (matchesSearch && matchesVerification) ? "" : "none";
  });
}

// Filter Bookings
function filterBookings() {
  const searchTerm = document.getElementById("bookingSearch").value.toLowerCase();
  const statusFilter = document.getElementById("bookingStatusFilter").value;

  const tableBody = document.querySelector("#bookingsTable tbody");
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach(row => {
    const customer = row.cells[1].textContent.toLowerCase();
    const technician = row.cells[2].textContent.toLowerCase();
    const service = row.cells[3].textContent.toLowerCase();
    const status = row.cells[5].textContent.toLowerCase();

    const matchesSearch = customer.includes(searchTerm) ||
                         technician.includes(searchTerm) ||
                         service.includes(searchTerm);
    const matchesStatus = statusFilter === "" || status.includes(statusFilter);

    row.style.display = (matchesSearch && matchesStatus) ? "" : "none";
  });
}

// Filter Payments
function filterPayments() {
  const searchTerm = document.getElementById("paymentSearch").value.toLowerCase();
  const statusFilter = document.getElementById("paymentStatusFilter").value;

  const tableBody = document.querySelector("#paymentsTable tbody");
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach(row => {
    const customer = row.cells[2].textContent.toLowerCase();
    const status = row.cells[5].textContent.toLowerCase();

    const matchesSearch = customer.includes(searchTerm);
    const matchesStatus = statusFilter === "" || status === statusFilter;

    row.style.display = (matchesSearch && matchesStatus) ? "" : "none";
  });
}

// ======== ACTION FUNCTIONS ========

// User Actions
function viewUser(userId) {
  alert(`Viewing details for user ${userId}`);
  // In a real app, this would open a modal or navigate to user details page
}

function editUser(userId) {
  alert(`Editing user ${userId}`);
  // In a real app, this would open an edit form
}

function deactivateUser(userId) {
  if (confirm(`Are you sure you want to deactivate user ${userId}?`)) {
    alert(`User ${userId} has been deactivated`);
    // In a real app, this would make an API call
  }
}

// Technician Actions
function verifyTechnician(techId) {
  if (confirm(`Verify technician ${techId}?`)) {
    alert(`Technician ${techId} has been verified`);
    // In a real app, this would make an API call
  }
}

function rejectTechnician(techId) {
  if (confirm(`Reject technician ${techId}?`)) {
    alert(`Technician ${techId} has been rejected`);
    // In a real app, this would make an API call
  }
}

// Booking Actions
function confirmBooking(bookingId) {
  if (confirm(`Confirm booking ${bookingId}?`)) {
    alert(`Booking ${bookingId} has been confirmed`);
    // In a real app, this would make an API call
  }
}

function reassignBooking(bookingId) {
  alert(`Reassigning booking ${bookingId}`);
  // In a real app, this would open a technician selection modal
}

function cancelBooking(bookingId) {
  if (confirm(`Cancel booking ${bookingId}?`)) {
    alert(`Booking ${bookingId} has been cancelled`);
    // In a real app, this would make an API call
  }
}

// Payment Actions
function processRefund(paymentId) {
  const reason = prompt("Enter refund reason:");
  if (reason) {
    alert(`Refund processed for payment ${paymentId}`);
    // In a real app, this would make an API call
  }
}

// Message Actions
function replyToMessage(messageId) {
  const reply = prompt("Enter your reply:");
  if (reply) {
    alert(`Reply sent for message ${messageId}`);
    // In a real app, this would make an API call
  }
}

function resolveMessage(messageId) {
  if (confirm(`Resolve message ${messageId}?`)) {
    alert(`Message ${messageId} has been resolved`);
    // In a real app, this would make an API call
  }
}

// Settings Actions
function saveSettings() {
  if (confirm("Save settings changes?")) {
    alert("Settings saved successfully!");
    // In a real app, this would make an API call
  }
}

function resetSettings() {
  if (confirm("Reset all settings to defaults?")) {
    alert("Settings reset to defaults");
    // In a real app, this would make an API call
  }
}

// Report Generation
function generateReport(reportType) {
  alert(`Generating ${reportType} report...`);
  // In a real app, this would trigger report generation
  setTimeout(() => {
    alert(`${reportType} report generated successfully!`);
  }, 2000);
}

// ======== UTILITY FUNCTIONS ========

// Format Currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0
  }).format(amount);
}

// Format Date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Initialize Dashboard
document.addEventListener("DOMContentLoaded", () => {
  console.log("Admin Dashboard initialized");

  // Initialize header navigation
  const headerLinks = document.querySelectorAll("header .navbar a");
  headerLinks.forEach(link => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (href === "./index.html") {
        handleHeaderNavigation(event, "home");
      } else if (href === "./login.htm") {
        handleHeaderNavigation(event, "login");
      } else if (href === "./register.htm") {
        handleHeaderNavigation(event, "register");
      }
    });
  });

  // Any other initialization code can go here
});