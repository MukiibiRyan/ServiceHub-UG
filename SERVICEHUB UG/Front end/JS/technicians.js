// ======== TECHNICIANS PAGE - JAVASCRIPT ========
// This file handles technician listing, filtering, and pagination
// Manages search, filters, sorting, and technician card rendering

// ======== DOM ELEMENT REFERENCES ========
const filterButton = document.getElementById("applyFilters");
const resetButton = document.getElementById("resetFilters");
const techniciansGrid = document.getElementById("techniciansGrid");
const filterInfo = document.getElementById("filterInfo");
const paginationContainer = document.querySelector(".pagination");
const searchInput = document.querySelector("input[placeholder='Search technicians...']");

// ======== FILTER AND SORT REFERENCES ========
const skillsCheckboxes = document.querySelectorAll("input[type='checkbox'][name='service']");
const locationSelect = document.getElementById("location");
const ratingSelect = document.getElementById("minRating");
const budgetSelect = document.getElementById("budget");
const availabilityCheckbox = document.getElementById("availability");
const sortSelect = document.getElementById("sortBy");

// ======== SAMPLE TECHNICIANS DATA ========
const techniciansDatabase = [
  {
    id: 1,
    name: "Ahmed Hassan",
    skills: ["Plumbing", "General"],
    location: "Kampala",
    rating: 4.9,
    reviews: 127,
    jobsDone: 312,
    hourlyRate: 85000,
    available: true,
    responseTime: "2 hours",
    avatar: "👨‍🔧"
  },
  {
    id: 2,
    name: "Sarah Kampala",
    skills: ["Electrical", "Painting"],
    location: "Kololo",
    rating: 4.7,
    reviews: 98,
    jobsDone: 256,
    hourlyRate: 75000,
    available: true,
    responseTime: "1 hour",
    avatar: "👩‍🔧"
  },
  {
    id: 3,
    name: "Moses Kiganda",
    skills: ["Carpentry", "Tiling"],
    location: "Makindye",
    rating: 4.8,
    reviews: 156,
    jobsDone: 421,
    hourlyRate: 95000,
    available: false,
    responseTime: "3 hours",
    avatar: "👨‍🔧"
  },
  {
    id: 4,
    name: "Jane Owino",
    skills: ["Plumbing", "HVAC"],
    location: "Entebbe",
    rating: 4.6,
    reviews: 87,
    jobsDone: 189,
    hourlyRate: 65000,
    available: true,
    responseTime: "2 hours",
    avatar: "👩‍🔧"
  },
  {
    id: 5,
    name: "Peter Mutua",
    skills: ["Electrical", "General"],
    location: "Wakiso",
    rating: 4.5,
    reviews: 64,
    jobsDone: 145,
    hourlyRate: 55000,
    available: true,
    responseTime: "4 hours",
    avatar: "👨‍🔧"
  },
  {
    id: 6,
    name: "Linda Kasibante",
    skills: ["Painting", "Carpentry"],
    location: "Kampala",
    rating: 4.8,
    reviews: 142,
    jobsDone: 298,
    hourlyRate: 80000,
    available: true,
    responseTime: "2.5 hours",
    avatar: "👩‍🔧"
  }
];

// ======== PAGINATION STATE ========
let currentPage = 1;
const itemsPerPage = 3;
let filteredTechnicians = [...techniciansDatabase];

// ======== EVENT LISTENERS ========

// Apply Filters Button - Applies all selected filters
if (filterButton) {
  filterButton.addEventListener("click", () => {
    handleApplyFilters();
  });
}

// Reset Filters Button - Clears all filters
if (resetButton) {
  resetButton.addEventListener("click", () => {
    handleResetFilters();
  });
}

// Sort Select Change - Changes technician sorting
if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    handleSortChange();
  });
}

// Search Input - Filters technicians by search query
if (searchInput) {
  searchInput.addEventListener("input", () => {
    handleSearchInput();
  });
}

// ======== RENDER FUNCTIONS ========

// Render Technicians Grid - Displays technician cards
function renderTechniciansGrid() {
  if (!techniciansGrid) return;
  
  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTechnicians = filteredTechnicians.slice(startIndex, endIndex);
  
  // Clear grid
  techniciansGrid.innerHTML = "";
  
  // Check if there are results
  if (paginatedTechnicians.length === 0) {
    renderEmptyState();
    return;
  }
  
  // Render each technician card
  paginatedTechnicians.forEach((technician) => {
    const card = createTechnicianCard(technician);
    techniciansGrid.appendChild(card);
  });
  
  // Update pagination
  renderPagination();
  
  // Update results info
  renderFilterInfo();
  
  console.log(`Displaying ${paginatedTechnicians.length} technicians on page ${currentPage}`);
}

