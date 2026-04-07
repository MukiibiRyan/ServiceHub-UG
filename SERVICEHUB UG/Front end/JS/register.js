// ======== REGISTER PAGE - JAVASCRIPT ========
// This file handles all functionality for the user registration form
// Manages form validation, conditional fields, password strength, and submission

// ======== DOM ELEMENT REFERENCES ========
// Get all form input elements
const registrationForm = document.getElementById("registrationForm");
const nameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dobInput = document.getElementById("dob");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const showPasswordCheckbox = document.getElementById("showPassword");
const roleSelect = document.getElementById("role");
const streetInput = document.getElementById("street");
const cityInput = document.getElementById("city");
const postalInput = document.getElementById("postalCode");
const termsCheckbox = document.getElementById("terms");

// Get technician-specific fields
const technicianSection = document.getElementById("technicianFields");
const skillsInput = document.getElementById("skills");
const experienceInput = document.getElementById("experience");
const hourlyRateInput = document.getElementById("hourlyRate");
const certInput = document.getElementById("certifications");

// Get client-specific fields
const clientSection = document.getElementById("clientFields");
const servicesInput = document.getElementById("servicePreferences");
const budgetInput = document.getElementById("budget");

// Get message containers
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");

// ======== EVENT LISTENERS ========

// Show/Hide Password Toggle - Switches between password and text input type
showPasswordCheckbox.addEventListener("change", () => {
  renderShowPassword();
});

// Role Selection Change - Shows/hides conditional fields based on role
roleSelect.addEventListener("change", () => {
  renderConditionalFields();
});

// Password Input Change - Updates password strength indicator
passwordInput.addEventListener("input", () => {
  renderPasswordStrength();
});

// Form Submission - Validates and processes registration
registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleFormSubmission();
});

// ======== RENDER FUNCTIONS ========

// Render Show/Hide Password - Updates input type based on checkbox
function renderShowPassword() {
  if (showPasswordCheckbox.checked) {
    passwordInput.type = "text"; // Show password as plain text
  } else {
    passwordInput.type = "password"; // Hide password with dots
  }
}

// Render Conditional Fields - Displays fields based on selected role
function renderConditionalFields() {
  const selectedRole = roleSelect.value;
  
  // Hide all conditional sections first
  technicianSection.style.display = "none";
  clientSection.style.display = "none";
  
  // Show relevant section based on role selection
  if (selectedRole === "technician") {
    technicianSection.style.display = "block";
  } else if (selectedRole === "client") {
    clientSection.style.display = "block";
  }
}

