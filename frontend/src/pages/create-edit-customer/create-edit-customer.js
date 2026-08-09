import {React, useEffect, useState, ReactDOM, ThemeProvider, theme, MenuComponent, FormButtons, TextField, MenuItem, requireLogin} from "../../imports/create-edit-forms-imports.js";
import {FooterComponent} from "../../js/footer-component.js";
import {Box} from "@mui/material";
import {pageBuilder} from "../../js/page-builder.js";

function Page() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");
    useEffect(() => {
        requireLogin(setUsername, false, false, false, false, false, true)
            .then(setUser);
    }, []);

    return pageBuilder(user, [React.createElement(CreateEditCustomer)])
}

function CreateEditCustomer() {
    const [customers, setCustomers] = useState([]);
    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");

    const [createNewCustomer, setCreateNewCustomer] = useState(false); // First, it's assumed that the user only wants to edit
    const [noEqualCustomerInSystem, setNoEqualCustomerInSystem] = useState(true);
    const [message, setMessage] = useState('');

    const urlParams = new URLSearchParams(window.location.search);
    const customerIdInUrl = urlParams.get("id");

    useEffect(() => {
        fetch("http://localhost:8080/api/customers/get-all")
            .then(res => res.json())
            .then(data => setCustomers(data));

        if (!customerIdInUrl) {
            setCreateNewCustomer(true);
            return;
        }

        fetch(`http://localhost:8080/api/customers/${customerIdInUrl}`)
            .then(r => r.json())
            .then(customer => {
                setName(customer.name);
                setWebsite(customer.website);
            });
    }, [customerIdInUrl]);

    const handleBack = () => {
        window.location.href = "../customer-page/customer-page.html";
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            name,
            website
        }

        // Reset Messages after a new click
        setMessage('');
        setNoEqualCustomerInSystem(true);

        const editCustomer = customerIdInUrl;

        if(!editCustomer) {
            // Creating a new customer (not edit an already existing one)
            const responseCheck = await fetch(
                'http://localhost:8080/api/customers/customer-exists?name=' + encodeURIComponent(name)
            );
            if (!responseCheck.ok) return;
            const exists = await responseCheck.json();

            if (exists) {
                setNoEqualCustomerInSystem(false);
                return;
            }
        }

        if(name === "") {
            setMessage('Der Kundenname darf nicht leer sein.');
            return;
        }

        const responseUrl = editCustomer ? `http://localhost:8080/api/customers/${customerIdInUrl}` : "http://localhost:8080/api/customers/create";
        const method = editCustomer ? "PUT" : "POST";

        // Save process
        const response = await fetch(responseUrl, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

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

        const confirmed = window.confirm(
            `Soll der Kunde mit der ID "${customerIdInUrl}" wirklich gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden.`
        );

        if (!confirmed) return; // Stop action

        // Delete process
        const response = await fetch(
            `http://localhost:8080/api/customers/${customerIdInUrl}`,
            {method: "DELETE"}
        );

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
            }, null),
            React.createElement(TextField, {
                key: 'website', variant: "outlined", label: "Website", value: website,
                onChange: (e) => setWebsite(e.target.value)
            }, null),
            !noEqualCustomerInSystem ? React.createElement('p', {key: "customer-already-exists-error", className: "full-width"}, "Dieser Kunde existiert bereits.") : null,
            message ? React.createElement('p', {key: "customer-error", className: "full-width"}, message) : null,
            React.createElement(FormButtons, {key: 'form-buttons-container', onCancel: handleBack, onSave: handleSave, onDelete: handleDelete, createNewElement: createNewCustomer})
        ])
    ]
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));