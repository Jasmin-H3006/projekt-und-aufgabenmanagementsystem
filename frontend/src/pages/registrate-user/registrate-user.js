import React, {useEffect, useState} from 'react';
import {Button, TextField} from "@mui/material";
import {pageBuilder, renderInDOM} from "../../js/page-builder.js";

renderInDOM(Page); // DOM

function Page() {
    return pageBuilder(null, React.createElement(RegisterUser, {key: 'register-user'}), false)
}

function RegisterUser() {
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    useEffect(() => {
        if (!token) return;

        // Get invitation
        fetch(`http://localhost:8080/api/auth/invitation-user?token=${encodeURIComponent(token)}`)
            .then(r => r.json())
            .then(data => {
                setUsername(data.username);
                setUserId(data.id);
            });
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId || !token) {
            setMessage('Der Einladungslink ist ungültig oder konnte nicht geladen werden.');
            return;
        }

        // Check inputs
        if (password.trim() === "") {
            setMessage('Bitte ein Passwort angeben.');
            return;
        }
        if (password !== confirmPassword) {
            setMessage('Die Passwörter stimmen nicht überein');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}/activate`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    token: token,
                    password: password
                })
            });

            if (response.ok) {
                setMessage('Registrierung erfolgreich!');
                alert('Registrierung erfolgreich! Sie können sich nun am System anmelden.');
                window.location.href="../../../index.html"
            } else {
                setMessage('Registrierung fehlgeschlagen. Bitte an einen Admin wenden.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Verbindungsfehler.');
        }
    };

    return (
        React.createElement(
            "form", {key: "register-user-form", className: "register-user-form", onSubmit: handleSubmit}, [
            React.createElement('h2', {key: "user-register"}, `Als Nutzer "${username}" registrieren`),
            React.createElement(TextField, {key: "user-password-first-try", variant: "outlined", label: "Passwort", type: "password", required: true, value: password,
                onChange: (e) => setPassword(e.target.value)
            }),
            React.createElement(TextField, {key: "user-password-second-try", variant: "outlined", label: "Passwort wiederholen", type: "password", required: true, value: confirmPassword,
                onChange: (e) => setConfirmPassword(e.target.value)
            }),
            message ? React.createElement('p', {key: "user-error", className: "full-width"}, message) : null,
            React.createElement(Button, {key: "btn-user-register", color: 'primary', variant: 'contained', type: "submit"}, 'Registrieren')
        ])
    );
}