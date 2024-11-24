// Function to calculate future value
function calculateFutureValue(principal, rate, duration) {
    return principal * Math.pow(1 + (rate / 100), duration);
}

// Function to open the specific calculator popup
function openCalculator(calculatorType) {
    const popup = document.getElementById(`${calculatorType}-popup`);
    if (popup) {
        popup.style.display = 'flex';
    }
}

// Function to close the popup and clear input data
function closePopup(calculatorType) {
    const popup = document.getElementById(`${calculatorType}-popup`);
    if (popup) {
        popup.style.display = 'none';
    }
    // Clear form fields if needed
    if (calculatorType === 'fd') {
        document.getElementById('fd-form').reset();
        document.getElementById('fd-result').textContent = '';
        document.getElementById('fd-total-interest').textContent = '';
    }
    if (calculatorType === 'sip') {
        document.getElementById('sip-form').reset();
        document.getElementById('sip-result').textContent = '';
        document.getElementById('sip-total-investment').textContent = '';
        document.getElementById('sip-real-returns').textContent = '';
    }
    if (calculatorType === 'commodities') {
        document.getElementById('commodities-form').reset();
        document.getElementById('commodities-result').textContent = '';
        document.getElementById('commodities-profit-loss').textContent = '';
    }
    if (calculatorType === 'stocks') {
        document.getElementById('stocks-form').reset();
        document.getElementById('stocks-result').textContent = '';
    }
    if (calculatorType === 'mutual') {
        document.getElementById('mutual-form').reset();
        document.getElementById('mutual-result').textContent = '';
    }
    if (calculatorType === 'pension') {
        document.getElementById('pension-form').reset();
        document.getElementById('pension-result').textContent = '';
    }
}

// FD Calculator Logic with Compound Interest and Frequency
document.getElementById('fd-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const principal = parseFloat(document.getElementById('fd-principal').value);
    const rate = parseFloat(document.getElementById('fd-rate').value);
    const tenure = parseFloat(document.getElementById('fd-tenure').value);
    const frequency = parseFloat(document.getElementById('fd-frequency').value);

    if (isNaN(principal) || isNaN(rate) || isNaN(tenure) || isNaN(frequency) || principal <= 0 || rate <= 0 || tenure <= 0 || frequency <= 0) {
        document.getElementById('fd-result').textContent = 'Please enter valid positive values for all fields';
        document.getElementById('fd-total-interest').textContent = '';
        return;
    }

    const n = frequency;  // Number of times interest is compounded per year
    const t = tenure;     // Tenure in years
    const r = rate / 100; // Annual interest rate (in decimal form)

    const maturityAmount = principal * Math.pow(1 + r / n, n * t); // Maturity Amount = P * (1 + r/n)^(n*t)
    const totalInterest = maturityAmount - principal; // Total Interest Earned = Maturity Amount - Principal

    document.getElementById('fd-result').textContent = `Maturity Amount: ₹${maturityAmount.toFixed(2)}`;
    document.getElementById('fd-total-interest').textContent = `Total Interest Earned: ₹${totalInterest.toFixed(2)}`;
});

// Function to calculate SIP
function calculateSIP(principal, rate, duration, stepUp = 0, inflation = 0) {
    const monthlyRate = rate / (12 * 100);
    const months = duration * 12;
    let maturityAmount = 0;
    let totalInvestment = 0;

    for (let i = 1; i <= months; i++) {
        maturityAmount += principal * Math.pow(1 + monthlyRate, months - i + 1);
        totalInvestment += principal;

        // Apply step-up increment yearly
        if (i % 12 === 0) {
            principal += (principal * stepUp) / 100;
        }
    }

    // Adjust for inflation if provided
    const realRate = (1 + rate / 100) / (1 + inflation / 100) - 1;
    const realReturns = maturityAmount * Math.pow(1 + realRate, duration);

    return { maturityAmount, totalInvestment, realReturns };
}

// SIP Form Submission
document.getElementById('sip-form')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const principal = parseFloat(document.getElementById('sip-principal').value);
    const rate = parseFloat(document.getElementById('sip-rate').value);
    const duration = parseFloat(document.getElementById('sip-duration').value);
    const stepUp = parseFloat(document.getElementById('sip-stepup').value) || 0;
    const inflation = parseFloat(document.getElementById('sip-inflation').value) || 0;

    if (isNaN(principal) || isNaN(rate) || isNaN(duration) || principal <= 0 || rate <= 0 || duration <= 0) {
        document.getElementById('sip-result').textContent = 'Please enter valid positive values.';
        return;
    }

    const { maturityAmount, totalInvestment, realReturns } = calculateSIP(principal, rate, duration, stepUp, inflation);

    document.getElementById('sip-result').textContent = `Maturity Amount: ₹${maturityAmount.toFixed(2)}`;
    document.getElementById('sip-total-investment').textContent = `Total Investment: ₹${totalInvestment.toFixed(2)}`;
    document.getElementById('sip-real-returns').textContent = inflation > 0 ? 
        `Real Returns (Adjusted for Inflation): ₹${realReturns.toFixed(2)}` : '';
});

