// ======== BOOKING PAGE - JAVASCRIPT ========
// This file manages the service booking form
// Handles form validation, field visibility, booking ID generation, and submission

// ======== DOM ELEMENT REFERENCES ========
const bookingForm = document.getElementById("bookingForm");
const customerName = document.getElementById("customerName");
const customerEmail = document.getElementById("customerEmail");
const customerPhone = document.getElementById("customerPhone");
const serviceType = document.getElementById("serviceType");
const serviceDescription = document.getElementById("serviceDescription");
const preferredSkills = document.getElementById("preferredSkills");
const address = document.getElementById("address");
const area = document.getElementById("area");
const landmark = document.getElementById("landmark");
const bookingDate = document.getElementById("bookingDate");
const timeWindow = document.getElementById("timeWindow");
const urgency = document.getElementById("urgency");
const budgetType = document.getElementById("budgetType");
const budgetRange = document.getElementById("budgetRange");
const budgetFixed = document.getElementById("budgetFixed");
const paymentMethod = document.getElementById("paymentMethod");
const additionalInfo = document.getElementById("additionalInfo");
const photoUpload = document.getElementById("photoUpload");
const termsCheckbox = document.getElementById("terms");
const confirmationMessage = document.getElementById("confirmationMessage");

// ======== EVENT LISTENERS ========

// Budget Type Change - Shows/hides appropriate budget input fields
if (budgetType) {
  budgetType.addEventListener("change", () => {
    renderBudgetFields();
  });
}

// Form Submission - Validates and processes booking
if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleBookingSubmission();
  });
}

// Photo Upload Change - Displays selected file name
if (photoUpload) {
  photoUpload.addEventListener("change", () => {
    renderPhotoUpload();
  });
}

// Set Minimum Date - Prevents booking dates in the past
window.addEventListener("load", () => {
  if (bookingDate) {
    // Set minimum date to today
    const today = new Date().toISOString().split("T")[0];
    bookingDate.setAttribute("min", today);
  }
});

// ======== RENDER FUNCTIONS ========

// Render Budget Fields - Shows/hides budget input based on selection
function renderBudgetFields() {
  const selected = budgetType.value;
  
  // Hide all budget fields
  if (budgetRange) budgetRange.style.display = "none";
  if (budgetFixed) budgetFixed.style.display = "none";
  
  // Show selected budget type
  if (selected === "range" && budgetRange) {
    budgetRange.style.display = "block";
  } else if (selected === "fixed" && budgetFixed) {
    budgetFixed.style.display = "block";
  }
}

// Render Photo Upload - Displays selected file information
function renderPhotoUpload() {
  const files = photoUpload.files;
  
  if (files.length > 0) {
    const fileName = files[0].name;
    const fileSize = (files[0].size / 1024).toFixed(2); // Convert to KB
    
    console.log(`File selected: ${fileName} (${fileSize} KB)`);
    
    // TODO: Display file preview or additional info
    // Example:
    // const preview = document.querySelector(".photo-preview");
    // if (preview) {
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     preview.src = e.target.result;
    //     preview.style.display = "block";
    //   };
    //   reader.readAsDataURL(files[0]);
    // }
  }
}

// Render Booking Confirmation - Displays success message with booking details
function renderConfirmation(bookingData) {
  if (confirmationMessage) {
    // Generate booking ID
    const bookingId = "BK" + Date.now();
    
    // Create confirmation HTML
    confirmationMessage.innerHTML = `
      <h3>✓ Booking Confirmed!</h3>
      <p><strong>Booking ID:</strong> ${bookingId}</p>
      <p><strong>Service:</strong> ${bookingData.serviceType}</p>
      <p><strong>Date:</strong> ${new Date(bookingData.date).toLocaleDateString()}</p>
      <p><strong>Technician will contact you shortly</strong></p>
      <a href="dashboard.htm" class="btn btn-primary" style="margin-top: 1rem;">View Booking</a>
    `;
    
    confirmationMessage.style.display = "block";
    confirmationMessage.scrollIntoView({ behavior: "smooth" });
    
    // Hide form after confirmation
    bookingForm.style.display = "none";
    
    // Redirect after 3 seconds
    setTimeout(() => {
      window.location.href = "dashboard.htm";
    }, 3000);
  }
}

// ======== VALIDATION FUNCTIONS ========

// Validate Email - Checks if email format is valid
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate Phone - Checks if phone number is valid
function validatePhone(phone) {
  const phoneRegex = /^[0-9+-\s()]{7,}$/;
  return phoneRegex.test(phone);
}