// Render Password Strength - Displays visual strength indicator
function renderPasswordStrength() {
  const password = passwordInput.value;
  const strengthBar = document.querySelector(".strength-progress");
  const strengthText = document.querySelector(".strength-text");
  
  // Initialize defaults
  if (!strengthBar || !strengthText) return;
  
  let strength = 0;
  let strengthLevel = "Very Weak";
  let color = "#dc3545"; // Red
  
  // Evaluate password strength based on length and character types
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++; // Has lowercase
  if (/[A-Z]/.test(password)) strength++; // Has uppercase
  if (/[0-9]/.test(password)) strength++; // Has numbers
  if (/[!@#$%^&*]/.test(password)) strength++; // Has special characters
  
  // Determine strength level and color
  if (strength === 1) {
    strengthLevel = "Weak";
    color = "#dc3545";
  } else if (strength === 2) {
    strengthLevel = "Fair";
    color = "#ffc107";
  } else if (strength === 3) {
    strengthLevel = "Good";
    color = "#17a2b8";
  } else if (strength === 4) {
    strengthLevel = "Strong";
    color = "#28a745";
  } else if (strength === 5) {
    strengthLevel = "Very Strong";
    color = "#20c997";
  }
  
  // Update progress bar width and color
  strengthBar.style.width = (strength * 20) + "%";
  strengthBar.style.backgroundColor = color;
  strengthText.textContent = strengthLevel;
  strengthText.style.color = color;
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

// Validate Password Match - Ensures both password fields match
function validatePasswordMatch(password, confirmPassword) {
  return password === confirmPassword && password.length >= 6;
}

// Validate Form - Checks all required fields before submission
function validateRegistrationForm() {
  // Check basic information
  if (!nameInput.value.trim()) {
    return "Please enter your full name.";
  }
  
  if (!emailInput.value.trim()) {
    return "Please enter your email address.";
  }
  
  if (!validateEmail(emailInput.value)) {
    return "Please enter a valid email address.";
  }
  
  if (!phoneInput.value.trim()) {
    return "Please enter your phone number.";
  }
  
  if (!validatePhone(phoneInput.value)) {
    return "Please enter a valid phone number.";
  }
  
  // Check password strength
  if (passwordInput.value.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  
  if (!validatePasswordMatch(passwordInput.value, confirmPasswordInput.value)) {
    return "Passwords do not match or are too short.";
  }
  
  // Check address
  if (!streetInput.value.trim()) {
    return "Please enter your street address.";
  }
  
  if (!cityInput.value.trim()) {
    return "Please enter your city.";
  }
  
  // Check role-specific fields
  const role = roleSelect.value;
  
  if (role === "technician") {
    if (!skillsInput.value.trim()) {
      return "Please enter your technical skills.";
    }
    if (!experienceInput.value) {
      return "Please select your years of experience.";
    }
    if (!hourlyRateInput.value) {
      return "Please enter your hourly rate.";
    }
  } else if (role === "client") {
    if (!servicesInput.value.trim()) {
      return "Please enter your service preferences.";
    }
    if (!budgetInput.value) {
      return "Please select your typical budget.";
    }
  }
  
  // Check terms acceptance
  if (!termsCheckbox.checked) {
    return "You must agree to the Terms and Conditions.";
  }
  
  return null; // No errors
}

// ======== ERROR AND SUCCESS MESSAGE DISPLAY ========

// Show Error - Displays error message
function showError(message) {
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    errorMessage.scrollIntoView({ behavior: "smooth" });
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 5000);
  }
}

// Show Success - Displays success message and redirects
function showSuccess(message) {
  if (successMessage) {
    successMessage.style.display = "block";
    successMessage.scrollIntoView({ behavior: "smooth" });
    
    // Show countdown and redirect to login after 5 seconds
    let countdown = 5;
    const countdownElement = document.querySelector("#successMessage span");
    
    const interval = setInterval(() => {
      countdown--;
      if (countdownElement) {
        countdownElement.textContent = countdown;
      }
      
      if (countdown <= 0) {
        clearInterval(interval);
        window.location.href = "login.htm"; // Redirect to login page
      }
    }, 1000);
  }
}

// ======== FORM SUBMISSION HANDLER ========

// Handle Form Submission - Validates and processes the registration
function handleFormSubmission() {
  // Clear previous error messages
  if (errorMessage) {
    errorMessage.style.display = "none";
  }
  
  // Validate all form fields
  const validationError = validateRegistrationForm();
  
  if (validationError) {
    showError(validationError);
    return;
  }
  
  // Collect form data
  const registrationData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    dob: dobInput.value,
    password: passwordInput.value,
    role: roleSelect.value,
    address: {
      street: streetInput.value.trim(),
      city: cityInput.value.trim(),
      postal: postalInput.value.trim()
    }
  };
  
  // Add role-specific data
  if (roleSelect.value === "technician") {
    registrationData.technician = {
      skills: skillsInput.value.trim(),
      experience: experienceInput.value,
      hourlyRate: parseInt(hourlyRateInput.value),
      certifications: certInput.value
    };
  } else if (roleSelect.value === "client") {
    registrationData.client = {
      services: servicesInput.value.trim(),
      budget: budgetInput.value
    };
  }
  
  // Log registration data (for testing/debugging)
  console.log("Registration Data:", registrationData);
  
  // TODO: Send data to backend API
  // Example:
  // fetch('/api/register', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(registrationData)
  // })
  // .then(response => response.json())
  // .then(data => {
  //   if (data.success) {
  //     showSuccess("Registration successful! Redirecting to login...");
  //   } else {
  //     showError(data.message);
  //   }
  // })
  // .catch(error => {
  //   showError("An error occurred during registration. Please try again.");
  //   console.error('Error:', error);
  // });
  
  // Show success message
  showSuccess("Registration successful! Redirecting to login...");
}

// ======== INITIALIZATION ========

// Initialize form on page load
window.addEventListener("load", () => {
  // Set default conditional fields visibility
  renderConditionalFields();
  
  // Initialize password strength
  renderPasswordStrength();
});
