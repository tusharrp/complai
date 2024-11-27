document.addEventListener('DOMContentLoaded', function() {
    const analyzeButton = document.getElementById('analyze');
    const questionsContainer = document.getElementById('questions');
    const resultsContainer = document.getElementById('results');

    analyzeButton.addEventListener('click', analyzeWhy);

    function analyzeWhy() {
        const lastWhyInput = questionsContainer.querySelector('.why-question:last-child input');
        if (lastWhyInput.value.trim() === '') {
            alert('Please enter a why question.');
            return;
        }

        const whyDetails = lastWhyInput.value;

        fetch('/industry/pi/ehs/deviation/analysis/why/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ whyDetails: whyDetails }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            displayResults(data);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while analyzing. Please try again.');
        });
    }

    function displayResults(options) {
        resultsContainer.innerHTML = '';
        const terminalDiv = document.createElement('div');
        terminalDiv.className = 'terminal';

        const displayOptions = options.length === 3 ? options : [
            options[0] || 'No result',
            options[1] || 'No result',
            options[2] || 'No result'
        ];

        displayOptions.forEach((option) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', () => addNextWhy(option));
            terminalDiv.appendChild(button);
        });

        resultsContainer.appendChild(terminalDiv);
    }

    function addNextWhy(whyText) {
        const newWhyDiv = document.createElement('div');
        newWhyDiv.className = 'why-question';

        const label = document.createElement('label');
        label.textContent = 'Why?';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'why-input';
        input.value = whyText;

        newWhyDiv.appendChild(label);
        newWhyDiv.appendChild(input);
        questionsContainer.appendChild(newWhyDiv);

        resultsContainer.innerHTML = '';
    }
});
