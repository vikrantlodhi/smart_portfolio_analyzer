document.getElementById('fetchStock').addEventListener('click', async () => {
    const symbol = document.getElementById('stockSymbol').value;
    const stockDataDiv = document.getElementById('stockData');
    const chartContainer = document.getElementById('stockChart');
    const stockPriceChart = document.getElementById('stockPriceChart').getContext('2d');

    if (!symbol) {
        stockDataDiv.innerHTML = '<p>Please enter a stock symbol.</p>';
        return;
    }

    const stockPriceData = await fetchStockData(symbol);

    if (!stockPriceData) {
        stockDataDiv.innerHTML = '<p>Error fetching stock data. Please try again later.</p>';
        return;
    }

    // Display initial stock data and chart
    displayStockData(stockPriceData, symbol, stockDataDiv);
    createStockChart(stockPriceData, symbol, stockPriceChart);

    // Set up real-time updates every 1 minute (60000 ms)
    setInterval(async () => {
        const updatedData = await fetchStockData(symbol);
        if (updatedData) {
            displayStockData(updatedData, symbol, stockDataDiv);
            updateStockChart(updatedData, stockPriceChart);
        }
    }, 60000); // Update every 1 minute
});

// Fetch stock data from API
async function fetchStockData(symbol) {
    const apiUrl = `http://localhost:3000/stocks/${symbol}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data['Error Message']) {
            console.error('Error fetching stock data');
            return null;
        }

        return data['Time Series (1min)'];
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return null;
    }
}

// Display stock data in the UI
function displayStockData(stockData, symbol, stockDataDiv) {
    const latestTime = Object.keys(stockData)[0];
    const stockInfo = stockData[latestTime];

    stockDataDiv.innerHTML = `
        <h2>${symbol.toUpperCase()}</h2>
        <p><strong>Time:</strong> ${latestTime}</p>
        <p><strong>Open:</strong> ${stockInfo['1. open']}</p>
        <p><strong>High:</strong> ${stockInfo['2. high']}</p>
        <p><strong>Low:</strong> ${stockInfo['3. low']}</p>
        <p><strong>Close:</strong> ${stockInfo['4. close']}</p>
        <p><strong>Volume:</strong> ${stockInfo['5. volume']}</p>
    `;
}

// Create the stock price chart
function createStockChart(stockData, symbol, stockPriceChart) {
    const labels = Object.keys(stockData);
    const prices = labels.map(key => stockData[key]['4. close']);

    new Chart(stockPriceChart, {
        type: 'line',
        data: {
            labels: labels.slice(0, 10), // Show only the last 10 data points for readability
            datasets: [{
                label: `${symbol.toUpperCase()} Price`,
                data: prices.slice(0, 10),
                borderColor: '#2980b9',
                backgroundColor: 'rgba(41, 128, 185, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { beginAtZero: false }
            }
        }
    });
}

// Update the stock price chart
function updateStockChart(stockData, stockPriceChart) {
    const labels = Object.keys(stockData);
    const prices = labels.map(key => stockData[key]['4. close']);

    const chartInstance = Chart.getChart(stockPriceChart); // Get the current chart instance
    chartInstance.data.labels = labels.slice(0, 10); // Update the labels
    chartInstance.data.datasets[0].data = prices.slice(0, 10); // Update the data

    chartInstance.update(); // Update the chart with the new data
}
