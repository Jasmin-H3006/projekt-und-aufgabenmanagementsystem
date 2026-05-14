import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {Button, Table, TableBody, TableRow, TableCell, Toolbar, Typography} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import {MenuComponent} from '../../js/menuComponent.js';
import theme from "../../css/theme-provider.js";
import {ProjectsTableHeader} from "../../js/projects-table.js";

function Intro() {

    const [username, setUsername] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/api/auth/current-user", { credentials: "include" })
            .then(res => res.ok ? res.text() : Promise.reject("Failed to fetch current user"))
            .then(username => setUsername(username));
    }, []);

    return React.createElement(
        Typography,
        null,
        React.createElement(
            "h2",
            {key: 'welcome'},
            `Mane - Ihr Projekt- & Aufgabenmanagementsystem. Willkommen, ${username}!`
        )
    )
}

function Home() {
    return React.createElement(
        Toolbar,
        null,
        [
            React.createElement('h3', null, "Meine Projekte"),
            React.createElement(Button, {color: 'secondary', variant: 'contained', href: '../create-edit-project/create-edit-project.html'}, "Neues Projekt anlegen")
        ]
    )
}

function MyProjectsTable() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/projects")
            .then(res => res.json())
            .then(data => setProjects(data));
    }, []);

    return React.createElement(
        Table,
        null,
        [
            React.createElement(ProjectsTableHeader),
            React.createElement(
                TableBody,
                null,
                projects.map(project =>
                    React.createElement(
                        TableRow,
                        { key: project.id },
                        React.createElement(TableCell, null, project.id),
                        React.createElement(TableCell, null, project.title),
                        React.createElement(TableCell, null, project.customer?.name  ?? "-"),
                        React.createElement(TableCell, null, 'Fortschritt'),
                        React.createElement(TableCell, null, project.projectManager?.username  ?? "-"),
                        React.createElement(TableCell, null, project.users?.username ?? "-"),
                        React.createElement(TableCell, null, project.deadline ?? "-")
                    )
                )
            ),
        ]
    )
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
    React.createElement(
        ThemeProvider,
        { theme: theme },
        React.createElement(MenuComponent),
        React.createElement(Intro),
        React.createElement(Home),
        React.createElement(MyProjectsTable)
    )
);