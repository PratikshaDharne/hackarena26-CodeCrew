const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simulated login (for demo, you can connect backend later)
    if(username === "admin" && password === "1234"){
        alert("Login Successful!");
        window.location.href = "dashboard.html"; // Redirect to dashboard
    } else {
        alert("Invalid Username or Password");
    }
});