document.addEventListener('DOMContentLoaded', function() {
    const generateButton = document.getElementById('generate');
    const problemInput = document.getElementById('problem');
    const diagram = document.getElementById('diagram');

    generateButton.addEventListener('click', generateFishbone);

    function generateFishbone() {
        const problem = problemInput.value.trim();
        if (problem === '') {
            alert('Please enter a problem statement.');
            return;
        }

        fetch('/industry/pi/ehs/deviation/analysis/fishbone/generate_fishbone', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ problem: problem }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            updateDiagram(problem, data);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while generating the diagram. Please try again.');
        });
    }

    function updateDiagram(problem, causes) {
        diagram.querySelector('.problem-statement').textContent = problem;
        
        for (const [category, causeList] of Object.entries(causes)) {
            const categoryElement = document.getElementById(category.toLowerCase());
            if (categoryElement) {
                categoryElement.querySelector('.causes').value = causeList.join('\n');
            }
        }

        diagram.style.display = 'block';
    }
});