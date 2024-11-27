function toggleSidebar() {
    const sidebar = document.getElementById("mySidebar");
    document.body.classList.toggle('sidebar-open'); // Toggle class to adjust main content margin

    // Toggle sidebar position based on current state
    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-250px"; // Slide sidebar off-screen to the left
    } else {
        sidebar.style.left = "0px"; // Slide sidebar back in
    }
}



  
document.addEventListener('DOMContentLoaded', (event) => {
    const employeeForm = document.getElementById('employeeForm');
    employeeForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent form submission
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
  
    // Show the "See" button
    const seeButton = document.getElementById(`see-button-${index}`);
    seeButton.style.display = 'inline-block';
  }
  


function train() {
    window.location.href = '/industry/pi/ehs/sop/train';
}



function approve() {
    alert("Approval submitted!");
    // Add further functionality as needed
  }
  


  
  let currentDivId;

  function openModal(divId) {
      currentDivId = divId;
  
      // Set the value of the div's content in the modal textarea
      document.getElementById("textareaInModal1").value = document.getElementById(divId).innerText;
      document.getElementById("inputFieldInModal").value = '';
  
      // Set the title of the modal to include the ID of the div
      document.getElementById("modalTitle").innerText = divId;
  
      // Hide all generate buttons initially
      document.querySelectorAll('.submit-button').forEach(button => {
          if (button.id !== "addButton") {
              button.style.display = 'none';
          }
      });
  
      // Show the appropriate generate button based on the section
      showButtons(divId);
  
      // Display the modal
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
          'objective': 'generateObjective',
          'scope': 'generateScope',
          'responsibility': 'generateResponsibility',
          'accountability': 'generateAccountability',
          'abbreviation': 'generateAbbreviation',
          'procedure': 'generateProcedure',
          'authorization': 'generateAuthorization',
          'preparation': 'generatePreparation',
          'annexures': 'generateAnnexures',
          'revisionHistory': 'generateRevisionHistory'
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
  
  // Example corrected usage
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
    document.getElementById(divId).innerText = textInModal; // Pasting to the specific div

    // Save to sessionStorage
    sessionStorage.setItem(divId, textInModal);
    sessionStorage.setItem('trainingScript', textInModal);

    closeModal();
}

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve and populate data from sessionStorage on page load
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
          alert('Please enter a valid input.');
          return;
      }
  
      fetch('/industry/pi/ehs/sop/generate', {
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
          console.log('Generated text:', data.text);
          // Display generated text in the textarea
          const textareaInModal = document.getElementById('textareaInModal1');
          textareaInModal.value = data.text;
  
          // Show the add button
          const addButton = document.getElementById('addButton');
          addButton.style.display = 'inline-block';
      })
      .catch(error => {
          console.error('Error:', error);
      });
  }
  







  async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const mainContent = document.getElementById('mainContent');
    const pdf = new jsPDF('p', 'pt', 'a4');
  
    const canvas = await html2canvas(mainContent, {
      scale: 2 // Increase the scale for better resolution
    });
    const imgData = canvas.toDataURL('image/png');
  
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
    let heightLeft = pdfHeight;
    let position = 0;
  
    // Add the first page
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();
  
    // Set the top margin for subsequent pages
    const topMargin = 50;
  
    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - pdfHeight - topMargin;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }
  
    pdf.save('sop.pdf');
  }