// Create Technician Card - Creates a technician card element
function createTechnicianCard(technician) {
  const card = document.createElement("div");
  card.className = "technician-card";
  
  const availabilityBadge = technician.available
    ? '<div class="available-badge">Available Now</div>'
    : '<div class="unavailable-badge">Busy</div>';
  
  const skillsHTML = technician.skills
    .map((skill) => `<span class="skill-badge">${skill}</span>`)
    .join("");
  
  card.innerHTML = `
    <div class="tech-header">
      <div class="tech-avatar">${technician.avatar}</div>
      <div class="tech-info">
        <h3>${technician.name}</h3>
        <p class="experience">${technician.jobsDone} jobs completed</p>
      </div>
      ${availabilityBadge}
    </div>
    
    <div class="tech-skills">
      ${skillsHTML}
    </div>
    
    <div class="tech-stats">
      <div class="stat">
        <strong>${technician.rating}</strong>
        <p>${technician.reviews} reviews</p>
      </div>
      <div class="stat">
        <strong>${technician.jobsDone}</strong>
        <p>jobs done</p>
      </div>
      <div class="stat">
        <strong>UGX ${technician.hourlyRate.toLocaleString()}</strong>
        <p>/hour</p>
      </div>
    </div>
    
    <div class="tech-details">
      <p><i class="fas fa-map-marker-alt"></i> ${technician.location}</p>
      <p><i class="fas fa-clock"></i> ${technician.responseTime} response time</p>
    </div>
    
    <div class="tech-actions">
      <button class="btn-secondary" onclick="viewTechnicianProfile(${technician.id})">View Profile</button>
      <button class="btn-primary" onclick="bookTechnician(${technician.id})">Book Now</button>
      <button class="btn-light" onclick="viewReviews(${technician.id})">Reviews</button>
    </div>
  `;
  
  return card;
}

// Render Empty State - Shows message when no results found
function renderEmptyState() {
  techniciansGrid.innerHTML = `
    <div class="empty-state" style="grid-column: 1/-1;">
      <i class="fas fa-search" style="font-size: 4rem; color: #ddd; margin-bottom: 1rem; display: block;"></i>
      <h3>No technicians found</h3>
      <p>Try adjusting your filters to find more technicians</p>
    </div>
  `;
}

// Render Pagination - Creates pagination buttons
function renderPagination() {
  if (!paginationContainer) return;
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredTechnicians.length / itemsPerPage);
  
  // Clear pagination
  paginationContainer.innerHTML = "";
  
  // Previous button
  const prevButton = document.createElement("button");
  prevButton.textContent = "← Previous";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTechniciansGrid();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
  paginationContainer.appendChild(prevButton);
  
  // Page info
  const pageInfo = document.createElement("span");
  pageInfo.id = "pageInfo";
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  paginationContainer.appendChild(pageInfo);
  
  // Next button
  const nextButton = document.createElement("button");
  nextButton.textContent = "Next →";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTechniciansGrid();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
  paginationContainer.appendChild(nextButton);
}

// Render Filter Info - Shows current filter information
function renderFilterInfo() {
  if (!filterInfo) return;
  
  const appliedFilters = [];
  
  // Check applied filters
  skillsCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      appliedFilters.push(checkbox.value);
    }
  });
  
  if (locationSelect && locationSelect.value) {
    appliedFilters.push(`Location: ${locationSelect.value}`);
  }
  
  if (ratingSelect && ratingSelect.value) {
    appliedFilters.push(`Rating: ${ratingSelect.value}+`);
  }
  
  // Display filter info
  const resultCount = filteredTechnicians.length;
  let infoText = `Found ${resultCount} technician${resultCount !== 1 ? 's' : ''}`;
  
  if (appliedFilters.length > 0) {
    infoText += ` matching: ${appliedFilters.join(", ")}`;
  }
  
  filterInfo.textContent = infoText;
}

// ======== FILTER FUNCTIONS ========

