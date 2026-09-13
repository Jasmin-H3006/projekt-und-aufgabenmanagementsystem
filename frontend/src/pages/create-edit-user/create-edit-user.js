import {React, useEffect, useState, ReactDOM, FormButtons, TextField, MenuItem, requireLogin} from "../../imports/create-edit-forms-imports.js";
import {pageBuilder} from "../../js/page-builder.js";
import {Button} from "@mui/material";

function Page() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");
    useEffect(() => {
        requireLogin(setUsername, true)
            .then(setUser);
    }, []);

    return pageBuilder(user, [React.createElement(CreateEditUser, {user})])
}

function CreateEditUser({user}) {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState("");

    const [roles, setRoles] = useState([]);
    const [roleId, setRoleId] = useState("");

    const [createNewUser, setCreateNewUser] = useState(false); // First, it's assumed that the user only wants to edit
    const [noEqualUserInSystem, setNoEqualUserInSystem] = useState(true);
    const [message, setMessage] = useState('');

    const [invitationLink, setInvitationLink] = useState("");
    const [invitationExpiry, setInvitationExpiry] = useState("");

    const [userIdInUrl, setUserIdInUrl] = useState(
        new URLSearchParams(window.location.search).get("id")
    );

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
            if (!editUser) {
                // Invitation link
                const responseData = await response.json();
                setInvitationLink(responseData.registrationLink);
                setInvitationExpiry(responseData.expiresAt);

                // Write userId in URL
                setUserIdInUrl(responseData.userId);
                window.history.replaceState(
                    null,
                    "",
                    `${window.location.pathname}?id=${responseData.userId}`
                );
                // User is now an already existing user (important for editing in the same window in which the user was created)
                setCreateNewUser(false);
                setMessage('Der Nutzer wurde erfolgreich angelegt!');
            } else {
                setMessage('Der Nutzer wurde erfolgreich bearbeitet!');
                handleBack()
            }
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

    const handleResetPassword = async(e) => {
        e.preventDefault();
        if (!userIdInUrl) return;

        const confirmed = window.confirm(
            `Soll das Passwort des Nutzers mit der ID "${userIdInUrl}" wirklich zurückgesetzt werden? Diese Aktion kann nicht rückgängig gemacht werden.`
        );
        if (!confirmed) return; // Stop action

        // Reset password
        const response = await fetch(`http://localhost:8080/api/users/${userIdInUrl}/reset-password`,{method: "PUT"});

        if (response.ok) {
            const data = await response.json();
            setInvitationLink(data.registrationLink);
            setInvitationExpiry(data.expiresAt);
            setMessage('Das Passwort des Nutzers wurde erfolgreich zurückgesetzt!');
        } else {
            setMessage('Das Zurücksetzen des Passworts ist fehlgeschlagen.');
        }
    }

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
            React.createElement(FormButtons, {key: 'form-buttons-container', onCancel: handleBack, onSave: handleSave, onDelete: handleDelete, createNewElement: createNewUser, userForm: true}),
            userIdInUrl ? React.createElement(Button, {key: 'reset-password', type: 'button', color: 'warning', variant: 'contained', onClick: handleResetPassword}, 'Passwort zurücksetzen') : null,
            invitationLink ? React.createElement('div', {key: 'invitation-container', className: 'invitation-container full-width'}, [
                React.createElement('h3', {key: 'invitation-title'}, 'Aktivierungslink'),
                React.createElement('strong', {key: 'invitation-hint-text'}, "Bitte kopieren Sie sich den Link in die Zwischenablage, da er nur einmal angezeigt wird."),
                React.createElement('p', {key: 'invitation-text'}, invitationLink),
                invitationExpiry ? React.createElement('small', {key: 'expiry-info'}, `Verfällt: ${new Date(invitationExpiry).toLocaleString('de-DE')}`) : null,
                React.createElement(Button, {key: 'copy-button', className: 'ml-2', variant: 'outlined', size: 'small', onClick: () => {navigator.clipboard.writeText(invitationLink); alert('Link kopiert!');}}, 'In Zwischenablage kopieren')
            ]) : null,
        ])
    ]
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));