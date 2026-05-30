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
    useEffect(() => {
        requireLogin(setUsername);
    }, []);

    return React.createElement(
        ThemeProvider,
        { theme },
        React.createElement(MenuComponent),
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

    const editUser = () => {
        window.location.href="../home/home.html"
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
            {key: 'user-table-container', className: 'table-container', size: 'small'},
            [
                React.createElement(
                    TableHead,
                    {key: 'user-table-head', className: 'user-table-head pl-2'},
                    [
                        React.createElement(
                            TableRow,
                            {key: 'user-table-columns'},
                            [
                                React.createElement(TableCell, {key: 'users-id'}, 'ID'),
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
                            React.createElement(TableCell, {key: 'user-id'}, user.id),
                            React.createElement(TableCell, {key: 'user-username'}, user.username),
                            React.createElement(TableCell, {key: 'user-role'}, user.username  ?? "-"),
                            React.createElement(
                                TableCell,
                                { key: "users-edit", onClick: editUser },
                                [
                                    React.createElement(
                                        IconButton,
                                        { key: "edit-user-icon-btn" },
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
            .then(roles => setRoles(roles));
    }, []);

    const editRole = () => {
        window.location.href="../home/home.html"
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
                                React.createElement(TableCell, {key: 'roles-id'}, 'ID'),
                                React.createElement(TableCell, {key: 'roles-name'}, 'Bezeichnung'),
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
                            React.createElement(TableCell, {key: 'role-id'}, role.id),
                            React.createElement(TableCell, {key: 'role-username'}, role.name),
                            React.createElement(
                                TableCell,
                                { key: "roles-edit", onClick: editRole },
                                [
                                    React.createElement(
                                        IconButton,
                                        { key: "edit-role-icon-btn" },
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