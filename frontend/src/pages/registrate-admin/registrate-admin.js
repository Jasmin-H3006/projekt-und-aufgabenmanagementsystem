import React, {useReducer, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {Button, TextField} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import theme from "../../css/theme-provider.js";
import {MenuComponentLogin} from "../../js/menu-component-login.js";

function RegisterAdmin() {
    // Registration is only one time (if there is no admin) possible to configure the system and create employees

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = { username, password };

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                setMessage('Registrierung erfolgreich!');
                alert('Registrierung erfolgreich! Sie können sich nun am System anmelden.');
                window.location.href="../../../index.html"
            } else if (response.status === 409) {
                setMessage('Es existiert bereits ein Admin. Bitte an den bisherigen Admin wenden, damit dieser neue hinzufügen kann.');
            } else {
                setMessage('Registrierung fehlgeschlagen. Ggf. existiert dieser Benutzername bereits.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Verbindungsfehler.');
        }
    };

    return (
        React.createElement(
            "form",
            {className: "register-admin-form", onSubmit: handleSubmit},
            [
                React.createElement('h2', {key: "admin-register"}, "Als Admin Registrieren"),
                React.createElement(TextField,
                    {
                        key: "admin-username", variant: "outlined", label: "Benutzername", value: username,
                        onChange: (e) => setUsername(e.target.value)
                    }, null),
                React.createElement(TextField, {key: "admin-password", variant: "outlined", label: "Passwort", value: password,
                    onChange: (e) => setPassword(e.target.value)
                }, null),
                message ? React.createElement('p', {key: "admin-error", className: "full-width"}, message) : null,
                React.createElement(
                    Button,
                    {key: "btn-admin-register", color: 'primary', variant: 'contained', type: "submit"},
                    'Registrieren'
                ),
                React.createElement(
                    Button,
                    {key: "btn-back-to-login-page", color: 'primary', variant: 'outlined', href: '../../../index.html'},
                    'Zur Anmelden-Seite'
                ),
            ]
        )
    );
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
    React.createElement(
        ThemeProvider,
        { theme: theme },
        React.createElement(MenuComponentLogin),
        React.createElement(RegisterAdmin)
    )
);