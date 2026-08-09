import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {
    Button,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Toolbar,
    TableHead,
    IconButton, Box
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import {ThemeProvider} from "@mui/material/styles";
import {MenuComponent} from '../../js/menu-component.js';
import theme from "../../css/theme-provider.js";
import {requireLogin} from "../../js/session-handling.js";
import {FooterComponent} from "../../js/footer-component.js";
import {pageBuilder} from "../../js/page-builder.js";

function Page() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");
    useEffect(() => {
        requireLogin(setUsername, true)
            .then(setUser);
    }, []);

    return pageBuilder(user,
        [
            React.createElement(UserOverview),
            React.createElement(RoleOverview),
            React.createElement(TaskStatesOverview)
        ]
    )
}

function UserOverview() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/users/get-all")
            .then(res => res.json())
            .then(users => setUsers(users));
    }, []);

    const editUser = (userId) => {
        window.location.href='../create-edit-user/create-edit-user.html?id=' + userId
    };

    const tableIntroduction = (
        React.createElement(
            Toolbar,
            {key: 'users-introduction', className: 'introduction-with-btn pl-0 pt-3'},
            [
                React.createElement('h3', {key: 'introduction-header-users', className: 'pl-2'}, "Benutzer"),
                React.createElement(Button, {key: 'btn-new-user', className: 'btn-new-user', color: 'primary', variant: 'contained', href: '../create-edit-user/create-edit-user.html'}, "Neuen Benutzer anlegen")
            ]
        )
    );

    const table = (
        users.length > 0 ? React.createElement(
            Table,
            {key: 'user-table-container', className: 'table-container user-table-container', size: 'small'},
            [
                React.createElement(
                    TableHead,
                    {key: 'user-table-head', className: 'user-table-head pl-2'},
                    [
                        React.createElement(
                            TableRow,
                            {key: 'user-table-columns'},
                            [
                                React.createElement(TableCell, {key: 'users-username'}, 'Benutzername'),
                                React.createElement(TableCell, {key: 'users-role'}, 'Rolle'),
                                React.createElement(TableCell, {key: 'users-edit'}, "Benutzer bearbeiten")
                            ]
                        ),
                    ]
                ),
                React.createElement(
                    TableBody,
                    {key: 'user-table-body'},
                    users.map(user =>
                        React.createElement(
                            TableRow,
                            { key: user.id },
                            React.createElement(TableCell, {key: 'user-username'}, user.username),
                            React.createElement(TableCell, {key: 'user-role'}, user.role.name),
                            React.createElement(
                                TableCell,
                                { key: "user-edit" },
                                [
                                    React.createElement(
                                        IconButton,
                                        { key: "edit-user-icon-btn", onClick: () => editUser(user.id) },
                                        React.createElement(EditIcon, { fontSize: "small" })
                                    ),
                                    null,
                                ]
                            ),
                        )
                    )
                ),
            ]
        ) : React.createElement("p", {key: 'hint-no-users', className: 'pl-2'}, "Aktuell sind keine Benutzer vorhanden.")
    );

    return [tableIntroduction, table];
}

