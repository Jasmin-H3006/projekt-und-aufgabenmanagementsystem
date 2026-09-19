import {React, useEffect, useState, ReactDOM, FormButtons, TextField, requireLogin} from "../../imports/create-edit-forms-imports.js";
import {pageBuilder} from "../../js/page-builder.js";

function Page() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");
    useEffect(() => {
        requireLogin(setUsername, false, false, false, false, false, true)
            .then(setUser);
    }, []);

    return pageBuilder(user, [React.createElement(CreateEditContactPerson, {key: 'create-edit-contact-person'})])
}

function CreateEditContactPerson() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [contactPersons, setContactPersons] = useState([]);
    const [customerName, setCustomerName] = useState("");

    const [createNewContactPerson, setCreateNewContactPerson] = useState(false); // First, it's assumed that the user only wants to edit
    const [noEqualContactPersonInSystem, setNoEqualContactPersonInSystem] = useState(true);
    const [message, setMessage] = useState('');

    const urlParams = new URLSearchParams(window.location.search);
    const contactPersonIdInUrl = urlParams.get("id");
    const customerIdInUrl = urlParams.get("customerId");

    useEffect(() => {
        fetch("http://localhost:8080/api/customer/contact-persons/get-all")
            .then(res => res.json())
            .then(data => setContactPersons(data));

        if (!customerIdInUrl) return;

        fetch(`http://localhost:8080/api/customers/${customerIdInUrl}`)
            .then(r => r.json())
            .then(customer => setCustomerName(customer.name));

        if (!contactPersonIdInUrl) {
            setCreateNewContactPerson(true);
            return;
        }

        fetch(`http://localhost:8080/api/customer/contact-persons/${contactPersonIdInUrl}`)
            .then(r => r.json())
            .then(contactPerson => {
                setName(contactPerson.name)
                setEmail(contactPerson.email)
                setTelefone(contactPerson.telefone)
            });
    }, [customerIdInUrl, contactPersonIdInUrl]);

    const handleBack = (customerIdInUrl) => {
        window.location.href = '../customer-contact-persons/customer-contact-persons.html?customerId=' + customerIdInUrl;
    };

    const handleCancel = async (e) => {
        e.preventDefault();
        handleBack(customerIdInUrl)
    }

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            name,
            email,
            telefone,
            customerId: customerIdInUrl
        }

        // Reset Messages after a new click
        setMessage('');
        setNoEqualContactPersonInSystem(true);

        const editContactPerson = contactPersonIdInUrl;

        if(!editContactPerson) {
            // Creating a new contact person (not edit an already existing one)
            const responseCheck = await fetch(
                'http://localhost:8080/api/customer/contact-persons/contact-person-exists?email=' + encodeURIComponent(email)
            );
            if (!responseCheck.ok) return;
            const exists = await responseCheck.json();

            if (exists) {
                setNoEqualContactPersonInSystem(false);
                return;
            }
        }

        if(name === "") {
            setMessage('Der Name vom Ansprechpartner darf nicht leer sein.');
            return;
        }

        if(email === "") {
            setMessage('Die E-Mail vom Ansprechpartner darf nicht leer sein.');
            return;
        }

        const responseUrl = editContactPerson ? `http://localhost:8080/api/customer/contact-persons/${contactPersonIdInUrl}` : "http://localhost:8080/api/customer/contact-persons/create";
        const method = editContactPerson ? "PUT" : "POST";

        // Save process
        const response = await fetch(responseUrl, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            setMessage('Der Ansprechpartner wurde erfolgreich angelegt/bearbeitet!');
            handleBack(customerIdInUrl)
        } else if (response.status === 409) {
            setMessage('Es gibt bereits einen Ansprechpartner mit dieser E-Mail.');
        } else {
            setMessage('Aktion fehlgeschlagen.');
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        if (!contactPersonIdInUrl) return;

        const confirmed = window.confirm(
            `Soll der Ansprechpartner mit der ID "${contactPersonIdInUrl}" wirklich gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden.`
        );

        if (!confirmed) return; // Stop action

        // Delete process
        const response = await fetch(
            `http://localhost:8080/api/customer/contact-persons/${contactPersonIdInUrl}`,
            {method: "DELETE"}
        );

        if (response.ok) {
            setMessage('Der Ansprechpartner wurde erfolgreich gelöscht!');
            handleBack(customerIdInUrl)
        } else {
            setMessage('Löschen fehlgeschlagen.');
        }
    };

    return [
        React.createElement("form", {key: 'create-element-form', className: "create-element-form"}, [
            React.createElement('h2', {key: 'headline'}, contactPersonIdInUrl ? "Bestehenden Ansprechpartner bearbeiten" : "Neuen Ansprechpartner von '" + customerName + "' anlegen"),
            React.createElement(TextField, {
                key: 'name', required: true, variant: "outlined", className: "full-width", label: "Name", value: name,
                onChange: (e) => setName(e.target.value)
            }, null),
            React.createElement(TextField, {
                key: 'email', required: true, variant: "outlined", label: "E-Mail", value: email,
                onChange: (e) => setEmail(e.target.value)
            }, null),
            React.createElement(TextField, {
                key: 'telefone', variant: "outlined", label: "Telefonnummer", value: telefone,
                onChange: (e) => setTelefone(e.target.value)
            }, null),
            !noEqualContactPersonInSystem ? React.createElement('p', {key: "contact-person-already-exists-error", className: "full-width"}, "Ein Ansprechpartner mit dieser E-Mail existiert bereits.") : null,
            message ? React.createElement('p', {key: "contact-person-error", className: "full-width"}, message) : null,
            React.createElement(FormButtons, {key: 'form-buttons-container', onCancel: handleCancel, onSave: handleSave, onDelete: handleDelete, createNewElement: createNewContactPerson})
        ])
    ]
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));