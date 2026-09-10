import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {Button, TextField} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import theme from "../../css/theme-provider.js";
import {MenuComponentLogin} from "../../js/menu-component-login.js";
import {FooterComponent} from "../../js/footer-component.js";

function RegisterUser() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/api/')
            .then(r => r.json())
    }, []);

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
            {className: "register-user-form", onSubmit: handleSubmit},
            [
                React.createElement('h2', {key: "user-register"}, "Als Nutzer Registrieren"),
                React.createElement(TextField, {key: "user-username", className: "full-width", variant: "outlined", label: "Benutzername", value: username, readOnly: true}, null),
                React.createElement(TextField, {key: "user-password-first-try", variant: "outlined", label: "Passwort", value: password,
                    onChange: (e) => setPassword(e.target.value)
                }, null),
                React.createElement(TextField, {key: "user-password-second-try", variant: "outlined", label: "Bitte das Passwort wiederholen", value: password,
                    onChange: (e) => setPassword(e.target.value)
                }, null),
                message ? React.createElement('p', {key: "user-error", className: "full-width"}, message) : null,
                React.createElement(
                    Button,
                    {key: "btn-user-register", color: 'primary', variant: 'contained', type: "submit"},
                    'Registrieren'
                )
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
        { theme },[
        React.createElement(MenuComponentLogin),
        React.createElement(RegisterUser),
        React.createElement(FooterComponent)]
    )
);