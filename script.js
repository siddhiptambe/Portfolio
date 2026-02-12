let contacts = loadFromStorage();
let editIndex = null;
let draggedIndex = null;

const form = document.getElementById("contactForm");
const list = document.getElementById("contactList");
const search = document.getElementById("search");

function loadFromStorage() {
    return JSON.parse(localStorage.getItem("contacts")) || [];
}

function saveToStorage() {
    localStorage.setItem("contacts", JSON.stringify(contacts));
}

function displayContacts(data = contacts) {
    list.innerHTML = "";

    data.forEach((contact, index) => {
        const li = document.createElement("li");
        li.draggable = true;
        li.dataset.index = index;

        li.innerHTML = `
            <strong>${contact.name}</strong><br>
            ${contact.email}<br>
            ${contact.phone}
            <div class="actions">
                <button onclick="editContact(${index})">Edit</button>
                <button onclick="deleteContact(${index})">Delete</button>
            </div>
        `;

        list.appendChild(li);
    });
}

form.addEventListener("submit", e => {
    e.preventDefault();
    addOrUpdateContact();
});

function isValidName(name) {
    return /^[A-Za-z ]{2,}$/.test(name);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[0-9]{10}$/.test(phone);
}

function setError(id) {
    const input = document.getElementById(id);
    input.classList.add("error");
    input.classList.remove("success");
}

function setSuccess(id) {
    const input = document.getElementById(id);
    input.classList.add("success");
    input.classList.remove("error");
}

function clearState(id) {
    const input = document.getElementById(id);
    input.classList.remove("error", "success");
}

function addOrUpdateContact() {
    console.log("Function triggered");
    console.log("editIndex value:", editIndex);
    const name = getValue("name");
    const email = getValue("email");
    const phone = getValue("phone");

    let isValid = true;
    let errorMessage = "";

    if (!name) {
        setError("name");
        errorMessage = "Please fill all fields.";
        isValid = false;
    } else if (!isValidName(name)) {
        setError("name");
        errorMessage = "Please enter a valid name.";
        isValid = false;
    } else {
        setSuccess("name");
    }

    if (!email) {
        setError("email");
        errorMessage = "Please fill all fields.";
        isValid = false;
    } else if (!isValidEmail(email)) {
        setError("email");
        errorMessage = "Please enter a valid email address.";
        isValid = false;
    } else {
        setSuccess("email");
    }

    if (!phone) {
        setError("phone");
        errorMessage = "Please fill all fields.";
        isValid = false;
    } else if (!isValidPhone(phone)) {
        setError("phone");
        errorMessage = "Phone number must be exactly 10 digits.";
        isValid = false;
    } else {
        setSuccess("phone");
    }
        
    console.log("isValid:", isValid);

    if (!isValid) {
        console.log("Validation failed");
        alert(errorMessage);
        return;
    }

    const contact = { name, email, phone };

    if (editIndex === null) {
        if (editIndex === null) {
            contacts.push(contact);
            console.log("Calling email function...");
            sendEmail(contact);   
    }
    } else {
        contacts[editIndex] = contact;
        editIndex = null;
        form.querySelector("button").innerText = "Add Contact";
    }

    saveToStorage();
    form.reset();

    clearState("name");
    clearState("email");
    clearState("phone");

    displayContacts();
}

function editContact(index) {
    const c = contacts[index];
    setValue("name", c.name);
    setValue("email", c.email);
    setValue("phone", c.phone);
    editIndex = index;
    form.querySelector("button").innerText = "Update Contact";
}

function deleteContact(index) {
    contacts.splice(index, 1);
    saveToStorage();
    displayContacts();
}

function clearSearch() {
    const searchBox = document.getElementById("search");
    searchBox.value = "";
    displayContacts();
    searchBox.focus();
}

function sendEmail(contact) {
    emailjs.send(
        "service_yvpbidg",   
        "template_8u6dft9",  
        {
            to_email: contact.email,
            name: contact.name,
            email: contact.email,
            phone: contact.phone
        }
    ).then(() => {
        console.log("Email sent successfully");
    }).catch(error => {
        console.error("Email failed:", error);
    });
}


search.addEventListener("input", () => {
    const value = search.value.toLowerCase();
    const filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(value) ||
        c.email.toLowerCase().includes(value)
    );
    displayContacts(filtered);
});

list.addEventListener("dragstart", e => {
    if (e.target.tagName === "LI") {
        draggedIndex = e.target.dataset.index;
        e.target.classList.add("dragging");
    }
});

list.addEventListener("dragend", e => {
    if (e.target.tagName === "LI") {
        e.target.classList.remove("dragging");
    }
});

list.addEventListener("dragover", e => e.preventDefault());

list.addEventListener("drop", e => {
    const target = e.target.closest("li");
    if (!target) return;

    const targetIndex = target.dataset.index;

    if (draggedIndex === targetIndex) return;

    const movedItem = contacts.splice(draggedIndex, 1)[0];
    contacts.splice(targetIndex, 0, movedItem);

    saveToStorage();
    displayContacts();
});

function getValue(id) {
    return document.getElementById(id).value.trim();
}

function setValue(id, value) {
    document.getElementById(id).value = value;
}

displayContacts();