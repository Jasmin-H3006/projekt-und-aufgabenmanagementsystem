import React, {useState, useEffect} from 'react';
import {Button, TextField} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import theme from "./css/theme-provider.js";
import {MenuComponentLogin} from "./js/menu-component-login.js";
import {FooterComponent} from "./js/footer-component.js";
import {renderInDOM} from "./js/page-builder.js";

function Page() {
    return React.createElement(
        ThemeProvider, { key: "theme-provider", theme },[
            React.createElement(MenuComponentLogin, {key: "menu-component-login"}),
            React.createElement(LogInForm, {key: "login-form"}),
            React.createElement(FooterComponent, {key: "footer-component"})
        ]
    )
}
renderInDOM(Page) // DOM

function LogInForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = { username, password };

        // Check inputs
        if (username.trim() === "") {
            setMessage('Bitte den Benutzernamen angeben.');
            return;
        }
        if (password.trim() === "") {
            setMessage('Bitte das Passwort angeben.');
            return;
        }

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

    const [noAdminInSystem, setNoAdminInSystem] = useState(true);

    useEffect(() => {
        // Check if an admin exists in system
        fetch('http://localhost:8080/api/auth/admin-exists')
            .then(r => r.json())
            .then(exists => setNoAdminInSystem(!exists))
            .catch(() => setNoAdminInSystem(false));
    }, []);

    return (
        React.createElement(
            "form", {key: "log-in-form", className: "log-in-form", onSubmit: handleSubmit}, [
            React.createElement('h2', {key: "user-log-in"}, "Anmelden"),
            React.createElement(TextField, {key: "username", variant: "outlined", label: "Benutzername", required: true, value: username,
                onChange: (e) => setUsername(e.target.value)
            }),
            React.createElement(TextField, {key: "password", variant: "outlined", label: "Passwort", type: "password", required: true, value: password,
                onChange: (e) => setPassword(e.target.value)
            }),
            message ? React.createElement('p', {key: "admin-error", className: "full-width"}, message) : null,
            React.createElement(Button, {key: "btn-user-log-in", color: 'primary', variant: 'contained', type: "submit"}, 'Anmelden'),
            noAdminInSystem ? React.createElement(Button, {key: "btn-register-admin-page", color: 'primary', variant: 'outlined', href: './src/pages/registrate-admin/registrate-admin.html'},  'Zur Admin-Registration') : null
        ])
    );
}