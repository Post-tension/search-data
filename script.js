const apiKey = 'AIzaSyAaoonqQDk_uxT9gIaH0ctGzcVvwcdtSa0';
const spreadsheetId = '1O29p24mJmX-fvEtLw3Ia1WSmh-_nVS_AdOk8Ap6hoq0';
const range = 'Sheet1!A1:Y135';

async function fetchData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.values;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function searchData() {
    const searchTerm = document.getElementById('search-input').value.trim().toLowerCase();

    // Cek apakah search term kosong
    if (!searchTerm) {
        displayResults(null, "Error: Kata kunci pencarian harus diisi.");
        return;
    }

    const data = await fetchData();

    if (!data) {
        displayResults(null, "Error fetching data. Please try again.");
        return;
    }

    const results = data.filter(row => row.some(cell => cell.toLowerCase().includes(searchTerm)));
    displayResults(results);
}

function displayResults(results, errorMessage = null) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (errorMessage) {
        resultsDiv.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
        return;
    }

    const selectedColumns = [6, 7, 11, 21, 12, 8, 19, 13, 17, 18, 22];
    const columnLabels = ["Nama Alat", "Tipe Jack", "Merk", "No NKP", "Nomor Seri", "No Manometer", "Lokasi Alat", "Tanggal Kalibrasi", "Tanggal Expired", "Status", "Link Sertifikat"];

    if (results && results.length > 0) {
        results.forEach(row => {
            const card = document.createElement('div');
            card.classList.add('result-card');
            
            selectedColumns.forEach((colIndex, i) => {
                const label = document.createElement('p');
                label.classList.add('result-label');
                label.textContent = `${columnLabels[i]}: `;

                const value = document.createElement('span');
                value.classList.add('result-value');

                // Cek apakah ini kolom 22 dan jika ada URL
                if (colIndex === 22) { 
                    const link = row[colIndex] || "";
                    if (isValidURL(link)) {
                        const anchor = document.createElement('a');
                        anchor.href = link;
                        anchor.target = '_blank';
                        anchor.textContent = "Klik di sini"; // Tautan bisa diklik
                        value.appendChild(anchor);
                    } else {
                        value.textContent = "Tidak ada link yang valid";
                    }
                } else {
                    value.textContent = row[colIndex] || "Tidak ada data";
                }

                label.appendChild(value);
                card.appendChild(label);
            });
            
            resultsDiv.appendChild(card);
        });
    } else {
        resultsDiv.innerHTML = '<p>Tidak ada hasil yang ditemukan.</p>';
    }
}

// Fungsi untuk validasi apakah teks adalah URL
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;  
    }
}
