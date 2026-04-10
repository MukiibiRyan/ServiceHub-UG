// ======== HOME/INDEX PAGE - JAVASCRIPT ========
// This file handles interactive features on the homepage
// Manages search functionality, smooth scrolling, and dynamic content

// ======== DOM ELEMENT REFERENCES ========
const searchInput = document.querySelector(".search-container input");
const searchButton = document.querySelector(".search-container button");
const heroSection = document.querySelector(".hero");
const featuresSection = document.querySelector(".features");
const howItWorksSection = document.querySelector(".how-it-works");
const testimonialsSection = document.querySelector(".testimonials");

// ======== EVENT LISTENERS ========

// Search Button Click - Handles search functionality
if (searchButton) {
  searchButton.addEventListener("click", () => {
    handleSearch();
  });
}

// Search Input Enter Key - Submits search when Enter is pressed
if (searchInput) {
  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  });
}

// Smooth Scroll for Navigation Links - Smooth scroll to sections
document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetId = link.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ======== RENDER FUNCTIONS ========

// Render Search Results - Displays search results based on query
function renderSearchResults(query) {
  console.log("Searching for technicians with keywords:", query);
  
  // Create search results data structure
  const searchData = {
    query: query,
    filters: {
      serviceType: "", // Can be extended
      location: "",    // Can be extended
      rating: ""       // Can be extended
    }
  };
  
  // Log search data (for API integration)
  console.log("Search Data:", searchData);
  
  // TODO: Make API call to backend
  // fetch(`/api/technicians/search?q=${encodeURIComponent(query)}`)
  // .then(response => response.json())
  // .then(data => {
  //   console.log("Search results:", data);
  //   displaySearchResults(data);
  // })
  // .catch(error => console.error("Search error:", error));
  
  // Redirect to technicians page with search query
  window.location.href = `technicians.htm?search=${encodeURIComponent(query)}`;
}

// Render Intersection Observer - Adds animations to elements as they enter viewport
function renderIntersectionObserver() {
  // Create observer to detect when elements become visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Add animation class when element enters viewport
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of element is visible
  });
  
  // Observe all feature cards
  document.querySelectorAll(".card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });
}

// ======== SEARCH FUNCTIONALITY ========

// Handle Search - Processes search query and redirects
function handleSearch() {
  const query = searchInput.value.trim();
  
  // Validate search input
  if (!query) {
    alert("Please enter a service or skill to search for.");
    searchInput.focus();
    return;
  }
  
  // A search query must be at least 2 characters
  if (query.length < 2) {
    alert("Please enter at least 2 characters to search.");
    return;
  }
  
  // Render search results (redirect to technicians page)
  renderSearchResults(query);
}

// ======== CALL-TO-ACTION HANDLERS ========

// Handle How It Works Navigation - Scrolls to How It Works section
function handleHowItWorksClick() {
  if (howItWorksSection) {
    howItWorksSection.scrollIntoView({ behavior: "smooth" });
  }
}

// Handle Get Started Click - Redirects to registration or technicians page
function handleGetStartedClick(role) {
  if (role === "client") {
    // Redirect to register page for clients
    window.location.href = "register.htm";
  } else if (role === "technician") {
    // Redirect to register page for technicians
    window.location.href = "register.htm";
  } else {
    // Default: go to technicians page to browse
    window.location.href = "technicians.htm";
  }
}

// ======== INITIALIZATION ========

// Initialize Page - Runs on page load
window.addEventListener("load", () => {
  console.log("Home page loaded successfully");
  
  // Initialize intersection observer for animations
  renderIntersectionObserver();
  
  // Add click handlers to CTA buttons if they exist
  const ctaButtons = document.querySelectorAll("[data-action]");
  ctaButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const action = button.getAttribute("data-action");
      const role = button.getAttribute("data-role");
      
      if (action === "search") {
        handleSearch();
      } else if (action === "get-started") {
        handleGetStartedClick(role);
      }
    });
  });
});

// ======== UTILITY FUNCTIONS ========

// Scroll to Top - Returns user to top of page smoothly
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Log Page Analytics - Tracks user interactions (for analytics)
function logPageAnalytics(eventName, eventData) {
  console.log(`Analytics Event: ${eventName}`, eventData);
  
  // TODO: Send to analytics service
  // Example:
  // if (window.analytics) {
  //   window.analytics.track(eventName, eventData);
  // }
}
