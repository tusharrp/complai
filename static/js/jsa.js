document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('jsaTable');
    const tbody = table.querySelector('tbody');
    const modal = document.getElementById('activityModal');
    const activityDetails = document.getElementById('activityDetails');
    const submitActivity = document.getElementById('submitActivity');
    const addRowButton = document.getElementById('addRow');
    const downloadPdfButton = document.getElementById('downloadPdf');
    const errorMessage = document.getElementById('errorMessage');
    let currentRow;

    // Add initial row
    addNewRow();

    // Double-click event for activity column
    tbody.addEventListener('dblclick', function(e) {
        if (e.target.cellIndex === 1) { // Activity column
            currentRow = e.target.parentElement;
            modal.style.display = 'block';
            activityDetails.value = e.target.textContent;
        }
    });

    

    // Add new row button
    addRowButton.addEventListener('click', addNewRow);

    // PDF download functionality
    downloadPdfButton.addEventListener('click', downloadPdf);

    function addNewRow() {
        const newRow = tbody.insertRow();
        for (let i = 0; i < 7; i++) {
            newRow.insertCell();
        }
        newRow.cells[0].textContent = tbody.rows.length;
    }

    function updateTableRow(row, data) {
        try {
            row.cells[2].textContent = data.Hazards;
            row.cells[3].textContent = data.SeverityBeforeMitigation;
            row.cells[4].textContent = data.ControlAndChecks;
            row.cells[5].textContent = data.SeverityAfterMitigation;
            row.cells[6].textContent = data.ActionParty;
        } catch (error) {
            console.log("BSDK yeh print kyun nhi ho raha")
            console.error('Error updating table:', error);
            showError('Failed to update table with received data');
        }
    }

    function formatArray(arr) {
        return Array.isArray(arr) ? arr.join(', ') : 'Not provided';
    }

    function formatObject(obj) {
        if (typeof obj !== 'object' || obj === null) return 'Not provided';
        return Object.entries(obj)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ');
    }

    function formatObjectWithArrays(obj) {
        if (typeof obj !== 'object' || obj === null) return 'Not provided';
        return Object.entries(obj)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
    }

    function showError(message) {
        errorMessage.textContent = `An error occurred: ${message}`;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    // Submit activity
    submitActivity.addEventListener('click', function() {
        const activity = activityDetails.value;
        if (activity) {
            currentRow.cells[1].textContent = activity;
            modal.style.display = 'none';
            
            fetch('/industry/pi/ehs/jsa/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'activity=' + encodeURIComponent(activity)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Received data:', data);
                updateTableRow(currentRow, data);
                
            })
            .catch(error => {
                console.error('Error:', error);
                showError(error.message);
            });
        }
    });

    function downloadPdf() {
        downloadPdfButton.style.display = 'none';
        const element = document.body;
        const opt = {
            margin: 10,
            filename: 'job_safety_analysis.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };

        html2pdf().from(element).set(opt).save().then(function() {
            downloadPdfButton.style.display = 'block';
        });
    }
});