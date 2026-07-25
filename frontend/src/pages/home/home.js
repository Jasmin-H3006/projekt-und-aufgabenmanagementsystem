import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {Button, Table, TableBody, TableRow, TableCell, Toolbar, Typography, IconButton} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import {MenuComponent} from '../../js/menu-component.js';
import theme from "../../css/theme-provider.js";
import {ProjectsTableHeader} from "../../js/projects-table.js";
import {requireLogin} from "../../js/session-handling.js";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

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
        React.createElement(ToCustomerPage, { user }),
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

function ToCustomerPage({user}) {
    return (
        user.customerPageAccess ? React.createElement(
            Button,
            {key: 'btn-to-customer-page', className: 'btn-to-customer-page ml-2 mt-3', color: 'primary', variant: 'outlined', href: '../customer-page/customer-page.html'},
            "Zur Kunden-Übersicht"
        ) : null
    );
}

function MyProjectsTable() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/projects/get-all")
            .then(res => res.json())
            .then(projects => setProjects(projects));
    }, []);

    const viewProject = (projectId) => {
        window.location.href='../project-page/project-page.html?projectId=' + projectId
    }

    const editProject = (projectId) => {
        window.location.href='../create-edit-project/create-edit-project.html?projectId=' + projectId
    };

    const tableIntroduction = (
        React.createElement(
            Toolbar,
            {key: 'projects-introduction', className: 'introduction-with-btn pl-0 pt-3'},
            [
                React.createElement('h3', {key: 'introduction-header', className: 'pl-2'}, "Meine Projekte"),
                React.createElement(Button, {key: 'btn-new-project', className: 'btn-new-project', color: 'primary', variant: 'contained', href: '../create-edit-project/create-edit-project.html'}, "Neues Projekt anlegen")
            ]
        )
    );

    const table = (
        projects.length > 0 ? React.createElement(
            Table,
            {key: 'projects-table', className: 'table-container projects-table-container', size: 'small'},
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
                            React.createElement(TableCell, {key: 'project-user'},
                                project.users && project.users.length > 0
                                ? project.users.map(user => user.username).join(", ")
                                : "-"
                            ),
                            React.createElement(TableCell, {key: 'project-deadline'}, project.deadline ?? "-"),
                            React.createElement(
                                TableCell,
                                { key: "project-view" },
                                [
                                    React.createElement(
                                        IconButton,
                                        { key: "view-project", onClick: () => viewProject(project.id) },
                                        React.createElement(VisibilityIcon, { fontSize: "small" })
                                    ),
                                    null,
                                ]
                            ),
                            React.createElement(
                                TableCell,
                                { key: "project-edit" },
                                [
                                    React.createElement(
                                        IconButton,
                                        { key: "edit-project-icon-btn", onClick: () => editProject(project.id) },
                                        React.createElement(EditIcon, { fontSize: "small" })
                                    ),
                                    null,
                                ]
                            ),
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