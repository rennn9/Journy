  document.addEventListener('DOMContentLoaded', function () {
    const entryTextarea = document.getElementById('entry');
    const saveButton = document.getElementById('save-entry');
    const entriesDiv = document.querySelector('.entries');
    const addEntryButton = document.getElementById('add-entry-button');
    const entryPopup = document.getElementById('new-entry-popup');
    const closePopup = document.getElementById('close-popup');
    const entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];

    function renderEntries() {
        console.log("Rendering entries...");
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

            const moodImage = document.createElement('img');
            moodImage.className = 'entry-mood-image';
            moodImage.src = `img/mood${entry.mood}.webp`; 
    
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
            deleteButton.className = 'delete-button';
            // deleteButton.textContent = 'Hapus';
            deleteButton.innerHTML = '<span class="material-symbols-outlined">delete</span>';
            deleteButton.addEventListener('click', function () {
                deleteEntry(index);
            });
    
            const maxWords = 15;
            const words = entry.text.split(' ');
            const truncatedText = words.slice(0, maxWords).join(' ');

            const textDiv = document.createElement('div');
            textDiv.className = 'entry-text';

            const isTruncated = words.length > maxWords;
            const displayText = isTruncated ? truncatedText + '...' : entry.text;

            textDiv.innerHTML = displayText.replace(/\|\|\|/g, "<br>");

            timestampDiv.appendChild(dateDiv);
            timestampDiv.appendChild(timeDiv);
    
            entryDiv.appendChild(timestampDiv);
            entryDiv.appendChild(moodImage);
            entryDiv.appendChild(textDiv);
            entryDiv.appendChild(deleteButton);
    
            entriesDiv.appendChild(entryDiv);
        });
    }  

    
    function deleteEntry(index) {
        console.log("Deleting entry at index: " + index);
        if (index >= 0 && index < entries.length) {
            entries.splice(index, 1);
            localStorage.setItem('diaryEntries', JSON.stringify(entries));
            renderEntries();
            renderCalendar();
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
        entryTextarea.value = '';
        entryPopup.style.display = 'none';

        if (selectedMood) {
            moodImages.forEach((img) => {
                img.classList.add('grayscale');
                img.classList.remove('colorful');
                selectedMood = null;
            });
        }
    });
    
    const moodImages = document.querySelectorAll('.mood-image');
    let selectedMood = null;

    moodImages.forEach((image) => {
    image.addEventListener('click', function () {

        moodImages.forEach((img) => {
        img.classList.add('grayscale');
        img.classList.remove('colorful');
        });

        this.classList.remove('grayscale');
        this.classList.add('colorful');

        selectedMood = this.getAttribute('data-mood');
        console.log('Mood yang dipilih:', selectedMood);
    });
    });

    saveButton.addEventListener('click', function () {
        const newEntry = entryTextarea.value.replace(/\n/g, '|||');
        if (newEntry) {
            const timestamp = new Date().toLocaleString();
            const mood = selectedMood;
            selectedMood = null;
            moodImages.forEach((img) => {
                img.classList.add('grayscale');
                img.classList.remove('colorful');
            });
    
            entries.unshift({ text: newEntry, timestamp: timestamp, mood: mood });
            localStorage.setItem('diaryEntries', JSON.stringify(entries));
            entryTextarea.value = '';
            console.log('Entri disimpan:', newEntry);
            renderEntries();
    
            const currentDate = new Date();
            const dayOfMonth = currentDate.getDate();
            const dateElements = document.querySelectorAll('.calendar .days li');
    
            dateElements.forEach(element => {
                if (element.innerText === dayOfMonth.toString()) {
                    element.classList.add('highlighted');
                }
            });
        }
        entryPopup.style.display = 'none';
    });
    
    renderEntries();

    // calendar script
    const daysTag = document.querySelector(".days");
    const currentDate = document.querySelector(".current-date");
    const prevNextIcon = document.querySelectorAll(".icons span");
    const diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];

    let date = new Date();
    let currYear = date.getFullYear();
    let currMonth = date.getMonth();
    
    const todayButton = document.getElementById("today-button");
    
    todayButton.addEventListener("click", () => {
      date = new Date();
      currYear = date.getFullYear();
      currMonth = date.getMonth();
      monthDropdown.value = currMonth;
      yearDropdown.value = currYear;
      renderCalendar();
    });
    
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const renderCalendar = () => {
        console.log('Fungsi renderCalendar dipanggil.');
        let firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
        let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
        let lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
        let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
        let liTag = "";
    
        for (let i = firstDayofMonth; i > 0; i--) {
            liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
        }
    
        for (let i = 1; i <= lastDateofMonth; i++) {
            let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";

            const matchingEntries = diaryEntries.filter(entry => {
                const entryDate = new Date(entry.timestamp);
                return entryDate.getDate() === i && entryDate.getMonth() === currMonth && entryDate.getFullYear() === currYear;
            });
        
            if (matchingEntries.length > 0) {
                liTag += `<li class="${isToday} highlighted">${i}</li>`;
            } else {
                liTag += `<li class="${isToday}">${i}</li>`;
            }
        }
    
        for (let i = lastDayofMonth; i < 6; i++) {
            liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
        }
    
        daysTag.innerHTML = liTag;
    }

    renderCalendar();
    
    prevNextIcon.forEach(icon => {
        icon.addEventListener("click", () => {
            currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
    
            if (currMonth < 0 || currMonth > 11) {
                date = new Date(currYear, currMonth, new Date().getDate());
                currYear = date.getFullYear();
                currMonth = date.getMonth();
            } else {
                date = new Date();
            }
    
            monthDropdown.value = currMonth;
            yearDropdown.value = currYear;
    
            renderCalendar();
        });
    });
    
    const monthDropdown = document.getElementById("month-dropdown");
    const yearDropdown = document.getElementById("year-dropdown");
    const currentDateText = document.getElementById("current-date");
    const monthYearDropdowns = document.getElementById("month-year-dropdowns");
    
    const fillMonthYearDropdowns = () => {
      for (let i = 0; i < months.length; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.text = months[i];
        monthDropdown.appendChild(option);
      }
    
      const currentYear = new Date().getFullYear();
      for (let i = currentYear - 100; i <= currentYear + 100; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.text = i;
        yearDropdown.appendChild(option);
      }
    
      monthDropdown.value = currMonth;
      yearDropdown.value = currYear;
    };
    
    fillMonthYearDropdowns();
    
    monthYearDropdowns.addEventListener("change", () => {
      currMonth = parseInt(monthDropdown.value);
      currYear = parseInt(yearDropdown.value);
      renderCalendar();
    });
    
    currentDateText.addEventListener("click", () => {
      monthYearDropdowns.classList.toggle("show-dropdowns");
    });
    
    document.addEventListener("click", (event) => {
      if (!monthYearDropdowns.contains(event.target)) {
        monthYearDropdowns.classList.remove("show-dropdowns");
      }
    })
});