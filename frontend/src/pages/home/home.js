import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {Button, Table, TableBody, TableRow, TableCell, Toolbar, Typography} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import {MenuComponent} from '../../js/menu-component.js';
import theme from "../../css/theme-provider.js";
import {ProjectsTableHeader} from "../../js/projects-table.js";
import {requireLogin} from "../../js/session-handling.js";

function Page() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");
    useEffect(() => {
        requireLogin(setUsername)
            .then(setUser);
    }, []);

    return React.createElement(
        ThemeProvider,
        { theme },
        React.createElement(MenuComponent, { user }),
        React.createElement(Intro, { username }),
        React.createElement(MyProjectsTable)
    );
}

function Intro({username}) {
    return React.createElement(
        Typography,
        {key: 'mane-intro', className: 'pl-2'},
        React.createElement(
            "h2",
            {key: 'welcome'},
            `Mane - Ihr Projekt- & Aufgabenmanagementsystem. Willkommen, ${username}!`
        )
    )
}

function MyProjectsTable() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/projects")
            .then(res => res.json())
            .then(projects => setProjects(projects));
    }, []);

    const tableIntroduction = (
        React.createElement(
            Toolbar,
            {key: 'projects-introduction', className: 'table-introduction pl-0 pt-3'},
            [
                React.createElement('h3', {key: 'introduction-header', className: 'pl-2'}, "Meine Projekte"),
                React.createElement(Button, {key: 'btn-new-project', className: 'btn-new-project', color: 'primary', variant: 'contained', href: '../create-edit-project/create-edit-project.html'}, "Neues Projekt anlegen")
            ]
        )
    );

    const table = (
        projects.length > 0 ? React.createElement(
            Table,
            {key: 'projects-table'},
            [
                React.createElement(ProjectsTableHeader),
                React.createElement(
                    TableBody,
                    {key: 'projects-table-body'},
                    projects.map(project =>
                        React.createElement(
                            TableRow,
                            { key: project.id },
                            React.createElement(TableCell, {key: 'project-id'}, project.id),
                            React.createElement(TableCell, {key: 'project-name'}, project.title),
                            React.createElement(TableCell, {key: 'project-customer'}, project.customer?.name  ?? "-"),
                            React.createElement(TableCell, {key: 'project-progress'}, 'Fortschritt'),
                            React.createElement(TableCell, {key: 'project-manager'}, project.projectManager?.username  ?? "-"),
                            React.createElement(TableCell, {key: 'project-user'}, project.users?.username ?? "-"),
                            React.createElement(TableCell, {key: 'project-deadline'}, project.deadline ?? "-"),
                            React.createElement(Button, {key: 'project-show'}, "-")
                        )
                    )
                ),
            ]
        ) : React.createElement("p", {key: 'hint-no-projects', className: 'pl-2'}, "Aktuell sind keine Projekte vorhanden.")
    );

    return [tableIntroduction, table];
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));