var urlEndPoint = 'https://sambathreasmey1app.pythonanywhere.com/api/task/';
const username = 'smey.dev';
const password = '$mey@168';
const credentials = 'Basic ' + btoa(`${username}:${password}`);
console.log('load task data user_id to apply function:', sessionStorage.getItem('user_id'));
const user_id = sessionStorage.getItem('user_id');

console.log("credentials" + credentials);

// Function to auto-set the current date in the Date field
window.onload = function () {
    generateTaskId();
    var today = new Date();
    var day = ("0" + today.getDate()).slice(-2); // Adds leading zero for single digit days
    var month = ("0" + (today.getMonth() + 1)).slice(-2); // Adds leading zero for single digit months
    var year = today.getFullYear();

    var currentDate = year + "-" + month + "-" + day;
    document.getElementById('getOnDate').value = currentDate;
    document.getElementById('startedDate').value = currentDate;
    document.getElementById('endDate').value = currentDate;

    const expenseName = "name";
    const expenseAmount = 99;
    const expenseAmountCcy = "USD";
    const date = currentDate;
    const category = "Management1";

};

// Function to auto-generate Task ID
function generateTaskId() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const taskId = `${day}${month}${year}`;
    document.getElementById('taskId').innerText = taskId;
}
//=========================== list data ===========================
// Call the function to load data when the page is loaded
$(document).ready(function () {
    loadTaskData();
});

// DataTable initialization with buttons and responsive details
function initializeDataTable() {
    $('#taskTable').DataTable({
        buttons: [
            'copy', 'excel', 'pdf', 'colvis'
        ],
        dom: 'Bfrtip',
        responsive: {
            details: {
                renderer: function (api, rowIdx, columns) {
                    var data = $.map(columns, function (col, i) {
                        return col.hidden ? 
                            '<tr data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                            '<td>' + col.title + ':' + '</td> ' +
                            '<td>' + col.data + '</td>' +
                            '</tr>' : 
                            '';
                    }).join('');
                    return data ? $('<table/>').append(data) : false;
                }
            }
        },
        stateSave: true,
        order: [[0, "asc"]],
    
        columnDefs: [
            // {
            //     targets: [7, 8],  // Example: Hide 'Action' and 'Others' columns (index 7 and 8)
            //     visible: tru,    // These columns will be hidden on mobile screens
            //     className: 'mobile-hide'
            // },
            // {
            //     targets: [1],
            //     visible: false
            // }
        ],
    
        // Enable responsiveness for buttons, columns
        responsive: true,  // Enable responsiveness for buttons, columns
        autoWidth: true,  // Disable auto-width to allow proper responsive behavior
        initComplete: function() {
            // Ensure the buttons behave responsively (you can hide them on mobile if needed)
            $(window).on('resize', function () {
                if ($(window).width() < 768) {
                    // Hide DataTable buttons on mobile to save space
                    $('.dt-buttons').hide();
                } else {
                    $('.dt-buttons').show();
                }
            }).trigger('resize');
        }
    });
    

    // Example of adding custom behavior for button visibility on mobile
    $(window).on('resize', function () {
        if ($(window).width() < 768) {
            // Adjust button visibility on small screens
            $('.dt-buttons').hide();  // Hide buttons on mobile
        } else {
            $('.dt-buttons').show();  // Show buttons on larger screens
        }
    }).trigger('resize');
}

