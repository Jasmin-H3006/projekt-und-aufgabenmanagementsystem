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
    IconButton
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import {ThemeProvider} from "@mui/material/styles";
import {MenuComponent} from '../../js/menu-component.js';
import theme from "../../css/theme-provider.js";
import {requireLogin} from "../../js/session-handling.js";

function Page() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");
    useEffect(() => {
        requireLogin(setUsername, true)
            .then(setUser);
    }, []);

    return React.createElement(
        ThemeProvider,
        { theme },
        React.createElement(MenuComponent, { user }),
        React.createElement(UserOverview),
        React.createElement(RoleOverview)
    );
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
            {key: 'users-introduction', className: 'table-introduction pl-0 pt-3'},
            [
                React.createElement('h3', {key: 'introduction-header', className: 'pl-2'}, "Benutzer"),
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
            {key: 'roles-introduction', className: 'table-introduction pl-0 pt-3'},
            [
                React.createElement('h3', {key: 'introduction-header', className: 'pl-2'}, "Rollen"),
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

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));