// Commodities Calculator Logic
// Function to fetch current price of selected commodity
function fetchCurrentPrice(commodity) {
    let url = '';

    // Free API URL for commodity prices (using metals API as an example)
    if (commodity === 'gold') {
        url = 'https://api.metalpriceapi.com/v1/latest'; // Gold price (XAU is the symbol for gold)
    } else if (commodity === 'silver') {
        url = 'https://metals-api.com/api/latest?base=USD&symbols=XAG&access_key=YOUR_API_KEY'; // Silver price (XAG is the symbol for silver)
    } else if (commodity === 'crudeOil') {
        url = 'https://api.coindesk.com/v1/bpi/currentprice.json'; // Example API for crude oil or similar data
    }

    // Fetch the price using fetch API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let currentPrice;
            if (commodity === 'gold' || commodity === 'silver') {
                // For metals, the price data is in a specific structure
                currentPrice = data.rates[commodity === 'gold' ? 'XAU' : 'XAG']; // Get the price of the selected commodity
            } else if (commodity === 'crudeOil') {
                // Adjust according to your chosen API for crude oil
                currentPrice = data.bpi.USD.rate_float; // For example, use this if it's a JSON structure
            }

            // Set the current price in the input field
            if (currentPrice) {
                document.getElementById('current-price').value = currentPrice.toFixed(2);
            } else {
                document.getElementById('current-price').value = 'N/A'; // Fallback if no price is found
            }
        })
        .catch(error => {
            console.error('Error fetching price:', error);
        });
}

// Event listener for when commodity is selected
document.getElementById('commodity-select').addEventListener('change', function() {
    const selectedCommodity = this.value;
    fetchCurrentPrice(selectedCommodity);
});

// Commodities Calculator Logic
document.getElementById('commodities-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const commodity = document.getElementById('commodity-select').value;
    const principal = parseFloat(document.getElementById('principal').value);
    const boughtPrice = parseFloat(document.getElementById('bought-price').value);
    const currentPrice = parseFloat(document.getElementById('current-price').value);
    const rate = parseFloat(document.getElementById('rate').value);
    const duration = parseFloat(document.getElementById('duration').value);

    // Validation
    if (isNaN(principal) || isNaN(boughtPrice) || isNaN(currentPrice) || isNaN(rate) || isNaN(duration)) {
        document.getElementById('commodities-result').textContent = 'Please enter valid values for all fields.';
        document.getElementById('commodities-profit-loss').textContent = '';
        return;
    }

    // Calculate Profit or Loss
    const profitLoss = (currentPrice - boughtPrice) * (principal / boughtPrice); // Assuming principal is amount invested
    const profitLossText = profitLoss >= 0 ? `Profit: ₹${profitLoss.toFixed(2)}` : `Loss: ₹${Math.abs(profitLoss).toFixed(2)}`;

    // Calculate Future Value
    const futureValue = calculateFutureValue(principal, rate, duration);

    // Display Results
    document.getElementById('commodities-result').textContent = `Future Value: ₹${futureValue.toFixed(2)}`;
    document.getElementById('commodities-profit-loss').textContent = profitLossText;
});

// Function to calculate future value of investments (same logic as before)
function calculateFutureValue(principal, rate, duration) {
    return principal * Math.pow(1 + (rate / 100), duration);
}

// Fetch the current price when the page loads for the default selected commodity
fetchCurrentPrice(document.getElementById('commodity-select').value);


// Stocks Calculator Logic
document.getElementById('stocks-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const principal = parseFloat(document.getElementById('stocks-principal').value);
    const rate = parseFloat(document.getElementById('stocks-rate').value);
    const duration = parseFloat(document.getElementById('stocks-duration').value);

    if (isNaN(principal) || isNaN(rate) || isNaN(duration) || principal <= 0 || rate <= 0 || duration <= 0) {
        document.getElementById('stocks-result').textContent = 'Please enter valid positive values';
        return;
    }

    const futureValue = calculateFutureValue(principal, rate, duration);
    document.getElementById('stocks-result').textContent = `Future Value: ₹${futureValue.toFixed(2)}`;
});

// Mutual Fund Calculator Logic
document.getElementById('mutual-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const principal = parseFloat(document.getElementById('mutual-principal').value);
    const rate = parseFloat(document.getElementById('mutual-rate').value);
    const duration = parseFloat(document.getElementById('mutual-duration').value);

    if (isNaN(principal) || isNaN(rate) || isNaN(duration) || principal <= 0 || rate <= 0 || duration <= 0) {
        document.getElementById('mutual-result').textContent = 'Please enter valid positive values';
        return;
    }

    const futureValue = calculateFutureValue(principal, rate, duration);
    document.getElementById('mutual-result').textContent = `Future Value: ₹${futureValue.toFixed(2)}`;
});

// Pension Fund Calculator Logic
document.getElementById('pension-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const principal = parseFloat(document.getElementById('pension-principal').value);
    const rate = parseFloat(document.getElementById('pension-rate').value);
    const duration = parseFloat(document.getElementById('pension-duration').value);

    if (isNaN(principal) || isNaN(rate) || isNaN(duration) || principal <= 0 || rate <= 0 || duration <= 0) {
        document.getElementById('pension-result').textContent = 'Please enter valid positive values';
        return;
    }

    const futureValue = calculateFutureValue(principal, rate, duration);
    document.getElementById('pension-result').textContent = `Future Value: ₹${futureValue.toFixed(2)}`;
});
