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

// Toggle password visibility
function togglePassword(fieldId, toggleButton) {
  const passwordField = document.getElementById(fieldId);
  const icon = toggleButton.querySelector('i');
  if (passwordField.type === 'password') {
    passwordField.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    passwordField.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

// Sign up using Fetch API to call Flask backend
function signupUser() {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm-password').value;
  const messageElem = document.getElementById('signup-message');

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

  fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
  .then(response => response.json().then(data => ({ status: response.status, data })))
  .then(({ status, data }) => {
    if (status === 201) {
      messageElem.style.color = 'green';
      messageElem.innerText = data.message;
      setTimeout(() => { toggleForm('login'); }, 1500);
    } else {
      messageElem.style.color = 'red';
      messageElem.innerText = data.message;
    }
  })
  .catch(err => {
    messageElem.style.color = 'red';
    messageElem.innerText = "An error occurred.";
  });
}

// Login using Fetch API to call Flask backend
function loginUser() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const messageElem = document.getElementById('login-message');

  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then(response => response.json().then(data => ({ status: response.status, data })))
  .then(({ status, data }) => {
    if (status === 200) {
      messageElem.style.color = 'green';
      messageElem.innerText = data.message;
      // For demonstration, store the logged-in user's id in localStorage
      localStorage.setItem('sweetshop-user', JSON.stringify(data.user));
      setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    } else {
      messageElem.style.color = 'red';
      messageElem.innerText = data.message;
    }
  })
  .catch(err => {
    messageElem.style.color = 'red';
    messageElem.innerText = "An error occurred.";
  });
}
