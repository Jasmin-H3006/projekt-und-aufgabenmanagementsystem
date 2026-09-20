import React, {useState} from 'react';
import {Button, TextField} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import theme from "../../css/theme-provider.js";
import {MenuComponentLogin} from "../../js/menu-component-login.js";
import {FooterComponent} from "../../js/footer-component.js";
import {renderInDOM} from "../../js/page-builder.js";

function Page() {
    return React.createElement(
        ThemeProvider, { key: "theme-provider", theme },[
            React.createElement(MenuComponentLogin, {key: 'menu-component-login'}),
            React.createElement(RegisterAdmin, {key: 'register-admin'}),
            React.createElement(FooterComponent, {key: 'footer-component'})
        ]
    )
}
renderInDOM(Page) // DOM

function RegisterAdmin() {
    // Registration is only one time (if there is no admin) possible to configure the system and create employees

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = { username, password };

        // Check inputs
        if (username.trim() === "") {
            setMessage('Bitte einen Benutzernamen angeben.');
            return;
        }
        if (password.trim() === "") {
            setMessage('Bitte ein Passwort angeben.');
            return;
        }
        if (password !== confirmPassword) {
            setMessage('Die Passwörter stimmen nicht überein');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/register-admin', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(user)
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
            "form", {key: "register-admin-form", className: "register-admin-form", onSubmit: handleSubmit}, [
                React.createElement('h2', {key: "admin-register"}, "Als Admin Registrieren"),
                React.createElement(TextField, { key: "admin-username", className: "full-width", variant: "outlined", label: "Benutzername", value: username,
                    onChange: (e) => setUsername(e.target.value)
                }),
                React.createElement(TextField, {key: "admin-password-first-try", variant: "outlined", label: "Passwort", type: "password", required: true, value: password,
                    onChange: (e) => setPassword(e.target.value)
                }),
                React.createElement(TextField, {key: "admin-password-second-try", variant: "outlined", label: "Passwort wiederholen", type: "password", required: true, value: confirmPassword,
                    onChange: (e) => setConfirmPassword(e.target.value)
                }),
                message ? React.createElement('p', {key: "admin-error", className: "full-width"}, message) : null,
                React.createElement(Button, {key: "btn-admin-register", color: 'primary', variant: 'contained', type: "submit"}, 'Registrieren'),
                React.createElement(Button, {key: "btn-back-to-login-page", color: 'primary', variant: 'outlined', href: '../../../index.html'},  'Zur Anmelden-Seite')
            ]
        )
    );
}