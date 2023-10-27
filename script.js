document.addEventListener('DOMContentLoaded', function () {
    const entryTextarea = document.getElementById('entry');
    const saveButton = document.getElementById('save-entry');
    const entriesDiv = document.querySelector('.entries');
    const addEntryButton = document.getElementById('add-entry-button');
    const entryPopup = document.getElementById('new-entry-popup');
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
    
            // const textDiv = document.createElement('div');
            // textDiv.textContent = entry.text;

            const textWithLineBreaks = entry.text.replace(/\|\|\|/g, "<br>");
            const textDiv = document.createElement('div');
            textDiv.innerHTML = textWithLineBreaks;

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

    function showEntryDetails(index) {
        const entry = entries[index];
        const popupTimestamp = document.getElementById('popup-timestamp');
        const popupEntry = document.getElementById('popup-entry');
        const editButton = document.getElementById('edit-button');

        const formattedTimestamp = formatTimestamp(entry.timestamp);
        popupTimestamp.textContent = formattedTimestamp;

        popupEntry.innerHTML = entry.text.replace(/\|\|\|/g, '<br>');

        editButton.textContent = isEditing ? 'Simpan' : 'Edit';
        editIndex = index;

        if (isEditing) {
            popupEntry.classList.add('editing');
        } else {
            popupEntry.classList.remove('editing');
        }

        const entryDetailsPopup = document.getElementById('entry-details-popup');
        entryDetailsPopup.style.display = 'block';
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return date.toLocaleDateString('id-ID', options);
    }

    let isEditing = false;
    let editIndex = -1;

    function toggleEditButton() {
        isEditing = !isEditing;
        const editButton = document.getElementById('edit-button');
        editButton.textContent = isEditing ? 'Simpan' : 'Edit';

        const popupEntry = document.getElementById('popup-entry');
        popupEntry.contentEditable = isEditing;

        if (isEditing) {
            popupEntry.classList.add('editing');
        } else {
            popupEntry.classList.remove('editing');
        }
    }

    const editButton = document.getElementById('edit-button');
    editButton.addEventListener('click', function () {
        if (isEditing) {
            const editedText = document.getElementById('popup-entry').innerHTML;
            const newText = editedText.replace(/<br>/g, '|||');
            entries[editIndex].text = newText;
            localStorage.setItem('diaryEntries', JSON.stringify(entries));
        }
        renderEntries();
        toggleEditButton();
    });

    function closeEntryDetails() {
        const entryDetailsPopup = document.getElementById('entry-details-popup');
        entryDetailsPopup.style.display = 'none';

        const popupEntry = document.getElementById('popup-entry');
        popupEntry.contentEditable = 'false';

        popupEntry.classList.remove('editing');
        isEditing = false;
        const editButton = document.getElementById('edit-button');
        editButton.textContent = 'Edit';
    }

    const closeDetailsPopup = document.getElementById('close-details-popup');
    closeDetailsPopup.addEventListener('click', closeEntryDetails)

    entriesDiv.addEventListener('click', function (event) {
        let target = event.target;
        while (target !== this) {
            if (target.classList.contains('entry-box')) {
                const index = Array.from(target.parentNode.children).indexOf(target);
                showEntryDetails(index);
                return;
            }
            target = target.parentNode;
        }
    });

    addEntryButton.addEventListener('click', function () {
        entryPopup.style.display = 'block';
    });

    closePopup.addEventListener('click', function () {
        entryPopup.style.display = 'none';
    });

    saveButton.addEventListener('click', function () {
        const newEntry = entryTextarea.value.replace(/\n/g, '|||');
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
