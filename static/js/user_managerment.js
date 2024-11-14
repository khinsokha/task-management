// API credentials and channel ID
const urlDashboardLocal = 'http://127.0.0.1:5000/dashboard';
const urlDashboardServer = 'https://stylelife.pythonanywhere.com/dashboard';
const urlEndPoint = 'https://sambathreasmey1app.pythonanywhere.com';
const apiUsername = 'smey.dev';
const apiPassword = '$mey@168';
const channelId = "khinsokha";

const loginForm = document.getElementById('loginForm');

// Function to determine the dashboard URL based on the environment
function getDashboardUrl() {
    const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
    return isLocal ? urlDashboardLocal : urlDashboardServer;
}

// Check if the user is already logged in
if (sessionStorage.getItem('loggedIn')) {
    window.location.href = getDashboardUrl();
}

// Function to handle login
async function handleLogin(username, password) {
    // Prepare the request payload
    const requestBody = {
        channel_id: channelId,
        user_name: username,
        password: password
    };
    const basicAuth = 'Basic ' + btoa(`${apiUsername}:${apiPassword}`);

    try {
        // First call: User Login
        const response = await fetch(urlEndPoint + '/api/partner/user_login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': basicAuth
            },
            body: JSON.stringify(requestBody)
        });
    
        const loginData = await response.json();
    
        // Check if login is successful
        if (loginData.code === 200) {
            sessionStorage.setItem('loggedIn', true);
            sessionStorage.setItem('username', requestBody.user_name); // Store username in sessionStorage
    
            // Log sessionStorage after login data is stored
            console.log('sessionStorage after login:');
            console.log('loggedIn:', sessionStorage.getItem('loggedIn'));
            console.log('username:', sessionStorage.getItem('username'));
    
            // Call to second endpoint: Get User Details
            const userDetailsResponse = await fetch(`${urlEndPoint}/api/partner/get_user_details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': basicAuth
                },
                body: JSON.stringify({
                    channel_id: requestBody.channel_id,
                    user_name: requestBody.user_name
                })
            });
    
            const userDetailsData = await userDetailsResponse.json();
    
            // Check if user details are fetched successfully
            if (userDetailsData.result_message.code === 0) {
                const userDetails = userDetailsData.data[0]; // Assuming the first item in data is the one you want
    
                // Store user details in sessionStorage
                sessionStorage.setItem('email_address', userDetails.email_address);
                sessionStorage.setItem('user_id', userDetails.user_id);
                sessionStorage.setItem('user_name', userDetails.user_name);
    
                // Log sessionStorage after user details are stored
                console.log('sessionStorage after user details:');
                console.log('email_address:', sessionStorage.getItem('email_address'));
                console.log('user_id:', sessionStorage.getItem('user_id'));
                console.log('user_name:', sessionStorage.getItem('user_name'));
    
                // Redirect to the dashboard
                window.location.href = getDashboardUrl();
    
                // Clear session storage after 30 minutes (30 minutes = 30 * 60 * 1000 ms)
                setTimeout(() => {
                    sessionStorage.clear();
                    console.log('Session expired. Please log in again.');
                }, 30 * 60 * 1000);  // 30 minutes timeout
            } else {
                showError(userDetailsData.result_message.message);
            }
        } else {
            showError(loginData.message);
        }
    } catch (error) {
        console.error('Error during login or fetching user details:', error);
        showError('An error occurred. Please try again later.');
    }
    
}

// Event listener for the login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // User input
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Call the handleLogin function
    handleLogin(username, password);
});

function showError(message) {
    const errorMessageContainer = document.getElementById('error-message');
    const errorMessageText = document.getElementById('error-message-text');
    
    errorMessageText.textContent = message || 'Invalid login.';
    errorMessageContainer.classList.remove('d-none'); // Show the alert
}

function closeErrorMessage() {
    const errorMessageContainer = document.getElementById('error-message');
    errorMessageContainer.classList.add('d-none'); // Hide the alert
}
// ------------------------ Register ---------------------

function handleSignUp() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        showErrorMessage("Passwords do not match.");
        return;
    }

    const formData = {
        user_name: username,
        email_address: email,
        password: password,
        channel_id: document.getElementById('channel_id').value,
        attempt: document.getElementById('attempt').value,
        status: document.getElementById('status').value,
        role: document.getElementById('role').value
    };

    console.log("Form Data:", formData);

    const apiUsername = 'smey.dev';
    const apiPassword = '$mey@168';
    const basicAuth = 'Basic ' + btoa(`${apiUsername}:${apiPassword}`);

    fetch('https://sambathreasmey1app.pythonanywhere.com/api/partner/add_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': basicAuth
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                console.log("Success:", data);
                // Handle success (e.g., redirect to another page)
                success(data.message);
            }else{
                error(data.message);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            showErrorMessage("There was an error signing up. Please try again.");
        });
}

function showErrorMessage(message) {
    const errorMessage = document.getElementById('error-message');
    const errorMessageText = document.getElementById('error-message-text');

    errorMessageText.textContent = message;
    errorMessage.classList.remove('d-none');
}

function closeErrorMessage() {
    const errorMessage = document.getElementById('error-message');
    errorMessage.classList.add('d-none');
}

function success(message) {
    Swal.fire({
        toast: true,
        icon: 'success',
        title: message,
        animation: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: '#f8fff7',
        color: '#3c763d',
        iconColor: '#5cb85c',
        customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title'
        },
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    }).then(() => {
        // Redirect to login page after the toast is shown
        window.location.href = '/';
    });
}
function error(message) {
    Swal.fire({
        toast: true,
        icon: 'error',
        title: message,
        animation: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: '#f8d7da',
        color: '#721c24',
        iconColor: '#dc3545',
        customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title'
        },
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    }).then(() => {
        window.location.href = '/register';
    });
}
