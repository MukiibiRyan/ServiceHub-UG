// ======== PAYMENT PAGE - JAVASCRIPT ========
// This file handles payment form functionality
// Manages payment method selection, promo codes, price calculations, and receipt generation

// ======== DOM ELEMENT REFERENCES ========
const paymentForm = document.getElementById("paymentForm");
const paymentMethodInputs = document.querySelectorAll("input[name='paymentMethod']");
const promoCodeInput = document.getElementById("promoCode");
const applyPromoButton = document.getElementById("applyPromo");
const priceBreakdown = document.querySelector(".price-breakdown");
const confirmationSection = document.getElementById("confirmationSection");
const billingForm = document.querySelector("fieldset:nth-of-type(2)");
const faqItems = document.querySelectorAll("details");

// ======== PAYMENT METHODS DATA ========
const paymentMethods = {
  momo: {
    name: "Mobile Money",
    fields: ["momoPhone"],
    description: "Pay via MTN or Airtel Mobile Money"
  },
  card: {
    name: "Credit/Debit Card",
    fields: ["cardNumber", "cardName", "cardExpiry", "cardCVV"],
    description: "Pay securely with your card"
  },
  bank: {
    name: "Bank Transfer",
    fields: [],
    description: "Transfer funds directly to our account"
  },
  cash: {
    name: "Cash on Completion",
    fields: [],
    description: "Pay when the service is complete"
  }
};

// ======== PROMO CODES DATABASE ========
const promoCodes = {
  "SAVE10": { discount: 0.10, description: "10% off" },
  "SAVE20": { discount: 0.20, description: "20% off" },
  "SAVE15": { discount: 0.15, description: "15% off" },
  "WELCOME": { discount: 0.05, description: "5% Welcome Discount" }
};

// ======== SAMPLE PRICING DATA ========
const pricingData = {
  subtotal: 250000,
  tax: 0.18,
  serviceFee: 15000
};

let appliedPromoCode = null;

// ======== EVENT LISTENERS ========

// Payment Method Change - Updates visible fields based on payment method
paymentMethodInputs.forEach((input) => {
  input.addEventListener("change", () => {
    renderPaymentMethodFields();
  });
});

// Apply Promo Code - Validates and applies discount
if (applyPromoButton) {
  applyPromoButton.addEventListener("click", () => {
    handlePromoCode();
  });
}

// Promo Code Enter Key - Applies promo code when Enter is pressed
if (promoCodeInput) {
  promoCodeInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      handlePromoCode();
    }
  });
}

// Form Submission - Processes payment
if (paymentForm) {
  paymentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handlePaymentSubmission();
  });
}

// FAQ Toggle - Makes FAQ items interactive
faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    console.log("FAQ item toggled:", item.querySelector("summary").textContent);
  });
});

// ======== RENDER FUNCTIONS ========

// Render Payment Method Fields - Shows/hides fields based on selected payment method
function renderPaymentMethodFields() {
  // Get selected payment method
  const selectedMethod = document.querySelector("input[name='paymentMethod']:checked").value;
  
  // Hide all payment method containers
  document.querySelectorAll("[id$='Details']").forEach((div) => {
    div.style.display = "none";
  });
  
  // Show selected method details
  const methodDetailsId = selectedMethod + "Details";
  const methodDetailsDiv = document.getElementById(methodDetailsId);
  
  if (methodDetailsDiv) {
    methodDetailsDiv.style.display = "block";
  }
  
  console.log("Payment method selected:", selectedMethod);
}