// Apply Filters - Filters technicians based on selected criteria
function applyFiltersToData() {
  let filtered = [...techniciansDatabase];
  
  // Filter by skills
  const selectedSkills = Array.from(skillsCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
  
  if (selectedSkills.length > 0) {
    filtered = filtered.filter((tech) =>
      selectedSkills.some((skill) => tech.skills.includes(skill))
    );
  }
  
  // Filter by location
  if (locationSelect && locationSelect.value) {
    filtered = filtered.filter((tech) => tech.location === locationSelect.value);
  }
  
  // Filter by rating
  if (ratingSelect && ratingSelect.value) {
    const minRating = parseFloat(ratingSelect.value);
    filtered = filtered.filter((tech) => tech.rating >= minRating);
  }
  
  // Filter by budget
  if (budgetSelect && budgetSelect.value) {
    const budgetRanges = {
      "0-50k": 50000,
      "50-100k": [50000, 100000],
      "100-200k": [100000, 200000],
      "200k+": 200000
    };
    
    const budget = budgetSelect.value;
    if (budget === "0-50k") {
      filtered = filtered.filter((tech) => tech.hourlyRate <= budgetRanges["0-50k"]);
    }
  }
  
  // Filter by availability
  if (availabilityCheckbox && availabilityCheckbox.checked) {
    filtered = filtered.filter((tech) => tech.available);
  }
  
  return filtered;
}

// Handle Apply Filters - Applies all filters and resets pagination
function handleApplyFilters() {
  filteredTechnicians = applyFiltersToData();
  currentPage = 1; // Reset to first page
  renderTechniciansGrid();
  console.log("Filters applied. Found:", filteredTechnicians.length, "technicians");
}

// Handle Reset Filters - Clears all filters
function handleResetFilters() {
  // Uncheck all checkboxes
  skillsCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  
  // Reset select elements
  if (locationSelect) locationSelect.value = "";
  if (ratingSelect) ratingSelect.value = "";
  if (budgetSelect) budgetSelect.value = "";
  if (availabilityCheckbox) availabilityCheckbox.checked = false;
  
  // Reset filters
  filteredTechnicians = [...techniciansDatabase];
  currentPage = 1;
  renderTechniciansGrid();
  
  console.log("Filters reset");
}

// Handle Search Input - Filters by name or skill
function handleSearchInput() {
  const query = searchInput.value.trim().toLowerCase();
  
  if (!query) {
    filteredTechnicians = [...techniciansDatabase];
  } else {
    filteredTechnicians = techniciansDatabase.filter((tech) =>
      tech.name.toLowerCase().includes(query) ||
      tech.skills.some((skill) => skill.toLowerCase().includes(query))
    );
  }
  
  currentPage = 1;
  renderTechniciansGrid();
  
  console.log("Search query:", query, "Found:", filteredTechnicians.length);
}

// Handle Sort Change - Sorts technicians by selected criteria
function handleSortChange() {
  const sortBy = sortSelect.value;
  
  switch (sortBy) {
    case "rating":
      filteredTechnicians.sort((a, b) => b.rating - a.rating);
      break;
    case "price-low":
      filteredTechnicians.sort((a, b) => a.hourlyRate - b.hourlyRate);
      break;
    case "price-high":
      filteredTechnicians.sort((a, b) => b.hourlyRate - a.hourlyRate);
      break;
    case "experience":
      filteredTechnicians.sort((a, b) => b.jobsDone - a.jobsDone);
      break;
    case "newest":
      filteredTechnicians.sort((a, b) => b.id - a.id);
      break;
    default:
      filteredTechnicians.sort((a, b) => b.rating - a.rating);
  }
  
  currentPage = 1;
  renderTechniciansGrid();
  
  console.log("Sorted by:", sortBy);
}

// ======== ACTION HANDLERS ========

// View Technician Profile - Redirects to technician profile
function viewTechnicianProfile(technicianId) {
  const technician = techniciansDatabase.find((t) => t.id === technicianId);
  if (technician) {
    console.log("Viewing profile for:", technician.name);
    alert(`Viewing profile for ${technician.name}`);
    // TODO: Redirect to profile page
    // window.location.href = `technician-profile.htm?id=${technicianId}`;
  }
}

// Book Technician - Starts booking process
function bookTechnician(technicianId) {
  const technician = techniciansDatabase.find((t) => t.id === technicianId);
  if (technician) {
    console.log("Booking technician:", technician.name);
    // Redirect to booking page with technician ID
    window.location.href = `booking.htm?technicianId=${technicianId}`;
  }
}

// View Reviews - Shows technician reviews
function viewReviews(technicianId) {
  const technician = techniciansDatabase.find((t) => t.id === technicianId);
  if (technician) {
    console.log("Viewing reviews for:", technician.name);
    alert(`Viewing ${technician.reviews} reviews for ${technician.name}`);
    // TODO: Show reviews in modal or separate page
  }
}

// ======== INITIALIZATION ========

// Initialize Technicians Page - Runs on page load
window.addEventListener("load", () => {
  console.log("Technicians page loaded");
  
  // Render initial technicians list
  renderTechniciansGrid();
  
  // Check URL for search query
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("search");
  
  if (searchQuery && searchInput) {
    searchInput.value = searchQuery;
    handleSearchInput();
  }
});
