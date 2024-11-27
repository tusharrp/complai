let currentDate = new Date();
let workOrders = {};

function generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const monthYearString = firstDay.toLocaleString('default', { month: 'long', year: 'numeric' });
    document.getElementById('monthYear').textContent = monthYearString;

    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';

    for (let i = 0; i < startingDay; i++) {
        calendarDays.appendChild(document.createElement('div'));
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = i;

        const currentDateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
        if (workOrders[currentDateString]) {
            const indicator = document.createElement('div');
            indicator.classList.add('work-order-indicator');
            indicator.classList.add(getHighestPriorityStatus(workOrders[currentDateString]));
            dayElement.appendChild(indicator);
        }

        if (year === currentDate.getFullYear() && month === currentDate.getMonth() && i === currentDate.getDate()) {
            dayElement.classList.add('today');
        }

        dayElement.addEventListener('click', () => showWorkOrders(currentDateString));
        calendarDays.appendChild(dayElement);
    }
}

function getHighestPriorityStatus(orders) {
    if (orders.some(order => order.status === 'in-progress')) return 'in-progress';
    if (orders.some(order => order.status === 'initiated')) return 'initiated';
    if (orders.some(order => order.status === 'pending')) return 'pending';
    return 'completed';
}

function showWorkOrders(date) {
    const workOrderList = document.getElementById('workOrderList');
    workOrderList.innerHTML = '';
    document.getElementById('selectedDate').textContent = date;

    if (workOrders[date]) {
        workOrders[date].forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.classList.add('work-order-item');
            orderElement.classList.add(order.status);
            orderElement.textContent = `${order.id}: ${order.description} (${order.status})`;
            workOrderList.appendChild(orderElement);
        });
    } else {
        workOrderList.textContent = 'No work orders for this date.';
    }
}

document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

// Sample data - replace this with actual data from your backend
workOrders = {
    '2023-07-01': [
        { id: 'WO001', description: 'Fix broken pipe', status: 'completed' },
        { id: 'WO002', description: 'Replace light bulbs', status: 'pending' }
    ],
    '2023-07-15': [
        { id: 'WO003', description: 'Repair AC unit', status: 'in-progress' }
    ],
    '2023-07-22': [
        { id: 'WO004', description: 'Paint office walls', status: 'initiated' }
    ]
};

generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Sample workOrders data (replace with your actual data)
    let workOrders = {
        '2023-07-01': [
            { id: 'WO001', description: 'Fix broken pipe', status: 'completed' },
            { id: 'WO002', description: 'Replace light bulbs', status: 'pending' }
        ],
        '2023-07-15': [
            { id: 'WO003', description: 'Repair AC unit', status: 'in-progress' }
        ],
        '2023-07-22': [
            { id: 'WO004', description: 'Paint office walls', status: 'initiated' }
        ]
    };

    // Function to update legend with counts
    function updateLegendCounts() {
        const legendItems = document.querySelectorAll('.legend-item');
        let pendingCount = 0,
            initiatedCount = 0,
            inProgressCount = 0,
            completedCount = 0;

        // Count work orders by status
        Object.values(workOrders).forEach(orders => {
            orders.forEach(order => {
                switch (order.status) {
                    case 'pending':
                        pendingCount++;
                        break;
                    case 'initiated':
                        initiatedCount++;
                        break;
                    case 'in-progress':
                        inProgressCount++;
                        break;
                    case 'completed':
                        completedCount++;
                        break;
                    default:
                        break;
                }
            });
        });

        // Update legend item counts
        legendItems[0].querySelector('#pendingCount').textContent = pendingCount;
        legendItems[1].querySelector('#initiatedCount').textContent = initiatedCount;
        legendItems[2].querySelector('#inProgressCount').textContent = inProgressCount;
        legendItems[3].querySelector('#completedCount').textContent = completedCount;
    }

    // Initial update when the page loads
    updateLegendCounts();
});

