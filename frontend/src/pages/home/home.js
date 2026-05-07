import React from 'react';
import ReactDOM from 'react-dom/client';
import {Button, Table, TableBody, TableRow, TableCell, Toolbar, Typography} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import {Menu} from '../../js/menu.js';
import theme from "../../css/theme-provider.js";
import {ProjectsTableHeader} from "../../js/projects-table.js";

function Intro() {
    return React.createElement(
        Typography,
        null,
        [
            React.createElement(
                "h2",
                null,
                "Mane - Ihr Projekt- & Aufgabenmanagementsystem. Willkommen, {Benutzername}!"
            ),
            React.createElement(
                "h2",
                null,
                "Willkommen, {Benutzername}!"
            )
        ]
    )
}

function Home() {
    return React.createElement(
        Toolbar,
        null,
        [
            React.createElement('h3', null, "Meine Projekte"),
            React.createElement(Button, {color: 'secondary', variant: 'contained'}, "Neues Projekt anlegen")
        ]
    )
}

function MyProjectsTable() {
    return React.createElement(
        Table,
        null,
        [
            React.createElement(ProjectsTableHeader),
            React.createElement(
                TableBody,
                null,
                React.createElement(
                    TableRow,
                    null,
                    React.createElement(TableCell, null, "Test"),
                    React.createElement(TableCell, null, 'Aktion...')
                )
            ),
        ]
    )
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// Komponenten als Funktion aufrufen
root.render(
    React.createElement(
        ThemeProvider,
        { theme: theme },
        React.createElement(Menu),
        React.createElement(Intro),
        React.createElement(Home),
        React.createElement(MyProjectsTable)
    )
);