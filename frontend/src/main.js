import React, {useState, useEffect} from 'react';
import {Button, TextField} from "@mui/material";
import {pageBuilder, renderInDOM} from "./js/page-builder.js";
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ListAltIcon from '@mui/icons-material/ListAlt';

renderInDOM(Page); // DOM

function Page() {
    return pageBuilder(null,
        React.createElement("div", {key: "login-page", className: "login-page-container"}, [
            React.createElement(TeaserText, {key: "teaser-text"}),
            React.createElement(LogInForm, {key: "login-form"})
        ]), false
    )
}

function TeaserText() {

    function iconTextElement(nameOfIcon, iconElement, iconDescription) {
        return React.createElement("div", {key: nameOfIcon + "-icon-container", className: "mane-opportunity"}, [
            React.createElement(iconElement, {key: nameOfIcon + "-icon", className: "filter-primary"}),
            React.createElement("p", {key: nameOfIcon + "-icon-text", className: "icon-description"}, `${iconDescription}`)
        ])
    }

    return (
        React.createElement("div", {key: "teaser-text-container", className: "teaser-text-container"}, [
            React.createElement("h2", {key: "teaser-text-hedline"}, "Willkommen in Mane - deinem Managementsystem!"),
            React.createElement("p", {key: "teaser-text"}, "Mane ist ein Projekt- und Managementsystem, in dem du deine Projekte, Nutzer und Kunden verwalten kannst. Melde dich an, um deine Projekte zu verwalten oder Aufgaben zu prüfen!"),
            React.createElement("div", {key: "teaser-text-icon-list-container"}, [
                React.createElement("h3", {key: "teaser-text-icon-list-teaser"}, "Deine Möglichkeiten mit Mane:"),
                React.createElement("div", {key: "icons-container", className: "mane-opportunities"}, [
                    iconTextElement("person", PersonIcon, "Verwalte Nutzer und lege Rollen fest"),
                    iconTextElement("project", AccountTreeIcon, "Verwalte deine Projekte und verfolge Fortschritte"),
                    iconTextElement("task", ListAltIcon, "Lege Aufgaben für deine Projekte an, um den Überblick zu behalten"),
                    iconTextElement("customer", StoreIcon, "Definiere Kunden und seine zugehörigen Ansprechpartner")
                ]),
            ])
        ])
    )
}

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
                setMessage('Dieser Benutzername wurde noch nicht hinterlegt. Bitte wende dich an einen Admin, damit dieser ihn hinterlegen kann.');
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