/* ============================================================================
   ServiceHub UG - Main JavaScript Application
   
   Modular, scalable frontend logic for technician appointment platform
   Handles: forms, booking, technician listing, dashboard, real-time updates
   ============================================================================ */

// ============================================================================
// 1. TEMPORARY DATA LAYER
//
// Simulated database - will be replaced with API calls later
// ============================================================================

/* All technicians in the system - currently hardcoded for demo */
const techniciansData = [
  {
    id: 1,
    name: "John Ssengoba",
    skill: "Plumbing",
    location: "Kampala",
    status: "online",           /* online | busy | offline */
    rating: 4.8,
    reviews: 156,
    pricing: "15,000 UGX/hour"
  },
  {
    id: 2,
    name: "Sarah Mutesi",
    skill: "Electrical",
    location: "Entebbe",
    status: "online",
    rating: 4.9,
    reviews: 203,
    pricing: "20,000 UGX/hour"
  },
  {
    id: 3,
    name: "David Mukama",
    skill: "HVAC",
    location: "Kampala",
    status: "busy",
    rating: 4.7,
    reviews: 98,
    pricing: "18,000 UGX/hour"
  },
  {
    id: 4,
    name: "Grace Nakato",
    skill: "Carpentry",
    location: "Jinja",
    status: "offline",
    rating: 4.6,
    reviews: 145,
    pricing: "12,000 UGX/hour"
  },
  {
    id: 5,
    name: "Peter Okocha",
    skill: "Plumbing",
    location: "Kampala",
    status: "online",
    rating: 4.5,
    reviews: 87,
    pricing: "14,000 UGX/hour"
  }
];

/* Current logged-in user (will come from backend after login) */
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

/* Current booking being made */
let currentBooking = {};

/* ============================================================================
   2. DOM SELECTORS & REFERENCES
   
   Organized by feature/section for easy access and maintenance
   ============================================================================ */

const DOM = {
  /* ===== Navigation Elements ===== */
  navbar: document.querySelector('.navbar'),
  navLinks: document.querySelectorAll('.navbar a'),
  
  /* ===== Form Elements ===== */
  loginForm: document.getElementById('loginForm'),
  registerForm: document.getElementById('registerForm'),
  bookingForm: document.getElementById('bookingForm'),
  techFieldsDiv: document.getElementById('techFields'),
  roleSelect: document.getElementById('role'),
  
  /* ===== Technician Listing Page ===== */
  searchInput: document.getElementById('search'),
  techList: document.getElementById('techList'),
  
  /* ===== Dashboard Page ===== */
  dashboard: document.getElementById('dashboard'),
  
  /* ===== Payment Page ===== */
  payNowBtn: document.querySelector('button[onclick="payNow()"]')
};

// ============================================================================
// 3. UTILITY FUNCTIONS
//
// Reusable helper functions for common tasks
// ============================================================================

/**
 * Display loading state on a button
 * @param {HTMLElement} button - The button to show loading state on
 * @param {boolean} isLoading - True to show loading, false to restore
 */
function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.disabled = true;           /* Prevent duplicate submissions */
    button.textContent = 'Loading...'; /* Show loading text */
    button.style.opacity = '0.6';      /* Dim the button */
  } else {
    button.disabled = false;           /* Re-enable the button */
    button.textContent = 'Submit';     /* Restore original text */
    button.style.opacity = '1';        /* Restore original appearance */
  }
}

/**
 * Show a temporary message to user
 * @param {string} message - The message to display
 * @param {string} type - 'success' | 'error' | 'info'
 * @param {number} duration - How long to show (milliseconds)
 */
