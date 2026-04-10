// ======== DASHBOARD PAGE - JAVASCRIPT ========
// This file manages the main dashboard functionality
// Handles section navigation, profile dropdown, and interactive features

// ======== DOM ELEMENT REFERENCES ========
const sidebarItems = document.querySelectorAll(".sidebar-item");
const sections = document.querySelectorAll(".section");
const profileDropdown = document.querySelector(".profile-dropdown");
const dropdownMenu = document.querySelector(".dropdown-menu");
const notificationsBell = document.querySelector(".notifications-bell");
const mainContent = document.querySelector(".main-content");

// ======== SAMPLE USER DATA ========
const currentUser = {
  id: "USR001",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "client",
  avatar: "👤",
  phone: "+256 701 234 567",
  location: "Kampala, Uganda",
  joinedDate: "2024-01-15"
};

// ======== SAMPLE DASHBOARD DATA ========
const dashboardData = {
  overview: {
    activeBookings: 5,
    totalRating: 4.8,
    earnings: 850000,
    completedJobs: 45
  },
  bookings: [
    { id: "BK001", service: "Electrical Repair", date: "2024-04-10", status: "active", amount: 150000 },
    { id: "BK002", service: "Plumbing Maintenance", date: "2024-04-08", status: "completed", amount: 120000 },
    { id: "BK003", service: "General Fixes", date: "2024-04-05", status: "completed", amount: 85000 }
  ],
  messages: [
    { sender: "Ahmed Hassan", message: "I can start the work tomorrow", time: "10:30 AM" },
    { sender: "Sarah Kampala", message: "Payment received. Thank you!", time: "09:15 AM" }
  ],
  payments: [
    { date: "2024-04-08", amount: 250000, method: "Mobile Money", status: "completed" },
    { date: "2024-04-05", amount: 150000, method: "Card", status: "completed" }
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

// Notifications Click - Shows notifications (placeholder)
if (notificationsBell) {
  notificationsBell.addEventListener("click", () => {
    console.log("Notifications clicked");
    alert("You have 2 new notifications");
  });
}

// Window Click Outside Dropdown - Closes dropdown menu
window.addEventListener("click", (event) => {
  if (dropdownMenu && !profileDropdown.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.style.display = "none";
  }
});

// ======== RENDER FUNCTIONS ========

// Render Sidebar Navigation - Updates active section and item
function renderSidebarNavigation(itemId) {
  // Remove active class from all items
  sidebarItems.forEach((item) => {
    item.classList.remove("active");
  });
  
  // Add active class to clicked item
  const activeItem = document.querySelector(`[data-section="${itemId}"]`);
  if (activeItem) {
    activeItem.classList.add("active");
  }
  
  // Hide all sections
  sections.forEach((section) => {
    section.classList.remove("active");
  });
  
  // Show selected section
  const activeSection = document.getElementById(itemId);
  if (activeSection) {
    activeSection.classList.add("active");
  }
  
  console.log("Navigation to section:", itemId);
}

// Render Section Content - Populates section with data
function renderSectionContent(sectionId) {
  const section = document.getElementById(sectionId);
  
  if (!section) return;
  
  // Clear section content
  section.innerHTML = "";
  
  // Render section header
  const headerTitle = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
  const header = document.createElement("h2");
  header.textContent = headerTitle;
  section.appendChild(header);
  
  // Render content based on section
  switch (sectionId) {
    case "overview":
      renderOverviewSection(section);
      break;
    case "bookings":
      renderBookingsSection(section);
      break;
    case "messages":
      renderMessagesSection(section);
      break;
    case "payments":
      renderPaymentsSection(section);
      break;
    case "profile":
      renderProfileSection(section);
      break;
    default:
      section.innerHTML += "<p>Welcome to the dashboard</p>";
  }
}

// Render Overview Section - Displays dashboard statistics
function renderOverviewSection(section) {
  const stats = dashboardData.overview;
  
  const statsHTML = `
    <div class="stats-container">
      <div class="stat-card">
        <div class="icon">📅</div>
        <h3>Active Bookings</h3>
        <div class="value">${stats.activeBookings}</div>
      </div>
      <div class="stat-card">
        <div class="icon">⭐</div>
        <h3>Average Rating</h3>
        <div class="value">${stats.totalRating}</div>
      </div>
      <div class="stat-card">
        <div class="icon">💰</div>
        <h3>Total Earnings</h3>
        <div class="value">UGX ${stats.earnings.toLocaleString()}</div>
      </div>
      <div class="stat-card">
        <div class="icon">✓</div>
        <h3>Completed Jobs</h3>
        <div class="value">${stats.completedJobs}</div>
      </div>
    </div>
  `;
  
  section.innerHTML += statsHTML;
}

// Render Bookings Section - Displays bookings table
function renderBookingsSection(section) {
  const bookings = dashboardData.bookings;
  
  let tableHTML = "<table>";
  tableHTML += "<thead><tr><th>Booking ID</th><th>Service</th><th>Date</th><th>Status</th><th>Amount</th><th>Actions</th></tr></thead>";
  tableHTML += "<tbody>";
  
  // Loop through bookings and create table rows
  bookings.forEach((booking) => {
    const statusClass = booking.status === "active" ? "active" : "completed";
    tableHTML += `
      <tr>
        <td><strong>${booking.id}</strong></td>
        <td>${booking.service}</td>
        <td>${booking.date}</td>
        <td><span style="padding: 4px 8px; border-radius: 4px; background: ${booking.status === 'active' ? '#d4edda' : '#e2e3e5'}; color: ${booking.status === 'active' ? '#155724' : '#383d41'};">${booking.status}</span></td>
        <td>UGX ${booking.amount.toLocaleString()}</td>
        <td>
          <button class="btn-sm btn-primary">View</button>
          <button class="btn-sm btn-danger">Cancel</button>
        </td>
      </tr>
    `;
  });
  
  tableHTML += "</tbody></table>";
  section.innerHTML += tableHTML;
}

// Render Messages Section - Displays messages list
function renderMessagesSection(section) {
  const messages = dashboardData.messages;
  
  let messagesHTML = "<div style='display: grid; gap: 1rem;'>";
  
  messages.forEach((msg) => {
    messagesHTML += `
      <div style="background: #f8f9fa; padding: 1rem; border-radius: 4px; border-left: 4px solid #1550cf;">
        <strong>${msg.sender}</strong>
        <p>${msg.message}</p>
        <small style="color: #666;">${msg.time}</small>
      </div>
    `;
  });
  
  messagesHTML += "</div>";
  section.innerHTML += messagesHTML;
}

// Render Payments Section - Displays payment history
function renderPaymentsSection(section) {
  const payments = dashboardData.payments;
  
  let tableHTML = "<table>";
  tableHTML += "<thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>";
  tableHTML += "<tbody>";
  
  payments.forEach((payment) => {
    tableHTML += `
      <tr>
        <td>${payment.date}</td>
        <td>UGX ${payment.amount.toLocaleString()}</td>
        <td>${payment.method}</td>
        <td><span style="padding: 4px 8px; background: #d4edda; color: #155724; border-radius: 4px;">${payment.status}</span></td>
      </tr>
    `;
  });
  
  tableHTML += "</tbody></table>";
  section.innerHTML += tableHTML;
}

// Render Profile Section - Displays user profile information
function renderProfileSection(section) {
  const user = currentUser;
  
  const profileHTML = `
    <div style="max-width: 500px;">
      <div style="text-align: center; margin-bottom: 2rem;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">${user.avatar}</div>
        <h3>${user.name}</h3>
        <p style="color: #666;">${user.role}</p>
      </div>
      <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px;">
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Location:</strong> ${user.location}</p>
        <p><strong>Member Since:</strong> ${user.joinedDate}</p>
        <button class="btn btn-primary" style="margin-top: 1rem; width: 100%;">Edit Profile</button>
      </div>
    </div>
  `;
  
  section.innerHTML += profileHTML;
}

// Render Profile Dropdown - Shows/hides profile menu
function renderProfileDropdown() {
  if (dropdownMenu) {
    const isVisible = dropdownMenu.style.display === "block";
    dropdownMenu.style.display = isVisible ? "none" : "block";
  }
}

// ======== NAVIGATION HANDLERS ========

// Handle Sidebar Navigation - Processes sidebar item clicks
function handleSidebarNavigation(item) {
  const sectionId = item.getAttribute("data-section");
  
  if (sectionId) {
    // Update UI
    renderSidebarNavigation(sectionId);
    
    // Render section content
    renderSectionContent(sectionId);
    
    // Scroll to content
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }
}

// Handle Logout - Logs user out and redirects
function handleLogout() {
  // Clear user session data
  localStorage.removeItem("savedEmail");
  localStorage.removeItem("savedRole");
  localStorage.removeItem("userToken");
  
  console.log("User logged out");
  
  // Redirect to login page
  alert("You have been logged out.");
  window.location.href = "login.htm";
}

// ======== INITIALIZATION ========

// Initialize Dashboard - Runs on page load
window.addEventListener("load", () => {
  console.log("Dashboard loaded for user:", currentUser.name);
  
  // Set up default section
  const defaultSection = "overview";
  renderSidebarNavigation(defaultSection);
  renderSectionContent(defaultSection);
  
  // Update user info in header
  const userNameElement = document.querySelector(".profile-dropdown");
  if (userNameElement) {
    userNameElement.textContent = currentUser.name;
  }
});

// ======== UTILITY FUNCTIONS ========

// Get User Data - Retrieves current user information
function getUserData() {
  return currentUser;
}

// Update Dashboard Data - Refreshes dashboard statistics
function updateDashboardData(newData) {
  Object.assign(dashboardData, newData);
  console.log("Dashboard data updated:", dashboardData);
  
  // Re-render current section
  const activeSection = document.querySelector(".section.active");
  if (activeSection) {
    renderSectionContent(activeSection.id);
  }
}
