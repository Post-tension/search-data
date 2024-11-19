const apiKey = 'AIzaSyAaoonqQDk_uxT9gIaH0ctGzcVvwcdtSa0';
const spreadsheetId = '1O29p24mJmX-fvEtLw3Ia1WSmh-_nVS_AdOk8Ap6hoq0';
const range = 'Sheet1!A1:R282';

document.getElementById('search-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default form submission
        searchData(); // Trigger the search
    }
});

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

    // Clear previous error messages
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = '';

    // Check if search term is empty
    if (!searchTerm) {
        errorMessageElement.textContent = "Error: Kata kunci pencarian harus diisi.";
        document.getElementById('results-container').style.display = 'none'; // Hide results container
        return;
    }

    // Show loading indicator
    const resultsDiv = document.getElementById('results');
    const loadingMessage = document.getElementById('loading-overlay');
    resultsDiv.innerHTML = ''; // Clear previous results
    loadingMessage.style.display = 'flex'; // Display loading message
    document.getElementById('results-container').style.display = 'block'; // Show results container

    const data = await fetchData();
    loadingMessage.style.display = 'none'; // Hide loading message

    if (!data) return; // Error already handled in fetchData

    // Filter results based on search term
    const results = data.filter(row => row.some(cell => cell.toLowerCase().includes(searchTerm)));
    displayResults(results);
}
function getRandomColorClass() {
    const colors = [
        'card-blue', 'card-green', 'card-red', 
        'card-orange', 'card-purple', 'card-teal'
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex]; // Return a random color class
}

function displayResults(results, errorMessage = null) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (errorMessage) {
        resultsDiv.innerHTML = `<div class="alert alert-danger" role="alert">${errorMessage}</div>`;
        resultsDiv.style.display = 'block'; // Show error message
        return;
    }

    const selectedColumns = [2, 4, 6, 13, 14, 7, 5, 11, 9, 10, 15];
    const columnLabels = ["Nama Alat", "Tipe Jack", "Merk", "NKP Lama", "NKP baru", "Nomor Seri", "No Manometer", "Lokasi Alat", "Tanggal Expired", "Status", "Link Sertifikat"];

    const rowDiv = document.createElement('div');
    
    // Adjust classes based on the number of results
    if (results.length === 1) {
        rowDiv.classList.add('row'); // Just one result
    } else if (results.length === 2) {
        rowDiv.classList.add('row'); // Two results
    } else {
        rowDiv.classList.add('row', 'g-3'); // More than two results with gaps
    }

    if (results && results.length > 0) {
        results.forEach((row) => {
            const colDiv = document.createElement('div');
            
            // Set column classes based on the number of results
            if (results.length === 1) {
                colDiv.classList.add('col-12'); // Full width for a single result
            } else if (results.length === 2) {
                colDiv.classList.add('col-6'); // Half width for two results
            } else {
                colDiv.classList.add('col-md-6', 'col-lg-4'); // Responsive columns for multiple results
            }

            const card = document.createElement('div');
            card.classList.add('result-card', 'card', 'h-100', 'p-3', 'shadow-sm'); // Bootstrap card with full height and padding
            card.classList.add(getRandomColorClass()); // Add random background color
            

            selectedColumns.forEach((colIndex, index) => {
                const cellData = row[colIndex];

                // Only render if cellData has a value
                if (cellData && cellData.trim() !== "") { // Check if data exists and is not just whitespace
                    const rowContent = document.createElement('p');
                    rowContent.classList.add('card-text');
                    
                    // Check if the column is the link column (22nd column)
                    if (colIndex === 15) {
                        // Only show "Link Sertifikat" if there is data for it
                        rowContent.innerHTML = `<strong>${columnLabels[index]}:</strong> <a href="${cellData}" target="_blank">Klik disini</a>`;
                    } else if (index === 9) { // Index for "Status"
                        const status = cellData;
                        let statusClass = '';
                        let statusIcon = '';

                        // Set different styles based on status
                        if (status.toLowerCase() === 'expired') {
                            statusClass = 'text-danger';
                            statusIcon = 'fas fa-exclamation-circle'; // Red icon for expired
                        } else if (status.toLowerCase() === 'Aktif') {
                            statusClass = 'text-success';
                            statusIcon = 'fas fa-check-circle'; // Green icon for OK
                        } else {
                            statusClass = 'text-secondary';
                            statusIcon = 'fas fa-question-circle'; // Grey icon for unknown
                        }
                        rowContent.innerHTML = `<strong>${columnLabels[index]}:</strong> <i class="${statusIcon} ${statusClass}"></i> ${status}`;
                    } else {
                        rowContent.innerHTML = `<strong>${columnLabels[index]}:</strong> ${cellData}`;
                    }
                    card.appendChild(rowContent);
                }
            });

            colDiv.appendChild(card);
            rowDiv.appendChild(colDiv);
        });

        resultsDiv.appendChild(rowDiv);
    } else {
        resultsDiv.innerHTML = `<div class="alert alert-info" role="alert">Tidak ada hasil yang ditemukan untuk "${document.getElementById('search-input').value}".</div>`;
    }

    resultsDiv.style.display = 'block'; // Show results
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

// Event listener to hide results on initial load
document.addEventListener("DOMContentLoaded", function () {
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = 'none'; // Hide results container by default
});