// Function to load task data from the API
function loadTaskData() {
    const apiUrl = urlEndPoint + "retrive_task";
    const data = {
        "user_id": user_id
        
    };
    // Basic Auth credentials
    const username = "smey.dev";
    const password = "$mey@168";
    const credentials = btoa(`${username}:${password}`);

    $.ajax({
        url: apiUrl,
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + credentials,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        success: function (result) {
            if (result.data && result.data.length > 0) {
                populateTable(result.data);
                initializeDataTable(); // Initialize DataTable after data is populated
            } else {
                console.log('No tasks available.');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error fetching task data:', textStatus, errorThrown);
        }
    });
}

// Function to populate table with task data list
function populateTable(tasks) {
    const taskTableBody = document.querySelector('#taskTable tbody');
    const taskTableCompleted = document.querySelector('#task-table-completed tbody');

    taskTableBody.innerHTML = "";  // Clear existing table rows for all tasks
    taskTableCompleted.innerHTML = ""; // Clear existing table rows for completed tasks

    // Filter tasks for completed (Live and End) and other statuses
    const completedTasks = tasks.filter(task => task.status.toLowerCase() === "live" || task.status.toLowerCase() === "end");
    const otherTasks = tasks.filter(task => task.status.toLowerCase() !== "live" && task.status.toLowerCase() !== "end");

    // Function to populate a table with given tasks
    function populateTableBody(tableBody, taskList) {
        const percentageValue = 78;

        taskList.forEach((task, index) => {
            const formattedTaskId = task.task_id
                ? `${task.task_id.substring(0, 1)}...${task.task_id.slice(-4)}` : "N/A";
            // Conditionally format the status with badges
            let taskStatus;
            if (task.status.toLowerCase() === "live") {
                taskStatus = `<span class="badge bg-success">${task.status}</span>`;
            } else if (task.status.toLowerCase() === "pending") {
                taskStatus = `<span class="badge bg-info text-dark">${task.status}</span>`;
            } else if (task.status.toLowerCase() === "processing") {
                taskStatus = `<span class="badge bg-warning text-dark">${task.status}</span>`;
            } else if (task.status.toLowerCase() === "end") {
                taskStatus = `<span class="badge bg-secondary">${task.status}</span>`;
            } else {
                taskStatus = task.status; // Default to plain status if no match
            }

            // Add event listener to copy task name on click
            const taskNameCopy = `
                    <span class="task-name" onclick="copyToClipboard('${task.task_name}')">
                        ${task.task_name}
                    </span>
                `;
            const othersCopy = `
                    <span class="task-others" onclick="copyToClipboard('${task.others}')">
                        ${task.others}
                    </span>
                `;

            const row = document.createElement('tr');
            row.innerHTML = `
                    <td class='task_id task-id-cell'>${formattedTaskId}<span class="tooltip">${task.task_id}</span></td>
                    <td class='task-name-cell'>${taskNameCopy}<span class="tooltip"></span></td>
                    <td>${task.management_name}</td>
                    <td>${task.received_on}</td>
                    <td>${task.started_on}</td>
                    <td>${task.ended_on}</td>
                    <td>${taskStatus}</td>
                    <td>
                        <div class="progress-container" data-percentage='70'>
                            <div class="progress-bar" id="progress-bar-${index}"></div>
                            <span class="percentage" id="percentage-${index}">${percentageValue || 0}</span>
                        </div>
                    </td>
                    <td>
                        <div class="dropdown">
                            <button class="btn btn-actions dropdown-toggle btn-sm" type="button"
                                id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                Actions
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <li>
                                    <a class="dropdown-item" href="#" onclick="editTask({
                                    task_name: '${task.task_name}',
                                    management_name: '${task.management_name}',
                                    user_id: '${task.user_id}',
                                    task_id: '${task.task_id}',
                                    received_on: '${task.received_on}',
                                    started_on: '${task.started_on}',
                                    ended_on: '${task.ended_on}',
                                    status: '${task.status}',
                                    progress: 'percentage',
                                    others: '${task.others}'
                                    })">
                                        <i class="far fa-edit"></i> Edit
                                    </a>
                                </li>
                                <li><a class="dropdown-item" href="#" onclick="deleteTask({
                                    user_id: '${task.user_id}',
                                    task_id: '${task.task_id}'
                                })"><i class="fas fa-trash" style="color: #ff0000;"></i> Delete</a></li>
                                <li><a class="dropdown-item" href="#"><i class="fas fa-sync-alt" style="color: #005eff;"></i> Live</a></li>
                            </ul>
                        </div>
                    </td>
                    <td class='task-others-cell'>${othersCopy}<span class="tooltip">Click to copy!</span></td>
                `;
            tableBody.appendChild(row);
            // const percentageText = document.getElementById('percentage');
            getPercentageValueForTask(index);
            
        });
    }

    // Populate both tables
    populateTableBody(taskTableBody, otherTasks);
    populateTableBody(taskTableCompleted, completedTasks);
}

// loadTaskData();

// });
//=========================== End list data ===========================

// ==================== Update list ====================

function editTask(taskData) {
    const apiUrl = urlEndPoint + 'update_task';
    const username = 'smey.dev';
    const password = '$mey@168';

    // Prepare the Basic Auth header
    const credentials = 'Basic ' + btoa(`${username}:${password}`);

    const requestBody = {
        task_name: $('#task_name').val(),
        management_name: $('#management_name').val(),
        user_id: user_id,
        task_id: $('#task_id').val(),
        received_on: $('#received_on').val(),
        started_on: $('#started_on').val(),
        ended_on: $('#ended_on').val(),
        status: $('#status').val(),
        others: $('#others').val()
    };

    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestBody),
        headers: {
            'Authorization': credentials
        },
        success: function (data) {
            console.log('Task updated successfully:', data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Failed to update task:', textStatus, errorThrown);
        }
    });
}

function editTask(taskData) {
    // Populate the form fields with the task data
    $('#task_name').val(taskData.task_name);
    $('#management_name').val(taskData.management_name);
    $('#user_id').val(taskData.user_id);
    $('#task_id').val(taskData.task_id);
    $('#received_on').val(taskData.received_on);
    $('#started_on').val(taskData.started_on);
    $('#ended_on').val(taskData.ended_on);
    $('#status').val(taskData.status);
    $('#others').val(taskData.others);

    // Update the span with the Task ID
    $('#task_id_display').text(taskData.task_id);

    // Open the modal window
    $('#editTaskModal').modal('show');
}