function showMessage(message, type = 'info', duration = 3000) {
  /* Create message element */
  const msgEl = document.createElement('div');
  msgEl.textContent = message;
  msgEl.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B5998'};
    color: white;
    border-radius: 8px;
    z-index: 9999;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    animation: slideIn 0.3s ease;
  `;
  
  /* Add to page */
  document.body.appendChild(msgEl);
  
  /* Remove after duration */
  setTimeout(() => {
    msgEl.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => msgEl.remove(), 300);
  }, duration);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; /* Basic email pattern */
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} - True if password is at least 6 characters
 */
function isValidPassword(password) {
  return password && password.length >= 6;
}

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
  const d = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
}

/**
 * Generate unique ID
 * @returns {string} - Unique ID
 */
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// ============================================================================
// 4. AUTHENTICATION FUNCTIONS
//
// Handle user login, registration, logout
// ============================================================================

/**
 * Handle login form submission
 * @param {Event} event - Form submit event
 */
function handleLogin(event) {
  event.preventDefault();              /* Prevent page reload */
  
  /* Get form values */
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;
  
  /* Validate inputs */
  if (!email || !password) {
    showMessage('Email and password required', 'error');
    return;
  }
  
  if (!isValidEmail(email)) {
    showMessage('Invalid email format', 'error');
    return;
  }
  
  /* Simulate API call */
  setButtonLoading(DOM.loginForm.querySelector('button'), true);
  
  setTimeout(() => {
    /* Create user object */
    const user = {
      id: generateId(),
      email: email,
      role: role,
      loginTime: new Date()
    };
    
    /* Save to localStorage and global state */
    localStorage.setItem('currentUser', JSON.stringify(user));
    currentUser = user;
    
    /* Show success and redirect */
    showMessage(`Welcome back, ${role}!`, 'success');
    setTimeout(() => {
      window.location.href = role === 'technician' 
        ? '/Front end/HTML/dashboard.html' 
        : '/Front end/HTML/technicians.html';
    }, 1500);
    
    setButtonLoading(DOM.loginForm.querySelector('button'), false);
  }, 1500);
}

/**
 * Handle registration form submission
 * @param {Event} event - Form submit event
 */
function handleRegister(event) {
  event.preventDefault();              /* Prevent page reload */
  
  /* Get form values */
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;
  
  /* Validate basic inputs */
  if (!name || !email || !password) {
    showMessage('All fields required', 'error');
    return;
  }
  
  if (!isValidEmail(email)) {
    showMessage('Invalid email format', 'error');
    return;
  }
  
  if (!isValidPassword(password)) {
    showMessage('Password must be at least 6 characters', 'error');
    return;
  }
  
  /* For technicians, validate additional fields */
  if (role === 'technician') {
    const skill = document.getElementById('skill').value.trim();
    const location = document.getElementById('location').value.trim();
    
    if (!skill || !location) {
      showMessage('Skill and location required for technicians', 'error');
      return;
    }
  }
  
  /* Simulate API call */
  setButtonLoading(DOM.registerForm.querySelector('button'), true);
  
  setTimeout(() => {
    /* Create user object */
    const newUser = {
      id: generateId(),
      name: name,
      email: email,
      role: role,
      registeredAt: new Date()
    };
    
    if (role === 'technician') {
      newUser.skill = document.getElementById('skill').value;
      newUser.location = document.getElementById('location').value;
    }
    
    /* Save to localStorage */
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    currentUser = newUser;
    
    /* Show success and redirect */
    showMessage('Registration successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = '/Front end/HTML/login.html';
    }, 1500);
    
    setButtonLoading(DOM.registerForm.querySelector('button'), false);
  }, 1500);
}

/**
 * Handle user logout
 */
function handleLogout() {
  localStorage.removeItem('currentUser');
  currentUser = null;
  showMessage('Logged out successfully', 'success');
  setTimeout(() => {
    window.location.href = '/Front end/HTML/index.html';
  }, 1500);
}

// ============================================================================
// 5. TECHNICIAN LISTING & SEARCH
//
// Display technicians, filter by skill/location, search
// ============================================================================

/**
 * Render a single technician card
 * @param {Object} tech - Technician object
 * @returns {HTMLElement}
 */
function createTechnicianCard(tech) {
  /* Create card container */
  const card = document.createElement('div');
  card.className = 'card technician-card';
  
  /* Status badge color mapping */
  const statusClass = `technician-card__status--${tech.status}`;
  const statusText = tech.status.charAt(0).toUpperCase() + tech.status.slice(1);
  
  /* Build card HTML */
  card.innerHTML = `
    <!-- Avatar circle -->
    <div class="technician-card__avatar">
      ${tech.name.charAt(0)}
    </div>
    
    <!-- Technician name -->
    <div class="technician-card__name">
      ${tech.name}
    </div>
    
    <!-- Skill/profession -->
    <div class="technician-card__skill">
      ${tech.skill}
    </div>
    
    <!-- Location -->
    <div class="technician-card__location">
      📍 ${tech.location}
    </div>
    
    <!-- Star rating -->
    <div class="technician-card__rating">
      ⭐ ${tech.rating} (${tech.reviews} reviews)
    </div>
    
    <!-- Status badge -->
    <span class="technician-card__status ${statusClass}">
      ● ${statusText}
    </span>
    
    <!-- Pricing and book button -->
    <div style="margin-top: 16px; text-align: center;">
      <p style="color: #6B7280; font-size: 14px; margin-bottom: 12px;">
        ${tech.pricing}
      </p>
      <button class="btn btn-primary" onclick="openBookingModal(${tech.id})">
        Book Now
      </button>
    </div>
  `;
  
  return card;
}

/**
 * Render all technicians or filtered list
 * @param {Array} technicians - List of technician objects to display
 */
function renderTechnicians(technicians) {
  if (!DOM.techList) return;           /* Exit if not on technician page */
  
  DOM.techList.innerHTML = '';         /* Clear previous content */
  
  if (technicians.length === 0) {
    DOM.techList.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #6B7280;">
        <p>No technicians found. Try a different search.</p>
      </div>
    `;
    return;
  }
  
  /* Add card for each technician */
  technicians.forEach(tech => {
    const card = createTechnicianCard(tech);
    DOM.techList.appendChild(card);
  });
}

