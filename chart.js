// Global variables
let chartInstance = null;
let csvData = null;
let selectedIndices = [];
const MAX_SELECTIONS = 4;

// Index categories
const categories = {
    broad: ['NIFTY 50', 'NIFTY NEXT 50', 'NIFTY 100', 'NIFTY 200', 'Nifty Total Market', 'NIFTY 500', 'NIFTY MIDCAP 150', 'NIFTY MIDCAP 50', 'Nifty Midcap Select', 'NIFTY Midcap 100', 'NIFTY SMALLCAP 250', 'NIFTY SMALLCAP 50', 'NIFTY SMALLCAP 100', 'NIFTY MICROCAP 250'],
    sectoral: ['NIFTY AUTO', 'NIFTY BANK', 'NIFTY CHEMICALS', 'NIFTY FINANCIAL SERVICES', 'NIFTY FMCG', 'Nifty HEALTHCARE', 'NIFTY IT', 'NIFTY MEDIA', 'NIFTY METAL', 'NIFTY PHARMA', 'NIFTY PRIVATE BANK', 'NIFTY PSU BANK', 'NIFTY REALTY', 'NIFTY CONSUMER DURABLES', 'NIFTY OIL AND GAS INDEX'],
    strategy: ['NIFTY 100 EQUAL WEIGHT', 'NIFTY 100 LOW VOLATILITY 30', 'NIFTY200 MOMENTUM 30', 'NIFTY200 ALPHA 30', 'NIFTY100 ALPHA 30', 'NIFTY ALPHA 50', 'NIFTY DIVIDEND OPPORTUNITIES 50', 'NIFTY GROWTH SECTORS 15', 'NIFTY HIGH BETA 50', 'NIFTY LOW VOLATILITY 50', 'NIFTY100 QUALITY 30', 'NIFTY Midcap150 Momentum 50', 'NIFTY500 MOMENTUM 50', 'NIFTY500 QUALITY 50', 'NIFTY50 VALUE 20', 'Nifty200 Value 30', 'NIFTY500 VALUE 50'],
    thematic: ['Nifty Capital Markets', 'NIFTY COMMODITIES', 'Nifty Core Housing', 'NIFTY CPSE', 'NIFTY ENERGY', 'Nifty EV & New Age Automotive', 'Nifty Housing', 'NIFTY INDIA CONSUMPTION', 'Nifty India Defence', 'Nifty India Digital', 'NIFTY INFRASTRUCTURE', 'Nifty India Manufacturing', 'NIFTY INDIA TOURISM', 'Nifty Mobility', 'NIFTY PSE', 'Nifty Rural', 'NIFTY SERVICES SECTOR']
};

const colors = ['#5DADE2', '#5B4FCF', '#48C9B0', '#E74C3C'];

// Load and parse CSV
async function loadCSV() {
    try {
        const response = await fetch('Latest_Indices_rawdata_14112025.csv');
        const text = await response.text();
        csvData = parseCSV(text);
        populateDropdowns();
        updateSelectionCount();
    } catch (error) {
        console.error('Error loading CSV:', error);
    }
}

function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const data = {};
    headers.forEach(header => {
        if (header !== 'DATE') {
            data[header] = [];
        }
    });
    
    const dates = [];
    
    // Parse in reverse order to get chronological order (oldest first)
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= headers.length) {
            rows.push(values);
        }
    }
    
    // Reverse to get oldest dates first
    rows.reverse();
    
    for (let i = 0; i < rows.length; i++) {
        const values = rows[i];
        // Parse date (dd/mm/yy format)
        const dateParts = values[0].trim().split('/');
        const date = new Date(2000 + parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
        dates.push(date.getTime());
        
        headers.forEach((header, index) => {
            if (header !== 'DATE' && index < values.length) {
                const value = parseFloat(values[index].trim());
                if (!isNaN(value)) {
                    data[header].push(value);
                } else {
                    data[header].push(null);
                }
            }
        });
    }
    
    return { dates, data, headers: headers.filter(h => h !== 'DATE') };
}

function populateDropdowns() {
    populateDropdown('broad-select', categories.broad);
    populateDropdown('sectoral-select', categories.sectoral);
    populateDropdown('strategy-select', categories.strategy);
    populateDropdown('thematic-select', categories.thematic);
}

function populateDropdown(selectId, indices) {
    const select = document.getElementById(selectId);
    const categoryName = selectId.replace('-select', '');
    
    indices.forEach(index => {
        if (csvData.headers.includes(index)) {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = index;
            select.appendChild(option);
        }
    });
}