$('#updateTaskBtn').on('click', function () {
    // Get the updated task data from the form fields
    const taskData = {
        task_name: $('#task_name').val(),
        management_name: $('#management_name').val(),
        user_id: user_id,
        task_id: $('#task_id').val(),
        received_on: $('#received_on').val(),
        started_on: $('#started_on').val(),
        ended_on: $('#ended_on').val(),
        status: $('#status').val(),
        others: $('#others').val()
    };

    // Send the updated task data to the server
    const apiUrl = urlEndPoint + '/update_task';

    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(taskData),
        headers: {
            'Authorization': credentials
        },
        success: function (data) {
            if(data.code == 200){
                console.log('Task updated successfully:', data);
                success(data.message);
                // Optionally, you could close the modal here
                $('#editTaskModal').modal('hide');
            }else{
                error(data.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Failed to update task:', textStatus, errorThrown);
        }
    });
});

// ========================= add task ===================
// Function to handle form submission and add task
document.getElementById('taskForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collect data from the form
    const task = {
        task_name: document.getElementById('taskName').value,
        management_name: document.getElementById('managementName').value,
        user_id: user_id, // Assuming user_id is static or retrieved from elsewhere
        received_on: document.getElementById('getOnDate').value,
        started_on: document.getElementById('startedDate').value,
        ended_on: document.getElementById('endDate').value,
        status: document.getElementById('statusAdd').value,
        others: document.getElementById('otherText').value
    };

    // Call the addTask function with the collected task data
    addTask(task);
});

// Function to add a task using AJAX
function addTask(task) {
    const apiUrl = urlEndPoint + 'add_task';
    const auth = 'Basic ' + btoa(username + ':' + password);
    const taskData = JSON.stringify(task); // Convert the task object to a JSON string

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
        },
        body: taskData
    })
        .then(response => {
            if (response.ok) {
                console.log('Task added successfully!');
                return response.json(); // Return the response as JSON
            } else {
                throw new Error('Error adding task: ' + response.statusText);
            }
        })
        .then(data => {
            console.log('Response from server:', data);
            if (data.code == 200) {
                success(data.message);
            }else{
                error(data.message);
            }
        })
        .catch(error => {
            console.error('Error adding task:', error);
        });
}
// ========================= End add task ===================

//Delete
function deleteTask(taskData) {
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to delete this task?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // Proceed with the deletion if the user confirms
            $.ajax({
                url: urlEndPoint + "delete_task",
                method: 'POST',
                contentType: 'application/json',
                headers: {
                    "Authorization": "Basic " + btoa(username + ":" + password)
                },
                data: JSON.stringify(taskData),
                success: function (response) {
                    console.log('Task deleted successfully:', response);
                    swal.fire({
                        toast: true,
                        icon: 'success',
                        title: 'Deleted successfully',
                        animation: true,
                        position: 'top',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer);
                            toast.addEventListener('mouseleave', Swal.resumeTimer);
                        }
                    }).then(function () {
                        // Reload the page after the success message is displayed
                        location.reload();
                    });
                },
                error: function (xhr, status, error) {
                    console.error('Error deleting task:', error);
                    swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Task could not be deleted.',
                    });
                }
            });
        }
    });
}

// Function to copy text to clipboard
function copyToClipboard(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showAlert('Task name copied to clipboard!'); // Call the custom alert function
}
// Function to show a temporary alert
function showAlert(message) {
    // Create alert div
    const alertDiv = document.createElement('div');
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.padding = '10px 20px';
    alertDiv.style.backgroundColor = '#4caf50'; // Green background
    alertDiv.style.color = 'white'; // White text
    alertDiv.style.borderRadius = '5px';
    alertDiv.style.zIndex = '1000';

    document.body.appendChild(alertDiv); // Add the alert to the body

    // Auto-close the alert after 1 second
    setTimeout(() => {
        alertDiv.style.transition = 'opacity 0.5s ease'; // Add transition for fade-out
        alertDiv.style.opacity = '0'; // Fade out effect
        setTimeout(() => {
            document.body.removeChild(alertDiv); // Remove the alert after fade-out
        }, 500); // Wait for the transition to finish before removing
    }, 1000); // Show alert for 1 second
}

function success(message) {
    swal.fire({
        toast: true,
        icon: 'success',
        title: message,
        animation: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    }).then(() => {
        // Reload the page after the success message is displayed
        location.reload();
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
    });
    // .then(() => {
    //     window.location.href = '/register';
    // });
}