/**
 * Filter technicians by search term (skill or location)
 * @param {string} searchTerm - What user is searching for
 * @returns {Array} - Filtered technicians
 */
function filterTechnicians(searchTerm) {
  if (!searchTerm.trim()) {
    return techniciansData;            /* Return all if empty search */
  }
  
  const term = searchTerm.toLowerCase();
  
  /* Search in skill and location fields */
  return techniciansData.filter(tech =>
    tech.skill.toLowerCase().includes(term) ||
    tech.location.toLowerCase().includes(term)
  );
}

/**
 * Handle search input changes
 * @param {Event} event - Input change event
 */
function handleSearch(event) {
  const searchTerm = event.target.value;
  const filtered = filterTechnicians(searchTerm);
  renderTechnicians(filtered);         /* Update display */
}

// ============================================================================
// 6. BOOKING SYSTEM
//
// Handle booking modal, form submission, appointment creation
// ============================================================================

/**
 * Open booking modal and prepare form
 * @param {number} technicianId - ID of technician to book
 */
function openBookingModal(technicianId) {
  if (!currentUser) {
    showMessage('Please login first', 'error');
    setTimeout(() => {
      window.location.href = '/Front end/HTML/login.html';
    }, 1500);
    return;
  }
  
  /* Find technician details */
  const technician = techniciansData.find(t => t.id === technicianId);
  if (!technician) return;
  
  /* Store booking reference */
  currentBooking = {
    technicianId: technicianId,
    technicianName: technician.name,
    technicianSkill: technician.skill
  };
  
  /* If on booking page, pre-fill technician name */
  if (DOM.bookingForm) {
    const techInput = DOM.bookingForm.querySelector('#tech');
    if (techInput) {
      techInput.value = technician.name;
    }
  } else {
    /* If not on booking page, redirect to it */
    window.location.href = '/Front end/HTML/booking.html';
  }
}

/**
 * Handle booking form submission
 * @param {Event} event - Form submit event
 */
function handleBooking(event) {
  event.preventDefault();              /* Prevent page reload */
  
  /* Get form values */
  const techName = document.getElementById('tech').value.trim();
  const bookingDate = document.getElementById('date').value;
  
  /* Validation */
  if (!techName || !bookingDate) {
    showMessage('Please fill in all fields', 'error');
    return;
  }
  
  if (!currentUser) {
    showMessage('Please login first', 'error');
    return;
  }
  
  /* Simulate API call to save booking */
  setButtonLoading(DOM.bookingForm.querySelector('button'), true);
  
  setTimeout(() => {
    /* Create booking object */
    const booking = {
      id: generateId(),
      userId: currentUser.id,
      technicianName: techName,
      bookingDate: bookingDate,
      status: 'confirmed',
      createdAt: new Date()
    };
    
    /* Save to localStorage */
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    /* Show success and redirect */
    showMessage('Booking confirmed! Proceeding to payment...', 'success');
    setTimeout(() => {
      window.location.href = '/Front end/HTML/payment.html';
    }, 1500);
    
    setButtonLoading(DOM.bookingForm.querySelector('button'), false);
  }, 1200);
}

