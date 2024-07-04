


const colors=['#AED6F1','#FADBD8','#E8DAEF','#E5E8E8','#FFAACC','#FFF','#D5F5E3'];

function popup() {
    const popupContainer = document.createElement("div");

    popupContainer.innerHTML = 
    `<div id="popupContainer">
        <h1>New Note</h1>
        <textarea id="note-text" placeholder="Enter your note..."></textarea>
        <div id="btn-container">
            <button id="submitBtn" onclick="createNote()">Create Note</button>
            <button id="closeBtn" onclick="closePopup()">Close</button>
        </div>
    </div>
    `;
    document.body.appendChild(popupContainer);
}

function closePopup() {
    const popupContainer = document.getElementById("popupContainer");
    if (popupContainer) {
        popupContainer.remove();
    }
}

function createNote() {
    const popupContainer = document.getElementById('popupContainer');
    const noteText = document.getElementById('note-text').value;
    if (noteText.trim() !== '') {
        const randomIndex=Math.floor(Math.random()*colors.length);
        const randomColor=colors[randomIndex];

        const note = {
            id: new Date().getTime(),
            text: noteText,
            color:randomColor ,
            lastEdited: new Date()
        };

        const existingNotes = JSON.parse(localStorage.getItem('notes')) || [];
        existingNotes.push(note);

        localStorage.setItem('notes', JSON.stringify(existingNotes));

        document.getElementById('note-text').value = '';

        popupContainer.remove();
        displayNotes();
    }
}

function displayNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';

    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    notes.forEach(note => {
        const listItem = document.createElement('li');
        listItem.style.backgroundColor=note.color;
        listItem.innerHTML = `
        <span>${note.text}</span>
        <div id="noteBtns-container">
            <button id="editBtn" onclick="editNote(${note.id})"><i class="fas fa-pen"></i></button>
            <button id="deleteBtn" onclick="deleteNote(${note.id})"><i class="fas fa-trash"></i></button>
            <button id="infoBtn" onclick="displayTimestamp(${note.id})"><i class="fas fa-info-circle"></i></button>
        </div>
        `;
        notesList.appendChild(listItem);
    });
}

function editNote(noteId) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteToEdit = notes.find(note => note.id == noteId);
    const noteText = noteToEdit ? noteToEdit.text : '';
    const color=noteToEdit ? noteToEdit.color : '';
    const editingPopup = document.createElement("div");

    editingPopup.innerHTML = `
    <div id="editing-container" data-note-id="${noteId}" style="background-color:${color};">
        <h1>Edit Note</h1>
        <textarea id="note-text">${noteText}</textarea>
        <div id="btn-container">
            <button id="submitBtn" onclick="updateNote()">Done</button>
            <button id="closeBtn" onclick="closeEditPopup()">Cancel</button>
        </div>
    </div>
    `;

    document.body.appendChild(editingPopup);
}

function updateNote() {
    const noteText = document.getElementById('note-text').value.trim();
    const editingPopup = document.getElementById('editing-container');

    if (noteText !== '') {
        const noteId = editingPopup.getAttribute('data-note-id');
        let notes = JSON.parse(localStorage.getItem('notes')) || [];

        // Find the note to update
        const updatedNotes = notes.map(note => {
            if (note.id == noteId) {
                return { ...note, text: noteText, lastEdited: new Date() };
            }
            return note;
        });

        localStorage.setItem('notes', JSON.stringify(updatedNotes));
        editingPopup.remove();
        displayNotes();
    }
}

function closeEditPopup() {
    const editingPopup = document.getElementById("editing-container");
    if (editingPopup) {
        editingPopup.remove();
    }
}

function displayTimestamp(noteId) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes.find(note => note.id == noteId);

    if (note) {
        const timestamp = new Date(note.lastEdited).toLocaleString();
        alert(`Last edited: ${timestamp}`);
    }
}

function deleteNote(noteId) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.id !== noteId);

    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
}

displayNotes();

