document.addEventListener('DOMContentLoaded', function () {
    const entryTextarea = document.getElementById('entry');
    const saveButton = document.getElementById('save-entry');
    const entriesDiv = document.querySelector('.entries');
    const addEntryButton = document.getElementById('add-entry-button');
    const entryPopup = document.getElementById('entry-popup');
    const closePopup = document.getElementById('close-popup');

    const entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];

    function renderEntries() {
        entriesDiv.innerHTML = '';
        entries.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'entry-box';
            const timestampDiv = document.createElement('div');
            timestampDiv.className = 'timestamp';
            entryDiv.textContent = entry.text;
            timestampDiv.textContent = entry.timestamp;
            entryDiv.appendChild(timestampDiv);
            entriesDiv.appendChild(entryDiv);
        });
    }

    addEntryButton.addEventListener('click', function () {
        entryPopup.style.display = 'block';
    });

    closePopup.addEventListener('click', function () {
        entryPopup.style.display = 'none';
    });

    renderEntries();

    saveButton.addEventListener('click', function () {
        const newEntry = entryTextarea.value;
        if (newEntry) {
            const timestamp = new Date().toLocaleString();
            entries.push({ text: newEntry, timestamp: timestamp });
            localStorage.setItem('diaryEntries', JSON.stringify(entries));
            entryTextarea.value = '';
            renderEntries();
        }
    });
});
