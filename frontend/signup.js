// signup.js
const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', function(e){
    e.preventDefault();
    const username = document.getElementById('newUsername').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('newPassword').value;

    // For demo, just alert
    alert(`Account created for ${username}!`);
    window.location.href = "login.html"; // Redirect to login page
});