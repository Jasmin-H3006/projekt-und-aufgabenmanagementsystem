import React, {useReducer, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {Button, TextField} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import theme from "./css/theme-provider.js";

function LogInForm() {
    return (
        React.createElement(
            "form",
            {className: "log-in-form"},
            [
                React.createElement('h2', {key: "user-log-in"}, "Anmelden"),
                React.createElement(TextField, {key: "username", variant: "outlined", label: "Benutzername"}, null),
                React.createElement(TextField, {key: "password", variant: "outlined", label: "Passwort"}, null),
                React.createElement(
                    Button,
                    {key: "btn-user-log-in", color: 'primary', variant: 'contained'},
                    'Anmelden'
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
        React.createElement(LogInForm, { key: "login" }),
    )
);