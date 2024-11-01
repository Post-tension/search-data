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

    // Indeks kolom yang ingin ditampilkan, misal kolom "Keterangan" (index 1) dan kolom "Harga" (index 3)
    const selectedColumns = [1, 3]; 
    const columnLabels = ["Keterangan", "Harga"]; // Label kolom sesuai urutan di selectedColumns

    if (results.length > 0) {
        results.forEach(row => {
            const card = document.createElement('div');
            card.classList.add('result-card');
            
            selectedColumns.forEach((colIndex, i) => {
                const label = document.createElement('p');
                label.classList.add('result-label');
                label.textContent = `${columnLabels[i]}: `;
                
                const value = document.createElement('span');
                value.classList.add('result-value');
                value.textContent = row[colIndex] || "Tidak ada data";
                
                label.appendChild(value);
                card.appendChild(label);
            });
            
            resultsDiv.appendChild(card);
        });
    } else {
        resultsDiv.innerHTML = '<p>No results found.</p>';
    }
}
