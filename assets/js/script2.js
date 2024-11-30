const spreadsheetId = "1O29p24mJmX-fvEtLw3Ia1WSmh-_nVS_AdOk8Ap6hoq0"; // Ganti dengan ID spreadsheet Anda
const apiKey = "AIzaSyDuA1NtEm69NWtUUa55NY44z3AZnqkAijo"; // Ganti dengan API Key Anda
const range = "Stock Inventory Control!H7:Z7"; // Rentang untuk mengambil lokasi (H7:Z7)

async function ambilDataLokasi() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.values[0]; // Mengambil baris pertama (lokasi) dari rentang H7:Z7
}

async function isiDropdown() {
    const lokasiData = await ambilDataLokasi(); // Ambil lokasi dari spreadsheet
    const lokasiSelect = document.getElementById('lokasi');
    
    // Kosongkan dropdown sebelum diisi ulang
    lokasiSelect.innerHTML = '';

    // Tambahkan opsi pertama (misalnya "Pilih Lokasi")
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Pilih Lokasi Proyek';
    lokasiSelect.appendChild(defaultOption);

    // Isi dropdown dengan lokasi dari spreadsheet
    lokasiData.forEach(lokasi => {
        const option = document.createElement('option');
        option.value = lokasi;
        option.textContent = lokasi;
        lokasiSelect.appendChild(option);
    });
}

async function ambilData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Stock Inventory Control!A7:Y119?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.values; // Data dalam bentuk array
}

async function cariBarang() {
    const lokasi = document.getElementById('lokasi').value;
    const hasilDiv = document.getElementById('hasil');
    hasilDiv.innerHTML = '';

    if (!lokasi) {
        hasilDiv.innerHTML = '<p>Silakan pilih lokasi terlebih dahulu.</p>';
        return;
    }

    const dataBarang = await ambilData();
    const header = dataBarang[0]; // Baris pertama di range sebagai header

    // Mencari lokasi dalam header
    const lokasiIndex = header.indexOf(lokasi);
    if (lokasiIndex === -1) {
        hasilDiv.innerHTML = `<p>Lokasi "${lokasi}" tidak ditemukan di spreadsheet.</p>`;
        return;
    }

    // Menambahkan nama proyek di atas tabel
    const lokasiTitle = document.createElement('h3');
    lokasiTitle.textContent = `Lokasi: ${lokasi}`; // Menampilkan lokasi yang dipilih
    hasilDiv.appendChild(lokasiTitle);

    // Menyaring data berdasarkan jumlah yang lebih dari 0 di lokasi yang dipilih
    const hasil = dataBarang.slice(1).filter(row => parseInt(row[lokasiIndex]) > 0);

    if (hasil.length === 0) {
        hasilDiv.innerHTML = '<p>Tidak ada barang di lokasi ini.</p>';
    } else {
        // Membuat tabel responsif
        const tableContainer = document.createElement('div');
tableContainer.classList.add('container', 'table-container', 'my-3');

// Membuat tabel
const table = document.createElement('table');
table.classList.add('table', 'table-hover', 'table-borderless', 'align-middle', 'text-black', 'custom-table');

// Membuat header tabel
const thead = document.createElement('thead');
const headerRow = document.createElement('tr');

const headers = ['#', 'Nama Alat', 'Jumlah', 'Satuan'];
headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
});
thead.appendChild(headerRow);
table.appendChild(thead);

// Membuat isi tabel
const tbody = document.createElement('tbody');
hasil.forEach((row, index) => {
    const tr = document.createElement('tr');

    const tdNoUrut = document.createElement('td');
    tdNoUrut.textContent = index + 1;

    const tdNamaBarang = document.createElement('td');
    tdNamaBarang.textContent = row[2];

    const tdJumlah = document.createElement('td');
    tdJumlah.textContent = row[lokasiIndex];

    const tdSatuan = document.createElement('td');
    tdSatuan.textContent = row[3];

    // Tambahkan kelas untuk stok rendah
    if (parseInt(row[lokasiIndex]) < 0) {
        tr.classList.add('low-stock');
    }

    tr.appendChild(tdNoUrut);
    tr.appendChild(tdNamaBarang);
    tr.appendChild(tdJumlah);
    tr.appendChild(tdSatuan);
    tbody.appendChild(tr);
});

table.appendChild(tbody);
tableContainer.appendChild(table);
hasilDiv.appendChild(tableContainer);
    }
}


// Panggil fungsi isiDropdown saat halaman dimuat untuk mengisi dropdown dengan lokasi
document.addEventListener('DOMContentLoaded', isiDropdown);
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar-desktop');
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});