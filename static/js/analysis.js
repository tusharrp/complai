function fetchDummyData() {
    fetch('/industry/pi/manufacturing/tpm/tpm/get_dummy_data')
        .then(response => response.json())
        .then(data => {
            // Use the data to update your charts
            updateCharts(data);
        })
        .catch(error => console.error('Error fetching dummy data:', error));
}

function updateCharts(data) {
    // Update your charts with the fetched data
    // For example:
    overallMaintenanceChart.data.datasets[0].data = [
        data.overallMaintenance.good,
        data.overallMaintenance.fair,
        data.overallMaintenance.poor
    ];
    overallMaintenanceChart.update();

    reactorInternalsChart.data.datasets[0].data = data.reactorInternals;
    reactorInternalsChart.update();

    // ... update other charts as needed ...
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing code ...
    fetchDummyData();
});

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initializeCharts();

    // Add interactivity to danger indicators
    initializeDangerIndicators();

    // Add dynamic table sorting
    initializeTableSorting();

    // Add scroll-to-top button
    addScrollToTopButton();

    // Initialize tooltips
    initializeTooltips();
});

function initializeCharts() {
    // Using Chart.js for demonstration. Make sure to include the Chart.js library in your HTML.
    // You'll need to add: <script src="https://cdn.jsdelivr.net/npm/chart.js"></script> to your HTML

    // Overall Maintenance Status Chart
    new Chart(document.getElementById('overallMaintenanceChart').getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Good', 'Fair', 'Poor'],
            datasets: [{
                data: [70, 20, 10],
                backgroundColor: ['#2ecc71', '#f1c40f', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Overall Maintenance Status'
            }
        }
    });

    // Reactor Internals Maintenance Chart
    new Chart(document.getElementById('reactorInternalsChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Maintenance Hours',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: '#3498db'
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Reactor Internals Maintenance Hours'
            }
        }
    });

    // Add more charts as needed
}

function initializeDangerIndicators() {
    const dangerIndicators = document.querySelectorAll('.danger-indicator');
    dangerIndicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            this.classList.toggle('expanded');
            const details = this.querySelector('.danger-details');
            if (details) {
                details.style.display = details.style.display === 'none' ? 'block' : 'none';
            }
        });
    });
}

function initializeTableSorting() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const headers = table.querySelectorAll('th');
        headers.forEach(header => {
            header.addEventListener('click', function() {
                const column = this.cellIndex;
                const rows = Array.from(table.querySelectorAll('tr')).slice(1);
                const isAscending = this.classList.contains('sorted-asc');
                
                rows.sort((a, b) => {
                    const aValue = a.cells[column].textContent;
                    const bValue = b.cells[column].textContent;
                    return isAscending ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
                });
                
                rows.forEach(row => table.appendChild(row));
                
                headers.forEach(h => h.classList.remove('sorted-asc', 'sorted-desc'));
                this.classList.toggle('sorted-asc', !isAscending);
                this.classList.toggle('sorted-desc', isAscending);
            });
        });
    });
}

function addScrollToTopButton() {
    const button = document.createElement('button');
    button.textContent = '↑';
    button.id = 'scrollToTop';
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: none;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 24px;
        cursor: pointer;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(button);

    window.addEventListener('scroll', function() {
        button.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    button.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initializeTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);
            
            const triggerRect = this.getBoundingClientRect();
            tooltip.style.cssText = `
                position: absolute;
                top: ${triggerRect.bottom + window.scrollY + 5}px;
                left: ${triggerRect.left + window.scrollX}px;
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                z-index: 1000;
            `;
        });

        trigger.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}