function RoleOverview() {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/roles/get-all")
            .then(res => res.json())
            .then(role => setRoles(role));
    }, []);

    const editRole = (roleId) => {
        window.location.href='../create-edit-role/create-edit-role.html?id=' + roleId
    };

    const tableIntroduction = (
        React.createElement(
            Toolbar,
            {key: 'roles-introduction', className: 'introduction-with-btn pl-0 pt-3'},
            [
                React.createElement('h3', {key: 'introduction-header-roles', className: 'pl-2'}, "Rollen"),
                React.createElement(Button, {key: 'btn-new-role', className: 'btn-new-role', color: 'primary', variant: 'contained', href: '../create-edit-role/create-edit-role.html'}, "Neue Rolle anlegen")
            ]
        )
    );

    const table = (
        roles.length > 0 ? React.createElement(
            Table,
            {key: 'role-table-container', className: 'table-container role-table-container', size: 'small'},
            [
                React.createElement(
                    TableHead,
                    {key: 'role-table-head', className: 'role-table-head pl-2'},
                    [
                        React.createElement(
                            TableRow,
                            {key: 'role-table-columns'},
                            [
                                React.createElement(TableCell, {key: 'roles-name'}, 'Rolle'),
                                React.createElement(TableCell, {key: 'roles-admin-access'}, 'Admin-Zugang'),
                                React.createElement(TableCell, {key: 'roles-all-projects-access'}, 'Einsicht in alle Projekte'),
                                React.createElement(TableCell, {key: 'roles-create-projects-access'}, 'Neue Projekte anlegen'),
                                React.createElement(TableCell, {key: 'roles-edit-available-projects-access'}, 'Einsehbare Projekte bearbeiten'),
                                React.createElement(TableCell, {key: 'roles-create-and-edit-tasks-access'}, 'Neue Aufgaben anlegen und bestehende bearbeiten'),
                                React.createElement(TableCell, {key: 'roles-customer-page-access'}, 'Zugang zur Kunden-Übersicht'),
                                React.createElement(TableCell, {key: 'roles-edit'}, "Rolle bearbeiten")
                            ]
                        ),
                    ]
                ),
                React.createElement(
                    TableBody,
                    {key: 'role-table-body'},
                    roles.map(role =>
                        React.createElement(
                            TableRow,
                            { key: role.id },
                            React.createElement(TableCell, {key: 'role-name'}, role.name),
                            React.createElement(TableCell, {key: 'role-admin-access'}, role.adminAccess ? "Ja" : "Nein"),
                            React.createElement(TableCell, {key: 'role-all-projects-access'}, role.allProjectsAccess ? "Ja" : "Nein"),
                            React.createElement(TableCell, {key: 'role-create-projects-access'}, role.createProjectsAccess ? "Ja" : "Nein"),
                            React.createElement(TableCell, {key: 'role-edit-available-projects-access'}, role.editAvailableProjectsAccess ? "Ja" : "Nein"),
                            React.createElement(TableCell, {key: 'role-create-and-edit-tasks-access'}, role.createAndEditTasksAccess ? "Ja" : "Nein"),
                            React.createElement(TableCell, {key: 'role-customer-page-access'}, role.customerPageAccess ? "Ja" : "Nein"),
                            React.createElement(
                                TableCell,
                                { key: "role-edit" },
                                [
                                    React.createElement(
                                        IconButton,
                                        { key: "edit-role-icon-btn", onClick: () => editRole(role.id) },
                                        React.createElement(EditIcon, { fontSize: "small" })
                                    ),
                                    null,
                                ]
                            ),
                        )
                    )
                ),
            ]
        ) : React.createElement("p", {key: 'hint-no-roles', className: 'pl-2'}, "Es wurden noch keine Rollen definiert.")
    );

    return [tableIntroduction, table];
}

function TaskStatesOverview() {
    const [taskStates, setTaskStates] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/task-states/get-all")
            .then(res => res.json())
            .then(taskStates => setTaskStates(taskStates));
    }, []);

    const editTaskState = (taskStateId) => {
        window.location.href='../create-edit-task-state/create-edit-task-state.html?id=' + taskStateId
    };

    const tableIntroduction = (
        React.createElement(
            Toolbar,
            {key: 'task-states-introduction', className: 'introduction-with-btn pl-0 pt-3'},
            [
                React.createElement('h3', {key: 'introduction-header-task-states', className: 'pl-2'}, "Status von Aufgaben"),
                React.createElement(Button, {key: 'btn-new-task-state', className: 'btn-new-task-state', color: 'primary', variant: 'contained', href: '../create-edit-task-state/create-edit-task-state.html'}, "Neuen Status anlegen")
            ]
        )
    );

    const table = (
        taskStates.length > 0 ? React.createElement(
            Table,
            {key: 'task-state-table-container', className: 'table-container task-state-table-container', size: 'small'},
            [
                React.createElement(
                    TableHead,
                    {key: 'task-state-table-head', className: 'task-state-table-head pl-2'},
                    [
                        React.createElement(
                            TableRow,
                            {key: 'task-state-table-columns'},
                            [
                                React.createElement(TableCell, {key: 'task-states-name'}, 'Status'),
                                React.createElement(TableCell, {key: 'task-states-color'}, 'Farbe'),
                                React.createElement(TableCell, {key: 'task-states-edit'}, "Status bearbeiten")
                            ]
                        ),
                    ]
                ),
                React.createElement(
                    TableBody,
                    {key: 'task-state-table-body'},
                    taskStates.map(taskState =>
                        React.createElement(
                            TableRow,
                            { key: taskState.id },
                            React.createElement(TableCell, {key: 'task-state-name'}, taskState.name),
                            React.createElement(TableCell, {key: 'task-state-color'}, taskState.color),
                            React.createElement(
                                TableCell,
                                { key: "task-state-edit" },
                                [
                                    React.createElement(
                                        IconButton,
                                        { key: "edit-task-state-icon-btn", onClick: () => editTaskState(taskState.id) },
                                        React.createElement(EditIcon, { fontSize: "small" })
                                    ),
                                    null,
                                ]
                            ),
                        )
                    )
                ),
            ]
        ) : React.createElement("p", {key: 'hint-no-task-states', className: 'pl-2'}, "Aktuell sind keine Status für Aufgaben hinterlegt.")
    );
    return [tableIntroduction, table];
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));