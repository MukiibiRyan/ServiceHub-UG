// Form access
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const showPasswordCheckbox = document.getElementById("showPassword");
const rememberMeCheckbox = document.getElementById("rememberMe");

// ======== Show/Hide Password Toggle ========
showPasswordCheckbox.addEventListener("change", () => {
    if (showPasswordCheckbox.checked) {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
});

// ======== Remember Me Functionality ========
// Load saved credentials on page load
window.addEventListener("load", () => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedRole = localStorage.getItem("savedRole");
    
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
        
        // Set the role radio button
        if (savedRole) {
            document.getElementById("role" + savedRole.charAt(0).toUpperCase() + savedRole.slice(1)).checked = true;
        }
    }
});

// Save credentials when Remember Me is checked
rememberMeCheckbox.addEventListener("change", () => {
    if (rememberMeCheckbox.checked) {
        localStorage.setItem("savedEmail", emailInput.value);
        localStorage.setItem("savedRole", getSelectedRole());
    } else {
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedRole");
    }
});

// ======== Get Selected Role ========
function getSelectedRole() {
    const roleRadios = document.querySelectorAll("input[name='role']");
    for (let radio of roleRadios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return null;
}

// ======== Form Validation ========
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// ======== Form Submission ========
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    // Get form values
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const role = getSelectedRole();
    
    // Clear previous error messages
    const errorMessage = document.getElementById("errorMessage");
    if (errorMessage) {
        errorMessage.remove();
    }
    
    // Validate inputs
    if (!email || !password || !role) {
        showError("Please fill in all the required fields.");
        return;
    }
    
    if (!validateEmail(email)) {
        showError("Please enter a valid email address.");
        return;
    }
    
    if (!validatePassword(password)) {
        showError("Password must be at least 6 characters long.");
        return;
    }
    
    // Save credentials if Remember Me is checked
    if (rememberMeCheckbox.checked) {
        localStorage.setItem("savedEmail", email);
        localStorage.setItem("savedRole", role);
    } else {
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedRole");
    }
    
    // Create Login Data
    const loginData = {
        email: email,
        password: password,
        role: role
    };
    
    // Log the data (for testing)
    console.log("Login Data:", loginData);
    
    // TODO: Send loginData to backend API
    // Example: 
    // fetch('/api/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(loginData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     if (data.success) {
    //         alert("Login successful!");
    //         // Redirect based on role
    //         if (data.user.role === 'admin') {
    //             window.location.href = './admin_dashboard.htm';
    //         } else {
    //             window.location.href = './dashboard.htm';
    //         }
    //     } else {
    //         showError(data.message);
    //     }
    // })
    // .catch(error => {
    //     showError("An error occurred. Please try again.");
    //     console.error('Error:', error);
    // });
    
    // Simulate successful login with role-based redirection
    alert(`Login successful!\nWelcome ${role}!`);
    
    // Redirect based on role (for demo purposes)
    if (role === 'admin') {
        window.location.href = './admin_dashboard.htm';
    } else {
        window.location.href = './dashboard.htm';
    }
});

// ======== Error Message Display ========
function showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.id = "errorMessage";
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    
    const form = document.querySelector(".form");
    form.insertBefore(errorDiv, form.firstChild);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}