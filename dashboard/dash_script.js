// Market Chart
const marketCtx = document.getElementById('marketChart').getContext('2d');
const marketChart = new Chart(marketCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            label: 'Market Trends',
            data: [12, 19, 3, 5, 2],
            borderColor: '#2a5a5b',
            backgroundColor: 'rgba(42, 90, 91, 0.2)',
            fill: true,
        }]
    },
    options: {
        responsive: true,
    }
});

// Portfolio Chart
const portfolioCtx = document.getElementById('portfolioChart').getContext('2d');
const portfolioChart = new Chart(portfolioCtx, {
    type: 'bar',
    data: {
        labels: ['Stock A', 'Stock B', 'Stock C', 'Stock D'],
        datasets: [{
            label: 'Portfolio Distribution',
            data: [5, 10, 8, 15],
            backgroundColor: ['#223f3f', '#2a5a5b', '#d8efec', '#0f2324'],
        }]
    },
    options: {
        responsive: true,
    }
});