function selectIndex(selectElement, category) {
    const value = selectElement.value;
    
    if (!value) return;
    
    // Check if already selected
    const existing = selectedIndices.find(item => item.index === value);
    if (existing) {
        selectElement.value = '';
        return;
    }
    
    // Check limit
    if (selectedIndices.length >= MAX_SELECTIONS) {
        alert(`You can only select up to ${MAX_SELECTIONS} indices at a time.`);
        selectElement.value = '';
        return;
    }
    
    selectedIndices.push({
        index: value,
        category: category,
        selectId: selectElement.id
    });
    
    updateSelectionCount();
    updateChart();
    
    // Disable other selects if limit reached
    updateSelectStates();
}

function clearAllSelections() {
    selectedIndices = [];
    
    // Reset all dropdowns
    document.getElementById('broad-select').value = '';
    document.getElementById('sectoral-select').value = '';
    document.getElementById('strategy-select').value = '';
    document.getElementById('thematic-select').value = '';
    
    updateSelectionCount();
    updateSelectStates();
    
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
}

function updateSelectStates() {
    const selects = document.querySelectorAll('.category-select');
    const atLimit = selectedIndices.length >= MAX_SELECTIONS;
    
    selects.forEach(select => {
        const hasSelection = selectedIndices.some(item => item.selectId === select.id);
        select.disabled = atLimit && !hasSelection;
    });
}

function updateSelectionCount() {
    document.getElementById('selection-count').textContent = selectedIndices.length;
    updateSelectedIndicesDisplay();
}

function updateSelectedIndicesDisplay() {
    const container = document.getElementById('selected-indices-display');
    container.innerHTML = '';
    
    selectedIndices.forEach((item, index) => {
        const tag = document.createElement('div');
        tag.className = 'index-tag';
        
        const colorDot = document.createElement('span');
        colorDot.className = 'index-color-dot';
        colorDot.style.backgroundColor = colors[index];
        
        const name = document.createElement('span');
        name.textContent = item.index;
        
        const removeBtn = document.createElement('span');
        removeBtn.className = 'index-remove';
        removeBtn.textContent = '×';
        removeBtn.onclick = () => removeIndex(item.index);
        
        tag.appendChild(colorDot);
        tag.appendChild(name);
        tag.appendChild(removeBtn);
        
        container.appendChild(tag);
    });
}

function removeIndex(indexName) {
    // Find and remove the index
    const indexToRemove = selectedIndices.findIndex(item => item.index === indexName);
    if (indexToRemove === -1) return;
    
    const item = selectedIndices[indexToRemove];
    selectedIndices.splice(indexToRemove, 1);
    
    // Reset the dropdown
    const select = document.getElementById(item.selectId);
    if (select) {
        select.value = '';
    }
    
    updateSelectionCount();
    updateSelectStates();
    updateChart();
}

function calculatePercentageChange(prices) {
    if (!prices || prices.length === 0) return [];
    
    // Find first non-null value as baseline
    let basePrice = null;
    let baseIndex = 0;
    for (let i = 0; i < prices.length; i++) {
        if (prices[i] !== null && !isNaN(prices[i])) {
            basePrice = prices[i];
            baseIndex = i;
            break;
        }
    }
    
    if (basePrice === null) return [];
    
    const result = [];
    // Add starting point at 0%
    result.push({
        x: csvData.dates[baseIndex],
        y: 0,
        price: basePrice
    });
    
    // Calculate percentage change for remaining points
    for (let i = baseIndex + 1; i < prices.length; i++) {
        if (prices[i] === null || isNaN(prices[i])) {
            result.push({
                x: csvData.dates[i],
                y: null,
                price: null
            });
        } else {
            result.push({
                x: csvData.dates[i],
                y: ((prices[i] - basePrice) / basePrice) * 100,
                price: prices[i]
            });
        }
    }
    
    return result;
}