// Render Price Breakdown - Updates price display with calculations
function renderPriceBreakdown() {
  if (!priceBreakdown) return;
  
  // Calculate amounts
  const subtotal = pricingData.subtotal;
  const tax = subtotal * pricingData.tax;
  const serviceFee = pricingData.serviceFee;
  let discount = 0;
  
  // Apply promo code discount if applied
  if (appliedPromoCode) {
    discount = subtotal * promoCodes[appliedPromoCode].discount;
  }
  
  // Calculate total
  const total = subtotal + tax + serviceFee - discount;
  
  // Update price breakdown display
  const priceRows = priceBreakdown.querySelectorAll(".price-row");
  
  priceRows.forEach((row) => {
    const label = row.querySelector("span:first-child")?.textContent || "";
    const valueSpan = row.querySelector("span:last-child");
    
    if (label.includes("Subtotal") && valueSpan) {
      valueSpan.textContent = formatCurrency(subtotal);
    } else if (label.includes("Tax") && valueSpan) {
      valueSpan.textContent = formatCurrency(tax);
    } else if (label.includes("Service Fee") && valueSpan) {
      valueSpan.textContent = formatCurrency(serviceFee);
    } else if (label.includes("Discount") && valueSpan) {
      valueSpan.textContent = "-" + formatCurrency(discount);
    } else if (label.includes("Total") && valueSpan) {
      valueSpan.textContent = formatCurrency(total);
    }
  });
  
  console.log("Price breakdown updated. Total:", total);
}

// Render Receipt - Displays payment receipt
function renderReceipt(paymentData) {
  const receiptDiv = document.querySelector(".receipt");
  
  if (receiptDiv) {
    const receipt = `
      <h4>Payment Receipt</h4>
      <p><strong>Transaction ID:</strong> ${paymentData.transactionId}</p>
      <p><strong>Amount Paid:</strong> ${formatCurrency(paymentData.amount)}</p>
      <p><strong>Payment Method:</strong> ${paymentData.method}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">✓ Paid</span></p>
      <hr>
      <p>Thank you for your payment. A confirmation email has been sent to ${paymentData.email}</p>
    `;
    
    receiptDiv.innerHTML = receipt;
    receiptDiv.style.display = "block";
  }
}

// ======== UTILITY FUNCTIONS ========

// Format Currency - Converts number to UGX currency format
function formatCurrency(amount) {
  return "UGX " + amount.toLocaleString("en-UG");
}

// Generate Transaction ID - Creates unique transaction identifier
function generateTransactionId() {
  return "TXN" + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// ======== PROMO CODE HANDLING ========

// Handle Promo Code - Validates and applies promo code
function handlePromoCode() {
  const code = promoCodeInput.value.trim().toUpperCase();
  
  // Clear previous error
  const errorDiv = document.querySelector(".error-message");
  if (errorDiv) {
    errorDiv.style.display = "none";
  }
  
  // Validate promo code input
  if (!code) {
    showError("Please enter a promo code.");
    return;
  }
  
  // Check if promo code exists
  if (!promoCodes[code]) {
    showError("Invalid promo code. Please check and try again.");
    promoCodeInput.value = "";
    return;
  }
  
  // Apply promo code
  appliedPromoCode = code;
  const promoInfo = promoCodes[code];
  
  // Show success message
  const successDiv = document.createElement("div");
  successDiv.className = "success-message";
  successDiv.textContent = `Promo code applied: ${promoInfo.description}`;
  
  const parent = promoCodeInput.parentElement;
  parent.appendChild(successDiv);
  
  // Remove success message after 3 seconds
  setTimeout(() => {
    successDiv.remove();
  }, 3000);
  
  // Update price breakdown
  renderPriceBreakdown();
  
  console.log("Promo code applied:", code, promoInfo);
}

// ======== ERROR MESSAGE DISPLAY ========

// Show Error - Displays error message
function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  
  const form = paymentForm || document.querySelector("fieldset:first-of-type");
  if (form) {
    form.insertBefore(errorDiv, form.firstChild);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }
}

// ======== VALIDATION FUNCTIONS ========

// Validate Card Number - Checks if card number is valid
function validateCardNumber(cardNumber) {
  const cardRegex = /^[0-9]{16}$/;
  return cardRegex.test(cardNumber.replace(/\s/g, ""));
}

