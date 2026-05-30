import {React, useEffect, useState, ReactDOM, ThemeProvider, theme, MenuComponent, FormButtons, TextField, MenuItem, requireLogin} from "../../imports/create-edit-forms-imports.js";

function Page() {
    const [username, setUsername] = useState("");
    useEffect(() => {
        requireLogin(setUsername);
    }, []);

    return React.createElement(
        ThemeProvider,
        { theme: theme },
        React.createElement(MenuComponent),
        React.createElement(CreateEditRole)
    );
}

function CreateEditRole() {

    const [noEqualRoleInSystem, setNoEqualRoleInSystem] = useState(true);
    const [name, setName] = useState(""); // Role name
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/api/roles/role-exists?name=' + encodeURIComponent(name))
            .then(r => r.json())
            .then(exists => setNoEqualRoleInSystem(!exists))
            .catch(() => setNoEqualRoleInSystem(false));
    }, []);

    const handleBack = () => {
        window.location.href = "../admin-area/admin-area.html";
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = { name };

        if(!noEqualRoleInSystem) return;

        const response = await fetch("http://localhost:8080/api/roles/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            setMessage('Die Rolle wurde erfolgreich angelegt/bearbeitet!');
            handleBack()
        } else {
            setMessage('Aktion fehlgeschlagen.');
        }
    };

    const handleDelete = () => {
        handleBack()
    };

    return [
        React.createElement("form", {key: 'create-element-form', className: "create-element-form"}, [
            React.createElement('h2', {key: 'headline'}, "Rolle anlegen/bearbeiten"),
            React.createElement(TextField, {key: 'name', required: true, variant: "outlined", label: "Bezeichnung",  value: name,
                onChange: (e) => setName(e.target.value)
            }, null),
            !noEqualRoleInSystem ? React.createElement('p', {key: "role-already-exists-error", className: "full-width"}, "Diese Rolle existiert bereits.") : null,
            message ? React.createElement('p', {key: "role-error", className: "full-width"}, message) : null,
            React.createElement(FormButtons, {onSave: handleSave, onDelete: handleDelete})
        ])
    ]
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));