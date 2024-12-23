
const toggleButton = document.querySelector('.dark-light');

toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
});

function refreshPage() {
    location.reload();
}

function getPercentageValueForTask(index) {
    // Get all elements with class 'percentage'
    const percentageTexts = document.querySelectorAll('.percentage');
    // Ensure the index is within bounds
    if (percentageTexts.length > index) {
        // Get the text content for the specific task
        const percentageValue = parseInt(percentageTexts[index].textContent, 10);
        updateProgressBar(index, percentageValue);
        console.log("get percentage index" + index + " :" + percentageValue);
        return percentageValue;
    } else {
        console.error('Percentage element not found for index', index);
        return 0;  // Default to 0 if element is not found
    }
}
// Function to update the progress bar for a specific task by index
function updateProgressBar(index, progress) {
    console.log('Updating progress for Task ' + (index + 1) + ': ' + progress + '%');
    
    // Select the progress bar and percentage text for the specific task by index
    const progressBar = document.getElementById(`progress-bar-${index}`);
    const percentageText = document.getElementById(`percentage-${index}`);

    if (progressBar && percentageText) {
        // Update progress bar width
        progressBar.style.width = progress + '%';
        percentageText.textContent = progress + '%';

        // Change color based on the progress
        if (progress <= 30) {
            progressBar.style.backgroundColor = 'red'; // Low progress: Red
            percentageText.style.left = progress + '%';
        } else if (progress <= 70) {
            progressBar.style.backgroundColor = 'yellow'; // Moderate progress: Yellow
            percentageText.style.left = progress + '%';
        } else {
            progressBar.style.backgroundColor = 'green'; // High progress: Green
            percentageText.style.left = progress + '%';
        }
    } else {
        console.error(`Progress bar or percentage text not found for task ${index + 1}`);
    }
}
// progress start
const slider = document.getElementById('progress-slider');
const input = document.getElementById('progress-input');

// Update slider when input value changes
input.addEventListener('input', function() {
    let value = parseInt(input.value);
    if (value >= 0 && value <= 100) {
        slider.value = value;
    }
});

// Update input when slider value changes
slider.addEventListener('input', function() {
    input.value = slider.value;
});
// progress end

$(document).ready(function() {
    $('#testtable').DataTable({
        responsive: true
    });
});
