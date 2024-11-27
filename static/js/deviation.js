function toggleSidebar() {
    const sidebar = document.getElementById("mySidebar");
    document.body.classList.toggle('sidebar-open');

    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-250px";
    } else {
        sidebar.style.left = "0px";
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const employeeForm = document.getElementById('employeeForm');
    employeeForm.addEventListener('submit', function(event) {
        event.preventDefault();
    });
});

function addEmployee(event, index) {
    event.preventDefault();
    const parentElement = event.target.closest('.employee-input-container');
    const employeeTextbox = parentElement.querySelector('.employee-textbox');
    employeeTextbox.value = `Employee ${index}`;

    const deleteButton = parentElement.querySelector('.delete-button');
    deleteButton.style.display = 'inline-block';

    event.target.style.display = 'none';

    const employeeDetailsSection = parentElement.querySelector('.employee-details-section');
    employeeDetailsSection.style.display = 'block';
}

function deleteEmployee(event, index) {
    event.preventDefault();
    const parentElement = event.target.closest('.employee-input-container');
    const employeeTextbox = parentElement.querySelector('.employee-textbox');
    employeeTextbox.value = '';

    event.target.style.display = 'none';

    const addButton = parentElement.querySelector('.add-button');
    addButton.style.display = 'inline-block';

    const employeeDetailsSection = parentElement.querySelector('.employee-details-section');
    employeeDetailsSection.style.display = 'none';
}

let employees = [];

function addEmployeedata(event, index) {
    event.preventDefault();
    const parentElement = event.target.closest('.employee-details-section');
    const nameInput = parentElement.querySelector(`#name${index}`);
    const emailInput = parentElement.querySelector(`#email${index}`);
    const jobDetailsInput = parentElement.querySelector(`#jobDetails${index}`);

    const name = nameInput.value;
    const email = emailInput.value;
    const jobDetails = jobDetailsInput.value;

    const employee = {
        name: name,
        email: email,
        jobDetails: jobDetails,
        index: index
    };

    employees.push(employee);

    const employeeTextbox = document.getElementById(`employee-textbox-${index}`);
    employeeTextbox.value = name;

    nameInput.value = '';
    emailInput.value = '';
    jobDetailsInput.value = '';

    parentElement.style.display = 'none';

    const seeButton = document.getElementById(`see-button-${index}`);
    seeButton.style.display = 'inline-block';
}

function train() {
    window.location.href = '/industry/pi/ehs/deviation/train';
}

function approve() {
    alert("Approval submitted for the Deviation Investigation Report!");
}

let currentDivId;

function openModal(divId) {
    currentDivId = divId;

    document.getElementById("textareaInModal1").value = document.getElementById(divId).innerText;
    document.getElementById("inputFieldInModal").value = '';

    document.getElementById("modalTitle").innerText = divId;

    document.querySelectorAll('.submit-button').forEach(button => {
        if (button.id !== "addButton") {
            button.style.display = 'none';
        }
    });

    showButtons(divId);

    document.getElementById("myModal").style.display = "block";

    const textareaInModal = document.getElementById("textareaInModal1");
    const addButton = document.getElementById("addButton");

    textareaInModal.addEventListener("input", function() {
        addButton.style.display = this.value.trim() !== '' ? "inline-block" : "none";
    });

    addButton.style.display = textareaInModal.value.trim() !== '' ? "inline-block" : "none";
}

function showButtons(divId) {
    const buttonMap = {
        'deviationDescription': 'generateDeviationDescription',
        'impactAssessment': 'generateImpactAssessment',
        'rootCauseAnalysis': 'generateRootCauseAnalysis',
        'correctiveActions': 'generateCorrectiveActions',
        'preventiveActions': 'generatePreventiveActions',
        'investigationProcedure': 'generateInvestigationProcedure',
        'qualityAssuranceReview': 'generateQualityAssuranceReview',
        'capaImplementation': 'generateCapaImplementation',
        'supportingDocuments': 'generateSupportingDocuments',
        'approvalAndClosure': 'generateApprovalAndClosure'
    };

    const buttonId = buttonMap[divId];
    if (buttonId) {
        document.getElementById(buttonId).style.display = 'inline-block';
    }
}

document.querySelectorAll('.placeholder').forEach(function(div) {
    div.addEventListener('dblclick', function() {
        var divId = this.getAttribute('id');
        openModal(divId);
    });
});

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function() {
    const divs = document.querySelectorAll("div.placeholder");
    divs.forEach(div => {
        div.addEventListener("dblclick", function() {
            openModal(this.id);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('addButton');
    if (addButton) {
        addButton.addEventListener('click', function() {
            const textInModal = document.getElementById("textareaInModal1").value;
            document.getElementById(currentDivId).innerText = textInModal;
            closeModal();
        });
    } else {
        console.error('Element with id "addButton" not found.');
    }
});

function pasteDataIntoModal() {
    const textInModal = document.getElementById("textareaInModal1").value;
    const modalTitle = document.getElementById("modalTitle").innerText;
    const divId = modalTitle.toLowerCase().replace(/\s/g, '');
    document.getElementById(divId).innerText = textInModal;

    sessionStorage.setItem(divId, textInModal);
    sessionStorage.setItem('deviationInvestigationScript', textInModal);

    closeModal();
}

document.addEventListener('DOMContentLoaded', function() {
    const divs = document.querySelectorAll("div.placeholder");
    divs.forEach(div => {
        const divId = div.getAttribute('id');
        const savedText = sessionStorage.getItem(divId);
        if (savedText) {
            div.innerText = savedText;
        }
    });
});

function generateSection(section) {
    const userInput = document.getElementById('inputFieldInModal').value.trim();
    if (!userInput) {
        alert('Please enter a valid input for the Deviation Investigation Report section.');
        return;
    }

    fetch('/industry/pi/ehs/deviation/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            section: section,
            user_prompt: userInput,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
            alert('An error occurred while generating the text. Please try again.');
        } else {
            const textareaInModal = document.getElementById('textareaInModal1');
            textareaInModal.value = data.text;
    
            const addButton = document.getElementById('addButton');
            addButton.style.display = 'inline-block';
        }
    })
    .catch(error => {
        console.error('Error in generating Deviation Investigation Report section:', error);
        alert('An error occurred while generating the text. Please try again.');
    });
}

async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const mainContent = document.getElementById('mainContent');
    const pdf = new jsPDF('p', 'pt', 'a4');

    const canvas = await html2canvas(mainContent, {
        scale: 2
    });
    const imgData = canvas.toDataURL('image/png');

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    const topMargin = 50;

    while (heightLeft > 0) {
        position = heightLeft - pdfHeight - topMargin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save('deviation_investigation_report.pdf');
}