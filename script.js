const apiKey = 'AIzaSyAaoonqQDk_uxT9gIaH0ctGzcVvwcdtSa0';
const spreadsheetId = '1O29p24mJmX-fvEtLw3Ia1WSmh-_nVS_AdOk8Ap6hoq0';
const range = 'Sheet1!A1:Y135';

async function fetchData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.values;
    } catch (error) {
        console.error("Error fetching data:", error);
        displayResults(null, "Error fetching data. Please try again.");
    }
}

async function searchData() {
    const searchTerm = document.getElementById('search-input').value.trim().toLowerCase();

    // Check if search term is empty
    if (!searchTerm) {
        displayResults(null, "Error: Kata kunci pencarian harus diisi.");
        return;
    }

    // Show loading indicator
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p>Loading...</p>';

    const data = await fetchData();

    if (!data) return; // Error already handled in fetchData

    // Filter results based on search term
    const results = data.filter(row => row.some(cell => cell.toLowerCase().includes(searchTerm)));
    displayResults(results);
}

function displayResults(results, errorMessage = null) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (errorMessage) {
        resultsDiv.innerHTML = `<div class="alert alert-danger" role="alert">${errorMessage}</div>`;
        return;
    }

    const selectedColumns = [6, 7, 11, 21, 12, 8, 19, 13, 17, 18, 22];
    const columnLabels = ["Nama Alat", "Tipe Jack", "Merk", "No NKP", "Nomor Seri", "No Manometer", "Lokasi Alat", "Tanggal Kalibrasi", "Tanggal Expired", "Status", "Link Sertifikat"];

    if (results && results.length > 0) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row', 'g-3'); // Bootstrap row with gap between columns

        results.forEach(row => {
            const colDiv = document.createElement('div');
            colDiv.classList.add('col-12', 'col-md-6', 'col-lg-4'); // Full width on mobile, 2 columns on medium screens, 3 columns on large

            const card = document.createElement('div');
            card.classList.add('result-card', 'card', 'h-100', 'p-3', 'shadow-sm'); // Bootstrap card with full height and padding

            selectedColumns.forEach((colIndex, i) => {
                const rowContent = document.createElement('p');
                rowContent.innerHTML = `<strong>${columnLabels[i]}:</strong> `;

                const value = document.createElement('span');

                if (colIndex === 22) { // Link column
                    const link = row[colIndex] || "";
                    if (isValidURL(link)) {
                        const anchor = document.createElement('a');
                        anchor.href = link;
                        anchor.target = '_blank';
                        anchor.textContent = "Klik di sini";
                        anchor.setAttribute('aria-label', `Link to ${columnLabels[i]}`);
                        value.appendChild(anchor);
                    } else {
                        value.textContent = "Tidak ada link yang valid";
                    }
                } else {
                    value.textContent = row[colIndex] || "Tidak ada data";
                }

                rowContent.appendChild(value);
                card.appendChild(rowContent);
            });

            colDiv.appendChild(card);
            rowDiv.appendChild(colDiv);
        });

        resultsDiv.appendChild(rowDiv);
    } else {
        resultsDiv.innerHTML = '<div class="alert alert-warning" role="alert">Tidak ada hasil yang ditemukan.</div>';
    }
}

// Function to validate if a string is a URL
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;  
    }
}
