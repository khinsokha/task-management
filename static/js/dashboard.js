
const toggleButton = document.querySelector('.dark-light');

toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
});

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
        } else if (progress <= 70) {
            progressBar.style.backgroundColor = 'yellow'; // Moderate progress: Yellow
        } else {
            progressBar.style.backgroundColor = 'green'; // High progress: Green
        }
    } else {
        console.error(`Progress bar or percentage text not found for task ${index + 1}`);
    }
}

