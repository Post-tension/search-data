const apiKey = 'AIzaSyAaoonqQDk_uxT9gIaH0ctGzcVvwcdtSa0';
const spreadsheetId = '2PACX-1vTkJlUGoQSS8-MeAXttwmJCF3EUE-Zay5icg5YbxbjZ6RjOqgTXu3-zA7DlOW0NxA';
const range = 'Monitoring Kalibrasi!A1:Y1000';

async function fetchData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.values;
}

async function searchData() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const data = await fetchData();
    const results = data.filter(row => row.some(cell => cell.toLowerCase().includes(searchTerm)));

    displayResults(results);
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (results.length > 0) {
        const table = document.createElement('table');
        results.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
        resultsDiv.appendChild(table);
    } else {
        resultsDiv.innerHTML = '<p>No results found.</p>';
    }
}
