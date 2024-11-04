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
        const response = await fetch(urlEndPoint + '/api/partner/user_login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': basicAuth
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (data.code === 200) {
            sessionStorage.setItem('loggedIn', true);
            sessionStorage.setItem('username', username);

            // Redirect to the dashboard
            window.location.href = getDashboardUrl();

            // Clear session storage after 30 minute
            setTimeout(() => {
                sessionStorage.clear();
                console.log('Session expired. Please log in again.');
            }, 180000);
        } else {
            showError(data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
        showError(data.message);
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
$(document).ready(function () {
    $('#signupForm').on('submit', function (e) {
        e.preventDefault();

        const username = $('#username').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val().trim();
        const channel_id = $('#channel_id').val();
        const attempt = $('#attempt').val();
        const status = $('#status').val();
        const role = $('#role').val();

        // Basic Auth credentials
        const apiUsername = 'smey.dev';
        const apiPassword = '$mey@168';
        const urlEndPoint = 'https://sambathreasmey1app.pythonanywhere.com';
        const apiUrl = urlEndPoint + '/api/partner/add_user';

        // Create Basic Auth header
        const headers = {
            'Authorization': 'Basic ' + btoa(apiUsername + ':' + apiPassword),
            'Content-Type': 'application/json'
        };

        // Make the API call
        $.ajax({
            url: apiUrl,
            method: 'POST',
            headers: headers,
            data: JSON.stringify({
                channel_id: channel_id,
                user_name: username,
                password: password,
                email_address: email,
                attempt: attempt,
                role: role,
                status: status
            }),
            success: function (response) {
                if (response.code === 200) {
                    alert('Registration successful!');
                    // Redirect to login or dashboard as needed
                } else {
                    showError(response.message);
                }
            },
            error: function () {
                showError("Failed to register. Please try again.");
            }
        });
    });

    function showError(message) {
        $('#error-message-text').text(message);
        $('#error-message').removeClass('d-none');
    }

    window.closeErrorMessage = function () {
        $('#error-message').addClass('d-none');
    };
});