// Validate Email - Checks if email is valid
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate Payment Form - Checks all required fields
function validatePaymentForm() {
  const selectedMethod = document.querySelector("input[name='paymentMethod']:checked");
  
  if (!selectedMethod) {
    return "Please select a payment method.";
  }
  
  // Get billing information
  const billingName = document.getElementById("billingName");
  const billingEmail = document.getElementById("billingEmail");
  const billingAddress = document.getElementById("billingAddress");
  
  // Validate billing information
  if (!billingName || !billingName.value.trim()) {
    return "Please enter your full name.";
  }
  
  if (!billingEmail || !billingEmail.value.trim()) {
    return "Please enter your email address.";
  }
  
  if (!validateEmail(billingEmail.value)) {
    return "Please enter a valid email address.";
  }
  
  if (!billingAddress || !billingAddress.value.trim()) {
    return "Please enter your billing address.";
  }
  
  // Validate payment method specific fields
  const method = selectedMethod.value;
  
  if (method === "card") {
    const cardNumber = document.getElementById("cardNumber");
    const cardExpiry = document.getElementById("cardExpiry");
    const cardCVV = document.getElementById("cardCVV");
    
    if (!cardNumber || !cardNumber.value.trim()) {
      return "Please enter your card number.";
    }
    
    if (!validateCardNumber(cardNumber.value)) {
      return "Please enter a valid 16-digit card number.";
    }
    
    if (!cardExpiry || !cardExpiry.value.trim()) {
      return "Please enter card expiry date.";
    }
    
    if (!cardCVV || !cardCVV.value.trim()) {
      return "Please enter card CVV.";
    }
  } else if (method === "momo") {
    const momoPhone = document.getElementById("momoPhone");
    if (!momoPhone || !momoPhone.value.trim()) {
      return "Please enter your mobile number.";
    }
  }
  
  return null;
}

// ======== FORM SUBMISSION HANDLER ========

// Handle Payment Submission - Processes payment
function handlePaymentSubmission() {
  // Validate form
  const validationError = validatePaymentForm();
  
  if (validationError) {
    showError(validationError);
    return;
  }
  
  // Get selected payment method
  const selectedMethod = document.querySelector("input[name='paymentMethod']:checked").value;
  
  // Collect payment data
  const paymentData = {
    transactionId: generateTransactionId(),
    amount: pricingData.subtotal + (pricingData.subtotal * pricingData.tax) + pricingData.serviceFee - (appliedPromoCode ? pricingData.subtotal * promoCodes[appliedPromoCode].discount : 0),
    method: paymentMethods[selectedMethod].name,
    email: document.getElementById("billingEmail").value,
    billing: {
      name: document.getElementById("billingName").value.trim(),
      email: document.getElementById("billingEmail").value.trim(),
      phone: document.getElementById("billingPhone").value.trim(),
      address: document.getElementById("billingAddress").value.trim(),
      city: document.getElementById("billingCity").value.trim()
    },
    promoCode: appliedPromoCode || null,
    timestamp: new Date().toISOString()
  };
  
  console.log("Payment Data:", paymentData);
  
  // TODO: Send to backend API
  // fetch('/api/payments/process', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(paymentData)
  // })
  // .then(response => response.json())
  // .then(data => {
  //   if (data.success) {
  //     renderReceipt(paymentData);
  //     showSuccess("Payment successful!");
  //   } else {
  //     showError(data.message);
  //   }
  // })
  // .catch(error => {
  //   showError("Payment processing failed. Please try again.");
  //   console.error('Error:', error);
  // });
  
  // Show receipt and redirect
  renderReceipt(paymentData);
  
  if (confirmationSection) {
    confirmationSection.style.display = "block";
    confirmationSection.scrollIntoView({ behavior: "smooth" });
    
    // Redirect after 4 seconds
    setTimeout(() => {
      window.location.href = "dashboard.htm";
    }, 4000);
  }
}

// ======== INITIALIZATION ========

// Initialize Payment Page - Runs on page load
window.addEventListener("load", () => {
  console.log("Payment page loaded");
  
  // Initialize payment method fields
  renderPaymentMethodFields();
  
  // Initialize price breakdown
  renderPriceBreakdown();
});
