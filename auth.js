// Utility: Get users from localStorage (or empty array if none)
function getUsers() {
    return JSON.parse(localStorage.getItem('sweetshop-users')) || [];
  }
  
  // Utility: Save users array to localStorage
  function saveUsers(users) {
    localStorage.setItem('sweetshop-users', JSON.stringify(users));
  }
  
  // Toggle between login and signup forms
  function toggleForm(formType) {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-message').innerText = "";
    document.getElementById('signup-message').innerText = "";
  
    if (formType === 'signup') {
      document.getElementById('signup-form').classList.remove('hidden');
    } else {
      document.getElementById('login-form').classList.remove('hidden');
    }
  }
  
  // Signup function with already registered email validation
  function signupUser() {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const messageElem = document.getElementById('signup-message');
  
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      messageElem.style.color = 'red';
      messageElem.innerText = "Please fill in all fields.";
      return;
    }
  
    if (password !== confirmPassword) {
      messageElem.style.color = 'red';
      messageElem.innerText = "Passwords do not match.";
      return;
    }
  
    const users = getUsers();
    // Check if email already exists (case-insensitive)
    const userExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      messageElem.style.color = 'red';
      messageElem.innerText = "User with this email already exists.";
      return;
    }
  
    // Save new user
    const newUser = { name, email, password };
    users.push(newUser);
    saveUsers(users);
  
    messageElem.style.color = 'green';
    messageElem.innerText = "Sign Up successful! Please log in.";
    // Optionally switch to login form after a delay
    setTimeout(() => {
      toggleForm('login');
    }, 1500);
  }
  
  // Login function
  function loginUser() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const messageElem = document.getElementById('login-message');
  
    const users = getUsers();
    if (!users.length) {
      messageElem.style.color = 'red';
      messageElem.innerText = "No users found. Please sign up first.";
      return;
    }
  
    const user = users.find(
      user =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
    );
  
    if (user) {
      messageElem.style.color = 'green';
      messageElem.innerText = "Login successful! Redirecting...";
      // Redirect to shop page or main app after a delay
      setTimeout(() => {
        window.location.href = "shop.html"; // Update with your shop page
      }, 1000);
    } else {
      messageElem.style.color = 'red';
      messageElem.innerText = "Invalid credentials.";
    }
  }
  