document.addEventListener('DOMContentLoaded', function () {
    const entryTextarea = document.getElementById('entry');
    const saveButton = document.getElementById('save-entry');
    const entriesDiv = document.querySelector('.entries');

    const entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];

    function renderEntries() {
        entriesDiv.innerHTML = '';
        entries.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'entry-box';
            entryDiv.textContent = entry;
            entriesDiv.appendChild(entryDiv);
        });
    }

    renderEntries();

    saveButton.addEventListener('click', function () {
        const newEntry = entryTextarea.value;
        if (newEntry) {
            entries.push(newEntry);
            localStorage.setItem('diaryEntries', JSON.stringify(entries));
            entryTextarea.value = '';
            renderEntries();
        }
    });
});