// ============================================================================
// 7. FORM HANDLING
//
// Connect form submissions and manage conditional form fields
// ============================================================================

/**
 * Show/hide technician-specific fields based on role selection
 * @param {Event} event - Select change event
 */
function handleRoleChange(event) {
  if (!DOM.techFieldsDiv) return;      /* Exit if not on register page */
  
  const role = event.target.value;
  
  /* Show technician fields only if role is 'technician' */
  if (role === 'technician') {
    DOM.techFieldsDiv.style.display = 'block';
    
    /* Make fields required */
    DOM.techFieldsDiv.querySelector('#skill').required = true;
    DOM.techFieldsDiv.querySelector('#location').required = true;
  } else {
    DOM.techFieldsDiv.style.display = 'none';
    
    /* Remove required */
    DOM.techFieldsDiv.querySelector('#skill').required = false;
    DOM.techFieldsDiv.querySelector('#location').required = false;
  }
}

// ============================================================================
// 8. DASHBOARD
//
// Display user dashboard, stats, and interactive elements
// ============================================================================

/**
 * Render user dashboard with stats and bookings
 */
function renderDashboard() {
  if (!DOM.dashboard) return;          /* Exit if not on dashboard page */
  
  if (!currentUser) {
    DOM.dashboard.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #6B7280;">
        <p>Please <a href="/Front end/HTML/login.html" style="color: #1E3A8A;">login</a> to view dashboard</p>
      </div>
    `;
    return;
  }
  
  /* Get user's bookings */
  const allBookings = JSON.parse(localStorage.getItem('bookings')) || [];
  const userBookings = allBookings.filter(b => b.userId === currentUser.id);
  
  /* Build dashboard HTML */
  DOM.dashboard.innerHTML = `
    <nav class="navbar">
      <h1>ServiceHub UG</h1>
      <div>
        <a href="/Front end/HTML/index.html">Home</a>
        <a href="/Front end/HTML/technicians.html">Browse</a>
        <button onclick="handleLogout()" style="background: #EF4444; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;">Logout</button>
      </div>
    </nav>
    
    <div class="dashboard">
      <!-- User Profile Section -->
      <div class="dashboard__section">
        <h2>👤 My Profile</h2>
        <div class="dashboard__grid">
          <div class="dashboard__stat">
            <div class="dashboard__stat-label">Name</div>
            <div class="dashboard__stat-value" style="font-size: 20px;">${currentUser.name || currentUser.email}</div>
          </div>
          <div class="dashboard__stat">
            <div class="dashboard__stat-label">Role</div>
            <div class="dashboard__stat-value" style="font-size: 20px; text-transform: capitalize;">${currentUser.role}</div>
          </div>
          <div class="dashboard__stat">
            <div class="dashboard__stat-label">Member Since</div>
            <div class="dashboard__stat-value" style="font-size: 16px;">${formatDate(currentUser.registeredAt || new Date())}</div>
          </div>
          <div class="dashboard__stat">
            <div class="dashboard__stat-label">Status</div>
            <div class="dashboard__stat-value" style="font-size: 20px;">✅ Active</div>
          </div>
        </div>
      </div>
      
      <!-- Bookings Section -->
      <div class="dashboard__section">
        <h2>📅 My Appointments</h2>
        ${userBookings.length > 0 
          ? `
            <div style="display: grid; gap: 16px;">
              ${userBookings.map(booking => `
                <div class="card" style="border-left: 4px solid #1E3A8A;">
                  <h3>${booking.technicianName}</h3>
                  <p>📅 Date: ${formatDate(booking.bookingDate)}</p>
                  <p>Status: <span style="color: #10B981; font-weight: bold;">✓ ${booking.status}</span></p>
                </div>
              `).join('')}
            </div>
          `
          : `
            <div class="card" style="text-align: center; color: #6B7280;">
              <p>No appointments yet. <a href="/Front end/HTML/technicians.html" style="color: #1E3A8A;">Book now</a></p>
            </div>
          `
        }
      </div>
      
      <!-- Statistics -->
      <div class="dashboard__section">
        <h2>📊 Statistics</h2>
        <div class="dashboard__grid">
          <div class="dashboard__stat">
            <div class="dashboard__stat-label">Total Bookings</div>
            <div class="dashboard__stat-value">${userBookings.length}</div>
          </div>
          <div class="dashboard__stat">
            <div class="dashboard__stat-label">Completed</div>
            <div class="dashboard__stat-value">${userBookings.filter(b => b.status === 'completed').length}</div>
          </div>
          <div class="dashboard__stat">
            <div class="dashboard__stat-label">Pending</div>
            <div class="dashboard__stat-value">${userBookings.filter(b => b.status === 'confirmed').length}</div>
          </div>
          <div class="dashboard__stat">
            <div class="dashboard__stat-label">Average Rating</div>
            <div class="dashboard__stat-value">4.8⭐</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// 9. REAL-TIME STATUS UPDATES
//
// Simulate technician status changes (online, busy, offline)
// ============================================================================

/**
 * Simulate real-time status updates
 * In production, this would connect to WebSocket or Firebase
 */
function simulateStatusUpdates() {
  /* Update technician status every 10 seconds */
  setInterval(() => {
    /* Randomly change a technician's status */
    const randomIndex = Math.floor(Math.random() * techniciansData.length);
    const statuses = ['online', 'busy', 'offline'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    techniciansData[randomIndex].status = randomStatus;
    
    /* If on technician page, update display */
    if (DOM.searchInput && DOM.techList) {
      const searchTerm = DOM.searchInput.value;
      const filtered = filterTechnicians(searchTerm);
      renderTechnicians(filtered);
    }
  }, 10000);                           /* Update every 10 seconds */
}

// ============================================================================
// 10. NAVIGATION & SMOOTH SCROLLING
//
// Handle navigation clicks and smooth page transitions
// ============================================================================

/**
 * Handle navigation link clicks
 * @param {Event} event - Click event
 */
function handleNavClick(event) {
  const href = event.target.getAttribute('href');
  
  /* Only handle internal links */
  if (href && href.startsWith('/')) {
    event.preventDefault();
    window.location.href = href;
  }
}

/**
 * Enable smooth scrolling for anchor links
 */
function enableSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
      event.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ============================================================================
// 11. INITIALIZATION
//
// Set up all event listeners and initialize the application
// ============================================================================

/**
 * Initialize event listeners
 * Called when DOM is fully loaded
 */
function initializeEventListeners() {
  /* Login Form */
  if (DOM.loginForm) {
    DOM.loginForm.addEventListener('submit', handleLogin);
  }
  
  /* Register Form */
  if (DOM.registerForm) {
    DOM.registerForm.addEventListener('submit', handleRegister);
    
    /* Role selection for conditional fields */
    if (DOM.roleSelect) {
      DOM.roleSelect.addEventListener('change', handleRoleChange);
    }
  }
  
  /* Booking Form */
  if (DOM.bookingForm) {
    DOM.bookingForm.addEventListener('submit', handleBooking);
  }
  
  /* Search Input */
  if (DOM.searchInput) {
    DOM.searchInput.addEventListener('input', handleSearch);
    renderTechnicians(techniciansData);  /* Initial render */
  }
  
  /* Dashboard */
  if (DOM.dashboard) {
    renderDashboard();
  }
  
  /* Navigation Links */
  if (DOM.navLinks.length > 0) {
    DOM.navLinks.forEach(link => {
      link.addEventListener('click', handleNavClick);
    });
  }
}

/**
 * Initialize the entire application
 * This runs once when the page loads
 */
function initializeApp() {
  /* Set up all event listeners */
  initializeEventListeners();
  
  /* Enable smooth scrolling */
  enableSmoothScrolling();
  
  /* Start status simulations */
  simulateStatusUpdates();
  
  console.log('✅ ServiceHub UG initialized successfully');
}

// ============================================================================
// 12. STARTUP
//
// Run initialization when DOM is ready
// ============================================================================

/* Wait for DOM to be fully loaded before running */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  /* DOM already loaded (script loaded after page) */
  initializeApp();
}

/* ============================================================================
   END OF APPLICATION
   
   Key Features Implemented:
   ✓ User authentication (login/register)
   ✓ Technician listing with search/filter
   ✓ Booking system
   ✓ Form validation
   ✓ Dashboard with stats
   ✓ Real-time status simulation
   ✓ LocalStorage persistence
   ✓ Smooth navigation
   ✓ User feedback messages
   
   Ready to connect to backend API by replacing:
   - techniciansData array with API fetch
   - localStorage with actual database
   - setTimeout simulations with real-time WebSocket updates
   ============================================================================ */
