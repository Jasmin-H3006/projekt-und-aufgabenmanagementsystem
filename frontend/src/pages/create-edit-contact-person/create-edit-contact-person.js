import {React, useEffect, useState, FormButtons, TextField, requireLogin} from "../../imports/create-edit-forms-imports.js";
import {pageBuilder, renderInDOM} from "../../js/page-builder.js";
import {responseFunctionPutPost} from "../../js/create-edit-forms.js";

renderInDOM(Page); // DOM

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
    const [customerName, setCustomerName] = useState("");

    const [createNewContactPerson, setCreateNewContactPerson] = useState(false); // First, it's assumed that the user only wants to edit
    const [noEqualContactPersonInSystem, setNoEqualContactPersonInSystem] = useState(true);
    const [message, setMessage] = useState('');

    const urlParams = new URLSearchParams(window.location.search);
    const contactPersonIdInUrl = urlParams.get("id");
    const customerIdInUrl = urlParams.get("customerId");

    useEffect(() => {
        // Creat/edit a contact person is only available if there is a customerId
        if (!customerIdInUrl) return;

        // Get the customer for this contact person
        fetch(`http://localhost:8080/api/customers/${customerIdInUrl}`)
            .then(r => r.json())
            .then(customer => setCustomerName(customer.name));

        if (!contactPersonIdInUrl) {
            setCreateNewContactPerson(true);
            return;
        }

        // Get the contact person (for editing)
        fetch(`http://localhost:8080/api/customer/contact-persons/${contactPersonIdInUrl}`)
            .then(r => r.json())
            .then(contactPerson => {
                setName(contactPerson.name)
                setEmail(contactPerson.email)
                setTelefone(contactPerson.telefone)
            });
    }, [customerIdInUrl, contactPersonIdInUrl]);

    const handleBack = (customerIdInUrl) => { window.location.href = '../customer-contact-persons/customer-contact-persons.html?customerId=' + customerIdInUrl };

    const handleCancel = async (e) => {
        e.preventDefault();
        handleBack(customerIdInUrl)
    }

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {name, email, telefone, customerId: customerIdInUrl}

        // Reset Messages after a new click
        setMessage('');
        setNoEqualContactPersonInSystem(true);

        // Check inputs
        if (name === "") {
            setMessage('Der Name vom Ansprechpartner darf nicht leer sein.');
            return;
        }
        if (email === "") {
            setMessage('Die E-Mail vom Ansprechpartner darf nicht leer sein.');
            return;
        }

        const editContactPerson = contactPersonIdInUrl;
        if(!editContactPerson) {
            // Creating a new contact person (not edit an already existing one)
            const responseCheck = await fetch('http://localhost:8080/api/customer/contact-persons/contact-person-exists?email=' + encodeURIComponent(email));
            if (!responseCheck.ok) return;

            const exists = await responseCheck.json();
            if (exists) {
                setNoEqualContactPersonInSystem(false);
                return;
            }
        }

        const response = await responseFunctionPutPost(editContactPerson, `http://localhost:8080/api/customer/contact-persons/${contactPersonIdInUrl}`, "http://localhost:8080/api/customer/contact-persons/create", payload)

        if (response.ok) {
            setMessage('Der Ansprechpartner wurde erfolgreich angelegt/bearbeitet!');
            handleBack(customerIdInUrl)
        } else if (response.status === 409) {
            setMessage('Es existiert bereits ein Ansprechpartner mit dieser E-Mail.');
        } else {
            setMessage('Aktion fehlgeschlagen.');
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!contactPersonIdInUrl) return;

        const confirmed = window.confirm(`Soll der Ansprechpartner mit der ID "${contactPersonIdInUrl}" wirklich gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden.`);
        if (!confirmed) return; // Stop action

        // Delete process
        const response = await fetch(`http://localhost:8080/api/customer/contact-persons/${contactPersonIdInUrl}`, {method: "DELETE"});

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
            }),
            React.createElement(TextField, {
                key: 'email', required: true, variant: "outlined", label: "E-Mail", value: email,
                onChange: (e) => setEmail(e.target.value)
            }),
            React.createElement(TextField, {
                key: 'telefone', variant: "outlined", label: "Telefonnummer", value: telefone,
                onChange: (e) => setTelefone(e.target.value)
            }),
            !noEqualContactPersonInSystem ? React.createElement('p', {key: "contact-person-already-exists-error", className: "full-width"}, "Ein Ansprechpartner mit dieser E-Mail existiert bereits.") : null,
            message ? React.createElement('p', {key: "contact-person-error", className: "full-width"}, message) : null,
            React.createElement(FormButtons, {key: 'form-buttons-container', onCancel: handleCancel, onSave: handleSave, onDelete: handleDelete, createNewElement: createNewContactPerson})
        ])
    ]
}