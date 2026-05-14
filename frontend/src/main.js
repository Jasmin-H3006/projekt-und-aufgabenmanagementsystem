import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {Button, TextField} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import theme from "./css/theme-provider.js";
import {MenuComponentLogin} from "./js/menu-component-login.js";

function LogInForm() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = { username, password };

        try {
            const response = await fetch('http://localhost:8080/api/auth/log-in', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(user),
                credentials: 'include', // Important for session-handling
            });

            if (response.ok) {
                setMessage('Anmeldung erfolgreich!');
                window.location.href="./src/pages/home/home.html"
            } else if (response.status === 409) {
                setMessage('Dieser Benutzername wurde noch nicht hinterlegt. Bitte an einen Admin wenden, damit dieser ihn hinterlegen kann.');
            } else if (response.status === 401) {
                setMessage('Das Passwort ist inkorrekt. Bitte erneut versuchen.');
            } else {
                setMessage('Registrierung fehlgeschlagen.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Verbindungsfehler.');
        }
    };

    const [noAdminInSystem, setNoAdminInSystem] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8080/api/auth/admin-exists')
            .then(r => r.json())
            .then(exists => setNoAdminInSystem(!exists))
            .catch(() => setNoAdminInSystem(false));
    }, []);

    return (
        React.createElement(
            "form",
            {className: "log-in-form", onSubmit: handleSubmit},
            [
                React.createElement('h2', {key: "user-log-in"}, "Anmelden"),
                React.createElement(TextField,
                    {
                        key: "username", variant: "outlined", label: "Benutzername", value: username,
                        onChange: (e) => setUsername(e.target.value)
                    }, null),
                React.createElement(TextField,
                    {
                        key: "password", variant: "outlined", label: "Passwort", value: password,
                        onChange: (e) => setPassword(e.target.value)
                    }, null),
                message ? React.createElement('p', {key: "admin-error", className: "full-width"}, message) : null,
                React.createElement(
                    Button,
                    {key: "btn-user-log-in", color: 'primary', variant: 'contained', type: "submit"},
                    'Anmelden'
                ),
                noAdminInSystem ? React.createElement(
                    Button,
                    {key: "btn-register-admin-page", color: 'primary', variant: 'outlined', href: './src/pages/registrate-admin/registrate-admin.html'},
                    'Zur Admin-Registration'
                ) : null,
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
        React.createElement(LogInForm),
    )
);