// Validate Booking Form - Checks all required fields
function validateBookingForm() {
  // Validate customer information
  if (!customerName.value.trim()) {
    return "Please enter your full name.";
  }
  
  if (!customerEmail.value.trim()) {
    return "Please enter your email address.";
  }
  
  if (!validateEmail(customerEmail.value)) {
    return "Please enter a valid email address.";
  }
  
  if (!customerPhone.value.trim()) {
    return "Please enter your phone number.";
  }
  
  if (!validatePhone(customerPhone.value)) {
    return "Please enter a valid phone number.";
  }
  
  // Validate service details
  if (!serviceType.value) {
    return "Please select a service type.";
  }
  
  if (!serviceDescription.value.trim()) {
    return "Please describe the service needed.";
  }
  
  // Validate location
  if (!address.value.trim()) {
    return "Please enter your street address.";
  }
  
  if (!area.value.trim()) {
    return "Please enter your area/location.";
  }
  
  // Validate scheduling
  if (!bookingDate.value) {
    return "Please select a booking date.";
  }
  
  if (!timeWindow.value) {
    return "Please select a preferred time window.";
  }
  
  // Validate budget
  if (!budgetType.value) {
    return "Please select a budget type.";
  }
  
  const minBudget = document.querySelector("input[name='minBudget']");
  const maxBudget = document.querySelector("input[name='maxBudget']");
  const fixedBudget = document.querySelector("input[name='fixedBudget']");
  
  if (budgetType.value === "range") {
    if (!minBudget || !minBudget.value) {
      return "Please enter minimum budget.";
    }
    if (!maxBudget || !maxBudget.value) {
      return "Please enter maximum budget.";
    }
  } else if (budgetType.value === "fixed") {
    if (!fixedBudget || !fixedBudget.value) {
      return "Please enter your budget.";
    }
  }
  
  // Validate payment method
  if (!paymentMethod.value) {
    return "Please select a payment method.";
  }
  
  // Validate terms acceptance
  if (!termsCheckbox.checked) {
    return "You must accept the terms and conditions.";
  }
  
  return null; // No errors
}

// ======== ERROR MESSAGE DISPLAY ========

// Show Error - Displays validation error messages
function showError(message) {
  const errorDiv = document.querySelector(".error-message");
  
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
    errorDiv.scrollIntoView({ behavior: "smooth" });
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
      errorDiv.style.display = "none";
    }, 5000);
  } else {
    // Fallback to alert if no error div exists
    alert("Error: " + message);
  }
}

// ======== FORM SUBMISSION HANDLER ========

// Handle Booking Submission - Validates and processes booking
function handleBookingSubmission() {
  // Validate all form fields
  const validationError = validateBookingForm();
  
  if (validationError) {
    showError(validationError);
    return;
  }
  
  // Collect booking data
  const bookingData = {
    customer: {
      name: customerName.value.trim(),
      email: customerEmail.value.trim(),
      phone: customerPhone.value.trim()
    },
    service: {
      type: serviceType.value,
      description: serviceDescription.value.trim(),
      preferredSkills: preferredSkills.value.trim()
    },
    location: {
      address: address.value.trim(),
      area: area.value.trim(),
      landmark: landmark.value.trim()
    },
    schedule: {
      date: bookingDate.value,
      timeWindow: timeWindow.value,
      urgency: urgency.value
    },
    budget: {
      type: budgetType.value,
      amount: budgetType.value === "range" 
        ? `${document.querySelector("input[name='minBudget']").value} - ${document.querySelector("input[name='maxBudget']").value}`
        : document.querySelector("input[name='fixedBudget']").value
    },
    payment: {
      method: paymentMethod.value
    },
    additionalInfo: additionalInfo.value.trim(),
    timestamp: new Date().toISOString()
  };
  
  // Log booking data (for testing)
  console.log("Booking Data:", bookingData);
  
  // TODO: Send to backend API
  // fetch('/api/bookings/create', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(bookingData)
  // })
  // .then(response => response.json())
  // .then(data => {
  //   if (data.success) {
  //     renderConfirmation(bookingData);
  //   } else {
  //     showError(data.message);
  //   }
  // })
  // .catch(error => {
  //   showError("An error occurred. Please try again.");
  //   console.error('Error:', error);
  // });
  
  // Show confirmation
  renderConfirmation(bookingData);
}

// ======== INITIALIZATION ========

// Initialize Booking Page - Runs on page load
window.addEventListener("load", () => {
  console.log("Booking page loaded");
  
  // Initialize budget fields
  renderBudgetFields();
  
  // Set minimum booking date
  const today = new Date().toISOString().split("T")[0];
  if (bookingDate) {
    bookingDate.setAttribute("min", today);
  }
});
