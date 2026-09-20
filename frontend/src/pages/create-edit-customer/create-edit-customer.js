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

    return pageBuilder(user, [React.createElement(CreateEditCustomer, {key: 'create-edit-customer'})])
}

function CreateEditCustomer() {
    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");

    const [createNewCustomer, setCreateNewCustomer] = useState(false); // First, it's assumed that the user only wants to edit
    const [noEqualCustomerInSystem, setNoEqualCustomerInSystem] = useState(true);
    const [message, setMessage] = useState('');

    const urlParams = new URLSearchParams(window.location.search);
    const customerIdInUrl = urlParams.get("id");

    useEffect(() => {
        if (!customerIdInUrl) {
            setCreateNewCustomer(true);
            return;
        }

        // Get the customer (for editing)
        fetch(`http://localhost:8080/api/customers/${customerIdInUrl}`)
            .then(r => r.json())
            .then(customer => {
                setName(customer.name);
                setWebsite(customer.website);
            });
    }, [customerIdInUrl]);

    const handleBack = () => { window.location.href = "../customer-page/customer-page.html" };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {name, website}

        // Reset Messages after a new click
        setMessage('');
        setNoEqualCustomerInSystem(true);

        // Check inputs
        if (name === "") {
            setMessage('Der Kundenname darf nicht leer sein.');
            return;
        }

        const editCustomer = customerIdInUrl;
        if (!editCustomer) {
            // Creating a new customer (not edit an already existing one)
            const responseCheck = await fetch('http://localhost:8080/api/customers/customer-exists?name=' + encodeURIComponent(name));
            if (!responseCheck.ok) return;

            const exists = await responseCheck.json();
            if (exists) {
                setNoEqualCustomerInSystem(false);
                return;
            }
        }

        const response = await responseFunctionPutPost(editCustomer, `http://localhost:8080/api/customers/${customerIdInUrl}`, "http://localhost:8080/api/customers/create", payload)

        if (response.ok) {
            setMessage('Der Kunde wurde erfolgreich angelegt/bearbeitet!');
            handleBack()
        } else if (response.status === 409) {
            setMessage('Es gibt bereits einen Kunden mit diesem Namen.');
        } else {
            setMessage('Aktion fehlgeschlagen.');
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!customerIdInUrl) return;

        const confirmed = window.confirm(`Soll der Kunde mit der ID "${customerIdInUrl}" wirklich gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden.`);
        if (!confirmed) return; // Stop action

        // Delete process
        const response = await fetch(`http://localhost:8080/api/customers/${customerIdInUrl}`, {method: "DELETE"});

        if (response.ok) {
            setMessage('Der Kunde wurde erfolgreich gelöscht!');
            handleBack()
        } else {
            setMessage('Löschen fehlgeschlagen. Bitte prüfen, ob es noch nicht gelöschte Ansprechpartner von diesem Kunden gibt.');
        }
    };

    return [
        React.createElement("form", {key: 'create-element-form', className: "create-element-form"}, [
            React.createElement('h2', {key: 'headline'}, customerIdInUrl ? "Bestehenden Kunden bearbeiten" : "Neuen Kunden anlegen"),
            React.createElement(TextField, {
                key: 'name', required: true, variant: "outlined", label: "Kundenname", value: name,
                onChange: (e) => setName(e.target.value)
            }),
            React.createElement(TextField, {
                key: 'website', variant: "outlined", label: "Website", value: website,
                onChange: (e) => setWebsite(e.target.value)
            }),
            !noEqualCustomerInSystem ? React.createElement('p', {key: "customer-already-exists-error", className: "full-width"}, "Dieser Kunde existiert bereits.") : null,
            message ? React.createElement('p', {key: "customer-error", className: "full-width"}, message) : null,
            React.createElement(FormButtons, {key: 'form-buttons-container', onCancel: handleBack, onSave: handleSave, onDelete: handleDelete, createNewElement: createNewCustomer})
        ])
    ]
}