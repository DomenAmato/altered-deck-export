window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
        document.getElementById('main-nav').style.display = 'block';
        document.getElementById('admin-nav-link').style.display = 'inline-block';
    }
}

// Gestione Pagine
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// Funzioni Admin
async function updateServerDB() {
    const status = document.getElementById('adminStatus');
    status.innerText = "Aggiornamento in corso... attendere (potrebbe volerci un minuto)";
    try {
        const response = await fetch('/api/admin/update-db');
        const data = await response.json();
        status.innerText = data.message || data.error;
    } catch (e) { status.innerText = "Errore di connessione."; }
}

function downloadSet(code) {
    // Questo caricherà ad esempio: /api/admin/download-json/CORE
    window.location.href = `/api/admin/download-json/${code}`;
}

// Funzione per estrarre il deck
async function fetchDeck() {
    const input = document.getElementById('deckUrl').value;
    const copyBtn = document.getElementById('copyBtn');
    
    // Opzionale: disabilitiamo il tasto all'inizio di ogni nuova ricerca 
    // per evitare di copiare il vecchio deck mentre il nuovo carica
    copyBtn.disabled = true;

    try {
        const response = await fetch(`/api/deck?url=${encodeURIComponent(input)}`);
        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        // ... logica per popolare la tabella e currentDeckText ...
        
        // Una volta che la tabella è piena, abilitiamo il tasto
        if (data.cards && data.cards.length > 0) {
            document.getElementById('resultTable').style.display = 'table';
            copyBtn.disabled = false; // ABILITA IL TASTO
            copyBtn.style.display = 'block'; // Assicuriamoci che sia visibile
        }

    } catch (e) {
        console.error("Errore di connessione", e);
        alert("Impossibile connettersi al server.");
    }
}

// Funzione per copiare nel clipboard
function copyToClipboard() {
    const cardList = document.getElementById('cardList');
    const rows = cardList.querySelectorAll('tr');
    let text = '';

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
            text += `${cells[0].textContent} ${cells[1].textContent}\n`;
        }
    });

    navigator.clipboard.writeText(text).then(() => {
        alert('Testo copiato negli appunti!');
    }).catch(err => {
        console.error('Errore nella copia:', err);
    });
}