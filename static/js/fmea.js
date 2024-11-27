document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate');
    const inputText = document.getElementById('input-text');
    const resultTextareas = document.querySelectorAll('.result');

    generateButton.addEventListener('click', handleGenerateFMEA);

    async function handleGenerateFMEA() {
        const input = inputText.value.trim();
        if (!input) {
            alert('Please enter your FMEA input.');
            return;
        }

        try {
            const data = await generateFMEA(input);
            console.log('Data received:', data);
            updateSteps(data);
        } catch (error) {
            console.error('Error:', error);
            alert(`An error occurred while generating the FMEA: ${error.message}`);
        }
    }

    async function generateFMEA(input) {
        console.log('Sending request with input:', input);

        const response = await fetch('/industry/pi/ehs/deviation/analysis/fmea/generate_fmea', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: input }),
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        if (data.error) {
            throw new Error(data.error);
        }

        if (data.filters) {
            console.warn('Response filtered:', data.filters);
            throw new Error('The API response was filtered. Please try a different input.');
        }

        return data;
    }

    function updateSteps(results) {
        console.log('Updating steps with:', results);

        for (let i = 1; i <= 5; i++) {
            const stepElement = document.getElementById(`step${i}`);
            if (stepElement) {
                const resultElement = stepElement.querySelector('.result');
                if (resultElement) {
                    resultElement.value = results[`${i}. ${getStepName(i)}`] || '';
                }
            }
        }

        console.log('Updated steps with:', results);
    }

    function getStepName(stepNumber) {
        const stepNames = [
            "Determining failure mode",
            "Assessing severity",
            "Assigning probability number",
            "Assigning detection number",
            "Calculating risk priority number"
        ];
        return stepNames[stepNumber - 1] || "";
    }
});