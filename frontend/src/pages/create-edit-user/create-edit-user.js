import {React, useEffect, useState, ReactDOM, ThemeProvider, theme, MenuComponent, FormButtons, TextField, MenuItem, requireLogin} from "../../imports/create-edit-forms-imports.js";

function Page() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");
    useEffect(() => {
        requireLogin(setUsername, true)
            .then(setUser);
    }, []);

    return React.createElement(
        ThemeProvider,
        { theme: theme },
        React.createElement(MenuComponent, { user }),
        React.createElement(CreateEditUser)
    );
}

function CreateEditUser() {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState("");

    const [roles, setRoles] = useState([]);
    const [roleId, setRoleId] = useState("");

    const [createNewUser, setCreateNewUser] = useState(false); // First, it's assumed that the user only wants to edit
    const [noEqualUserInSystem, setNoEqualUserInSystem] = useState(true);
    const [message, setMessage] = useState('');

    const urlParams = new URLSearchParams(window.location.search);
    const userIdInUrl = urlParams.get("id");

    useEffect(() => {
        fetch("http://localhost:8080/api/users/get-all")
            .then(res => res.json())
            .then(data => setUsers(data));

        fetch("http://localhost:8080/api/roles/get-all")
            .then(res => res.json())
            .then(data => setRoles(data));

        if (!userIdInUrl) {
            setCreateNewUser(true);
            return;
        }

        fetch(`http://localhost:8080/api/users/${userIdInUrl}`)
            .then(r => r.json())
            .then(user => {
                setUsername(user.username);
                setRoleId(user.role.id);
            });
    }, [userIdInUrl]);

    const handleBack = () => {
        window.location.href = "../admin-area/admin-area.html";
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            username,
            roleId
        }

        // Reset Messages after a new click
        setMessage('');
        setNoEqualUserInSystem(true)

        const editUser = userIdInUrl;

        if(!editUser) {
            // Creating a new user (not edit an already existing one)
            const responseCheck = await fetch(
                'http://localhost:8080/api/users/user-exists?username=' + encodeURIComponent(username)
            );
            if (!responseCheck.ok) return;
            const exists = await responseCheck.json();

            if (exists) {
                setNoEqualUserInSystem(false);
                return;
            }
        }

        if(username === "") {
            setMessage('Der Benutzername darf nicht leer sein.');
            return;
        }
        if(roleId === "") {
            setMessage('Jedem Nutzer muss eine Rolle zugeordnet werden.');
            return;
        }

        const responseUrl = editUser ? `http://localhost:8080/api/users/${userIdInUrl}` : "http://localhost:8080/api/users/create";
        const method = editUser ? "PUT" : "POST";

        // Save process
        const response = await fetch(responseUrl, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            setMessage('Der Nutzer wurde erfolgreich angelegt/bearbeitet!');
            handleBack()
        } else if (response.status === 409) {
            setMessage('Es gibt bereits einen Nutzer mit diesem Benutzernamen.');
        } else {
            setMessage('Aktion fehlgeschlagen.');
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        if (!userIdInUrl) return;

        const confirmed = window.confirm(
            `Soll der Nutzer mit der ID "${userIdInUrl}" wirklich gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden.`
        );

        if (!confirmed) return; // Stop action


        // Delete process
        const response = await fetch(
            `http://localhost:8080/api/users/${userIdInUrl}`,
            {method: "DELETE"}
        );

        if (response.ok) {
            setMessage('Der Nutzer wurde erfolgreich gelöscht!');
            handleBack()
        } else {
            setMessage('Löschen fehlgeschlagen.');
        }
    };

    return [
        React.createElement("form", {key: 'create-element-form', className: "create-element-form"}, [
            React.createElement('h2', {key: 'headline'}, userIdInUrl ? "Bestehenden Nutzer bearbeiten" : "Neuen Nutzer anlegen"),
            React.createElement(TextField, {
                key: 'username', required: true, variant: "outlined", label: "Benutzername", value: username,
                onChange: (e) => setUsername(e.target.value)
            }, null),
            React.createElement(TextField,
                {key: 'role', select: true, required: true, value: roleId, variant: "outlined", label: "Rolle", onChange: (e) => setRoleId(e.target.value),},
                roles.map(role =>
                    React.createElement(MenuItem, { key: role.id, value: role.id }, role.name)
                )
            ),
            !noEqualUserInSystem ? React.createElement('p', {key: "user-already-exists-error", className: "full-width"}, "Dieser Nutzer existiert bereits.") : null,
            message ? React.createElement('p', {key: "user-error", className: "full-width"}, message) : null,
            React.createElement(FormButtons, {key: 'form-buttons-container', onCancel: handleBack, onSave: handleSave, onDelete: handleDelete, createNewElement: createNewUser})
        ])
    ]
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));