function updateChart() {
    if (selectedIndices.length === 0) {
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }
        return;
    }
    
    const series = selectedIndices.map((item, index) => {
        const prices = csvData.data[item.index];
        const percentageData = calculatePercentageChange(prices);
        
        return {
            name: item.index,
            data: percentageData,
            type: 'line',
            color: colors[index],
            lineWidth: 2,
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: true,
                        radius: 4
                    }
                }
            },
            showInNavigator: index === 0
        };
    });
    
    const isDark = document.body.classList.contains('dark-mode');
    
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    chartInstance = Highcharts.stockChart('chart', {
        chart: {
            backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
            style: {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            },
            zooming: {
                mouseWheel: {
                    enabled: true,
                    sensitivity: 1.1
                }
            }
        },
        rangeSelector: {
            enabled: false
        },
        navigator: {
            enabled: true,
            height: 40,
            margin: 10,
            maskFill: isDark ? 'rgba(100, 149, 237, 0.2)' : 'rgba(100, 149, 237, 0.1)',
            outlineColor: isDark ? '#6495ED' : '#4a90e2',
            outlineWidth: 1,
            handles: {
                backgroundColor: isDark ? '#4a90e2' : '#6495ED',
                borderColor: isDark ? '#2c5282' : '#2c5282'
            },
            xAxis: {
                labels: {
                    style: {
                        color: isDark ? '#aaa' : '#666'
                    }
                },
                gridLineColor: isDark ? '#333' : '#e0e0e0'
            },
            series: {
                lineColor: isDark ? '#6495ED' : '#4a90e2',
                fillOpacity: 0.05,
                lineWidth: 1
            }
        },
        scrollbar: {
            enabled: false
        },
        title: {
            text: null
        },
        xAxis: {
            type: 'datetime',
            lineColor: isDark ? '#555' : '#e0e0e0',
            tickColor: isDark ? '#555' : '#e0e0e0',
            labels: {
                style: {
                    color: isDark ? '#aaa' : '#666'
                }
            },
            gridLineColor: isDark ? '#333' : '#f0f0f0',
            gridLineWidth: 1
        },
        yAxis: {
            title: {
                text: null
            },
            labels: {
                format: '{value}%',
                align: 'right',
                x: -10,
                style: {
                    color: isDark ? '#aaa' : '#666'
                }
            },
            opposite: true,
            gridLineColor: isDark ? '#333' : '#f0f0f0',
            plotLines: [{
                value: 0,
                color: isDark ? '#555' : '#ccc',
                width: 1,
                zIndex: 2
            }]
        },
        tooltip: {
            shared: true,
            crosshairs: true,
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
            style: {
                color: isDark ? '#e0e0e0' : '#333'
            },
            formatter: function() {
                let tooltip = '<b>' + Highcharts.dateFormat('%e %b %Y', this.x) + '</b><br/>';
                this.points.forEach(point => {
                    const price = point.point.price;
                    const percentage = point.y;
                    const priceFormatted = price ? price.toFixed(2) : 'N/A';
                    const percentageFormatted = percentage !== null ? percentage.toFixed(2) : '0.00';
                    const sign = percentage > 0 ? '+' : '';
                    
                    tooltip += '<span style="color:' + point.color + '">●</span> ' + 
                               point.series.name + ': <b>' + priceFormatted + '</b> ' +
                               '(' + sign + percentageFormatted + '%)<br/>';
                });
                return tooltip;
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        plotOptions: {
            series: {
                animation: {
                    duration: 800
                },
                states: {
                    hover: {
                        lineWidthPlus: 1
                    }
                },
                showInNavigator: true
            }
        },
        series: series
    });
    
    updateDateRange();
}

function setZoom(period) {
    // Remove active class from all buttons
    document.querySelectorAll('.zoom-btn').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    if (!chartInstance || !csvData) return;
    
    // Get the latest date from the data
    const maxDate = Math.max(...csvData.dates);
    let startTime;
    
    switch(period) {
        case '1m':
            startTime = maxDate - 30 * 24 * 60 * 60 * 1000;
            break;
        case '3m':
            startTime = maxDate - 90 * 24 * 60 * 60 * 1000;
            break;
        case '6m':
            startTime = maxDate - 180 * 24 * 60 * 60 * 1000;
            break;
        case 'ytd':
            const maxDateObj = new Date(maxDate);
            const yearStart = new Date(maxDateObj.getFullYear(), 0, 1);
            startTime = yearStart.getTime();
            break;
        case '1y':
            startTime = maxDate - 365 * 24 * 60 * 60 * 1000;
            break;
        case 'all':
            chartInstance.xAxis[0].setExtremes(null, null);
            updateDateRange();
            return;
    }
    
    chartInstance.xAxis[0].setExtremes(startTime, maxDate);
    updateDateRange();
}

function updateDateRange() {
    if (!chartInstance) return;
    
    const xAxis = chartInstance.xAxis[0];
    const extremes = xAxis.getExtremes();
    
    const startDate = new Date(extremes.min);
    const endDate = new Date(extremes.max);
    
    document.getElementById('date-start').textContent = formatDate(startDate);
    document.getElementById('date-end').textContent = formatDate(endDate);
}

function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('mode-icon').textContent = isDark ? '☀️' : '🌙';
    document.getElementById('mode-text').textContent = isDark ? 'Light Mode' : 'Dark Mode';
    
    // Refresh chart with new theme
    if (chartInstance) {
        updateChart();
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    loadCSV();
});
