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
        entries.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'entry-box';
    
            const timestampDiv = document.createElement('div');
            timestampDiv.className = 'timestamp';
    
            const dateDiv = document.createElement('div');
            dateDiv.className = 'date';
    
            const timeDiv = document.createElement('div');
            timeDiv.className = 'time';
    
            const date = new Date(entry.timestamp);
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            };
            const formattedDate = date.toLocaleDateString('id-ID', options);
    
            const timeOptions = {
                hour: '2-digit',
                minute: '2-digit',
            };
            const formattedTime = date.toLocaleTimeString('id-ID', timeOptions);
    
            dateDiv.textContent = formattedDate;
            timeDiv.textContent = formattedTime;
    
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Hapus';
            deleteButton.addEventListener('click', function () {
                deleteEntry(index);
            });
    
            const textDiv = document.createElement('div');
            textDiv.textContent = entry.text;
    
            timestampDiv.appendChild(dateDiv);
            timestampDiv.appendChild(timeDiv);
    
            entryDiv.appendChild(timestampDiv);
            entryDiv.appendChild(textDiv);
            entryDiv.appendChild(deleteButton);
    
            entriesDiv.appendChild(entryDiv);
        });
    }
    
    function deleteEntry(index) {
        if (index >= 0 && index < entries.length) {
            entries.splice(index, 1);
            localStorage.setItem('diaryEntries', JSON.stringify(entries));
            renderEntries();
        }
    }

    addEntryButton.addEventListener('click', function () {
        entryPopup.style.display = 'block';
    });

    closePopup.addEventListener('click', function () {
        entryPopup.style.display = 'none';
    });

    saveButton.addEventListener('click', function () {
        const newEntry = entryTextarea.value;
        if (newEntry) {
            const timestamp = new Date().toLocaleString();
            entries.unshift({ text: newEntry, timestamp: timestamp });
            localStorage.setItem('diaryEntries', JSON.stringify(entries));
            entryTextarea.value = '';
            renderEntries();
        }
    });

    renderEntries();
});
