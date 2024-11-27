console.log('JavaScript file loaded');

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded');

    const modal = document.getElementById('rephraseModal');
    const modalInputText = document.getElementById('modalInputText');
    const modalSubmitButton = document.getElementById('modalSubmitButton');
    const modalCloseButton = document.getElementById('modalCloseButton');
    let currentTextarea = null;

    function resizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
    }

    // Add double-click event listener to all textareas
    document.querySelectorAll('.report-textarea').forEach(textarea => {
        textarea.addEventListener('dblclick', function(event) {
            console.log('Textarea double-clicked');
            event.preventDefault();
            currentTextarea = this;
            modalInputText.value = this.value;
            modal.style.display = 'block';
        });

        // Add input event listener for dynamic resizing
        textarea.addEventListener('input', function() {
            resizeTextarea(this);
        });
    });

    // Close modal when clicking the close button
    modalCloseButton.addEventListener('click', function() {
        console.log('Close button clicked');
        modal.style.display = 'none';
    });

    // Rephrase functionality
    modalSubmitButton.addEventListener('click', function () {
        console.log('Submit button clicked');
        const text = modalInputText.value.trim();
        if (text) {
            console.log('Sending request to server with text:', text);
            fetch('/industry/pi/manufacturing/tpm/tpm/rephrase_text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: text })
            })
            .then(response => {
                console.log('Received response:', response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Parsed data:', data);
                if (data.rephrased_text) {
                    if (currentTextarea) {
                        currentTextarea.value = data.rephrased_text;
                        resizeTextarea(currentTextarea);
                        console.log('Updated textarea with rephrased text and resized');
                    } else {
                        console.error('No current textarea found');
                    }
                    modal.style.display = 'none';
                } else {
                    console.error('No rephrased_text in response');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to rephrase text: ' + error.message);
            });
        } else {
            console.log('No text to rephrase');
            alert('Please enter some text to rephrase.');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const saveReportBtn = document.getElementById('saveReportBtn');
    
    saveReportBtn.addEventListener('click', function() {
        saveReport();
    });
});

