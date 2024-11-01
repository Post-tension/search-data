const apiKey = 'AIzaSyAaoonqQDk_uxT9gIaH0ctGzcVvwcdtSa0';
const spreadsheetId = '1O29p24mJmX-fvEtLw3Ia1WSmh-_nVS_AdOk8Ap6hoq0';
const range = 'Sheet1!A1:Y135';

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
async function fetchData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Data fetched:", data);
        return data.values;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
function displayResults(results, errorMessage = null) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (errorMessage) {
        resultsDiv.innerHTML = `<p>${errorMessage}</p>`;
        return;
    }

    if (results.length > 0) {
        const table = document.createElement('table');
        
        // Header table
        const headerRow = document.createElement('tr');
        results[0].forEach((_, index) => {
            const th = document.createElement('th');
            th.textContent = `Kolom ${index + 1}`; // Nama kolom contoh, sesuaikan jika Anda tahu kolomnya
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Isi tabel
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
