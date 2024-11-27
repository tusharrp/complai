let employeeCount = 0;

function toggleSidebar() {
    const sidebar = document.getElementById("mySidebar");
    sidebar.classList.toggle("active");
}

function addNewEmployeeInput() {
    employeeCount++;
    const container = document.getElementById("employeeContainer");
    const newEmployeeInput = document.createElement("div");
    newEmployeeInput.className = "employee-input-container";
    newEmployeeInput.innerHTML = `
        <input type="text" class="employee-textbox" placeholder="Employee ${employeeCount}" id="employee-textbox-${employeeCount}">
        <button type="button" class="add-button" onclick="showEmployeeDetails(${employeeCount})">+</button>
        <button type="button" class="delete-button" style="display: none;" onclick="deleteEmployee(${employeeCount})"><i class="fas fa-trash"></i></button>
        <div class="employee-details-section" style="display: none;">
            <h2>Employee Details ${employeeCount}</h2>
            <form>
                <label for="name${employeeCount}">Name:</label>
                <input type="text" id="name${employeeCount}" name="name${employeeCount}" placeholder="Name"><br><br>
                <label for="email${employeeCount}">Email:</label>
                <input type="email" id="email${employeeCount}" name="email${employeeCount}" placeholder="Email"><br><br>
                <label for="jobDetails${employeeCount}">Job Details:</label>
                <textarea id="jobDetails${employeeCount}" name="jobDetails${employeeCount}" placeholder="Job Details"></textarea><br><br>
                <button type="button" class="add-employee-button" onclick="addEmployeeData(${employeeCount})">Add Employee</button>
            </form>
        </div>
    `;
    container.appendChild(newEmployeeInput);
}

function showEmployeeDetails(index) {
    const detailsSection = document.querySelector(`#employee-textbox-${index} + button + button + .employee-details-section`);
    const addButton = document.querySelector(`#employee-textbox-${index} + button`);
    const deleteButton = document.querySelector(`#employee-textbox-${index} + button + button`);
    
    detailsSection.style.display = "block";
    addButton.style.display = "none";
    deleteButton.style.display = "inline-block";
}

function deleteEmployee(index) {
    const employeeInput = document.querySelector(`#employee-textbox-${index}`).parentNode;
    employeeInput.remove();
}

function addEmployeeData(index) {
    const name = document.getElementById(`name${index}`).value;
    const email = document.getElementById(`email${index}`).value;
    const jobDetails = document.getElementById(`jobDetails${index}`).value;
    
    // Here you can handle the employee data, e.g., send it to a server or store it locally
    console.log(`Employee ${index} added:`, { name, email, jobDetails });
    
    // Clear the input fields
    document.getElementById(`name${index}`).value = "";
    document.getElementById(`email${index}`).value = "";
    document.getElementById(`jobDetails${index}`).value = "";
    
    // Hide the details section
    const detailsSection = document.querySelector(`#employee-textbox-${index} + button + button + .employee-details-section`);
    detailsSection.style.display = "none";
}

function approve() {
    // Handle the approval process
    console.log("Work order approved");
}

// Initialize the form with one employee input
addNewEmployeeInput();
// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Generate report number (example: random number)
    const reportNumber = generateReportNumber();
    const reportNumberElement = document.getElementById('reportNumber');
    reportNumberElement.textContent = `Report #${reportNumber}`;
});

function generateReportNumber() {
    // Example function to generate a random report number (replace with your logic)
    return Math.floor(Math.random() * 1000) + 1;
}
