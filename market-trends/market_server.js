const express = require('express');
const axios = require('axios');
const cors = require('cors'); // CORS package to handle cross-origin requests

const app = express();
const PORT = 3000;

// Enable CORS for all origins
app.use(cors());

// Endpoint to fetch stock data
app.get('/stocks/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    const apiKey = 'YOUR_API_KEY'; // Replace with your API key
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`;

    try {
        const response = await axios.get(url);
        res.json(response.data); // Send stock data to frontend
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching stock data');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
