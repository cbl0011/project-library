let myLibrary = [];
let addForm = document.getElementById("add-form");
let addFormBtn = document.getElementById("add-form-btn");
let bookContainer = document.getElementById("book-container");

function Book(title, author, numPages, hasBeenRead) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.hasBeenRead = hasBeenRead;
    this.info = () => {
        return this.title + " by " + this.author + ", " + this.numPages + " pages," + (this.hasBeenRead ? " read" : " not read yet");
    }
}

// Library Stuff

function addBookToLibrary(book) {
    myLibrary.push(book);
    saveToLocalStorage(book);
}

function toggleRead(book) {
    book.hasBeenRead = !book.hasBeenRead;
    render();
}

function removeBook(book) {
    myLibrary = myLibrary.filter((b) => { return b != book });

    localStorage.clear();
    for (let b of myLibrary) {
        saveToLocalStorage(book);
    }
    render();
}

function render() {
    bookContainer.innerHTML = "";
    for (let bookIndex in myLibrary) {
        let toggleReadBtn = document.createElement("button");
        toggleReadBtn.onclick = () => toggleRead(myLibrary[bookIndex]);
        toggleReadBtn.innerText = "Toggle Read";

        let removeBookBtn = document.createElement("button");
        removeBookBtn.onclick = () => removeBook(myLibrary[bookIndex]);
        removeBookBtn.innerText = "Remove Book";

        let bookElement = document.createElement("p");
        bookElement.id = "book-" + bookIndex;
        bookElement.classList.add("book");

        let bookTitle = document.createElement("p");
        bookTitle.classList.add("title");
        bookTitle.appendChild(document.createTextNode(myLibrary[bookIndex].title));
        let bookAuthor = document.createElement("p");
        bookAuthor.classList.add("author");
        bookAuthor.appendChild(document.createTextNode("Written by: " + myLibrary[bookIndex].author));
        let bookPages = document.createElement("p");
        bookPages.classList.add("numPages");
        bookPages.appendChild(document.createTextNode(myLibrary[bookIndex].numPages + " pages"));
        let bookRead = document.createElement("p");
        bookRead.classList.add("read");
        bookRead.appendChild(document.createTextNode(myLibrary[bookIndex].hasBeenRead ? "Read" : "Not read"));

        bookElement.appendChild(bookTitle);
        bookElement.appendChild(bookAuthor);
        bookElement.appendChild(bookPages);
        bookElement.appendChild(bookRead);
        bookElement.appendChild(toggleReadBtn);
        bookElement.appendChild(removeBookBtn);
        bookContainer.append(bookElement);
    }
}

function saveToLocalStorage(book) {
    localStorage.persistentLibrary = JSON.stringify(myLibrary);
}

function loadPeristentLibrary() {
    if (localStorage.persistentLibrary === undefined) return;
    for (let obj of JSON.parse(localStorage.persistentLibrary)) {

        myLibrary.push(new Book(
            obj.title,
            obj.author,
            obj.numPages,
            obj.hasBeenRead
        ));
    }
}

// Form Stuff

function toggleForm() {
    addForm.reset();
    addFormBtn.classList.toggle("active");

    if (addForm.style.display === "block") {
        addForm.style.display = "none";
    } else {
        addForm.style.display = "block";
    }
}

addForm.onsubmit = (e) => {
    e.preventDefault();

    let addFormData = new FormData(addForm);
    console.log(addFormData.get("read"));
    addBookToLibrary(new Book(
        addFormData.get("title"),
        addFormData.get("author"),
        addFormData.get("numpages"),
        (addFormData.get("read") === null) ? false : true
    ));
    toggleForm();
    render();
}

loadPeristentLibrary();

if (myLibrary.length === 0) {
    // Example books
    let thgttg = new Book("The Hitchhiker's Guide to the Galaxy", "Douglas Adams", 208, false);
    let farSide = new Book("The Far Side Gallery", "Gary Larson", 192, true);
    addBookToLibrary(thgttg);
    addBookToLibrary(farSide);
}

render();