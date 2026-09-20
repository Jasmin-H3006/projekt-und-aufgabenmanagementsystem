import React, {useEffect, useState} from 'react';
import {Button, Table, TableBody, TableRow, TableCell, Toolbar, TableHead, IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import {requireLogin} from "../../js/session-handling.js";
import {pageBuilder, renderInDOM} from "../../js/page-builder.js";

renderInDOM(Page); // DOM

function Page() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");
    useEffect(() => {
        requireLogin(setUsername, true)
            .then(setUser);
    }, []);

    return pageBuilder(user,
        [
            React.createElement(UserOverview, {key: 'user-overview'}),
            React.createElement(RoleOverview, {key: 'role-overview'}),
            React.createElement(TaskStatesOverview, {key: 'task-states-overview'})
        ]
    )
}

function UserOverview() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Get all user
        fetch("http://localhost:8080/api/users/get-all")
            .then(res => res.json())
            .then(users => setUsers(users));
    }, []);

    const editUser = (userId) => { window.location.href='../create-edit-user/create-edit-user.html?id=' + userId };

    const tableIntroduction = (
        React.createElement(
            Toolbar, {key: 'users-introduction', className: 'introduction-with-btn pl-0 pt-3'},
            [
                React.createElement('h3', {key: 'introduction-header-users', className: 'pl-2'}, "Benutzer"),
                React.createElement(Button, {key: 'btn-new-user', className: 'btn-new-user', color: 'primary', variant: 'contained', href: '../create-edit-user/create-edit-user.html'}, "Neuen Benutzer anlegen")
            ]
        )
    );

    const table = (
        users.length > 0 ? React.createElement(
            Table, {key: 'user-table-container', className: 'table-container user-table-container', size: 'small'},
            [
                React.createElement(
                    TableHead, {key: 'user-table-head', className: 'user-table-head pl-2'},
                    React.createElement(
                        TableRow, {key: 'user-table-columns'},
                        [
                            React.createElement(TableCell, {key: 'users-username'}, 'Benutzername'),
                            React.createElement(TableCell, {key: 'users-role'}, 'Rolle'),
                            React.createElement(TableCell, {key: 'users-state'}, 'Status'),
                            React.createElement(TableCell, {key: 'users-edit'}, "Benutzer bearbeiten")
                        ]
                    )
                ),
                React.createElement(
                    TableBody, {key: 'user-table-body'},
                    users.map(user =>
                        React.createElement(
                            TableRow, { key: user.id },
                            React.createElement(TableCell, {key: 'user-username'}, user.username),
                            React.createElement(TableCell, {key: 'user-role'}, user.role.name),
                            React.createElement(TableCell, {key: 'user-state'}, (user.status === "ACTIVE") ? "Aktiv" : "Inaktiv"),
                            React.createElement(
                                TableCell, { key: "user-edit" },
                                React.createElement(
                                    IconButton, { key: "edit-user-icon-btn", onClick: () => editUser(user.id) },
                                    React.createElement(EditIcon, { key: "edit-user-icon", fontSize: "small" })
                                )
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
        // Get all roles
        fetch("http://localhost:8080/api/roles/get-all")
            .then(res => res.json())
            .then(role => setRoles(role));
    }, []);

    const editRole = (roleId) => { window.location.href='../create-edit-role/create-edit-role.html?id=' + roleId };

    const roleCardsIntroduction = (
        React.createElement(
            Toolbar, {key: 'roles-introduction', className: 'introduction-with-btn pl-0 pt-3'},
            [
                React.createElement('h3', {key: 'introduction-header-roles', className: 'pl-2'}, "Rollen"),
                React.createElement(Button, {key: 'btn-new-role', className: 'btn-new-role', color: 'primary', variant: 'contained', href: '../create-edit-role/create-edit-role.html'}, "Neue Rolle anlegen")
            ]
        )
    );

    const roleCards =
        // Rollen-Container
        React.createElement(
            'div', {key: 'roles-container', className: 'cards-container pl-1 pr-1 pl-md-up-5 pr-md-up-5'},
            // Einzelne Rollen-Container
            roles.length > 0 ? roles.map (role =>
                React.createElement(
                    'div', {key: 'role-container-' + role.id, className: 'card-container'},
                    React.createElement(
                        'div', {key: 'role-title-container', className: 'card-title-container'}, [
                            React.createElement('h3', {key: 'role-title'}, role.name),
                            React.createElement(
                                'div', { key: 'edit-role', className: 'edit-card-element'},
                                React.createElement(
                                    IconButton, { key: 'edit-role-icon-btn', className: 'card-element-icon-btn', onClick: () => editRole(role.id) },
                                    React.createElement(EditIcon, { key: 'edit-role-icon', fontSize: "small" })
                                )
                            )
                        ]
                    ),
                    React.createElement(
                        'div', {key: 'role-infos-container'}, [
                            React.createElement('p', {key: 'role-info-admin-access'}, role.adminAccess ? "Admin-Zugang: Ja" : "Admin-Zugang: Nein"),
                            React.createElement('p', {key: 'role-info-all-projects-access'}, role.allProjectsAccess ? "Einsicht in alle Projekte: Ja" : "Einsicht in alle Projekte: Nein"),
                            React.createElement('p', {key: 'role-info-create-projects-access'}, role.createProjectsAccess ? "Neue Projekte anlegen: Ja" : "Neue Projekte anlegen: Nein"),
                            React.createElement('p', {key: 'role-info-edit-available-projects-access'}, role.editAvailableProjectsAccess ? "Einsehbare Projekte bearbeiten: Ja" : "Einsehbare Projekte bearbeiten: Nein"),
                            React.createElement('p', {key: 'role-info-create-and-edit-tasks-access'}, role.createAndEditTasksAccess ? "Aufgaben anlegen und bearbeiten: Ja" : "Aufgaben anlegen und bearbeiten: Nein"),
                            React.createElement('p', {key: 'role-info-customer-page-access'}, role.customerPageAccess ? "Zugang zur Kunden-Übersicht: Ja" : "Zugang zur Kunden-Übersicht: Nein")
                        ]
                    )
                )
            ) : React.createElement("p", {key: 'hint-no-roles', className: 'pl-2'}, "Es wurden noch keine Rollen definiert.")
        );
    return [roleCardsIntroduction, roleCards];
}

function TaskStatesOverview() {
    const [taskStates, setTaskStates] = useState([]);

    useEffect(() => {
        // Get all task states
        fetch("http://localhost:8080/api/task-states/get-all")
            .then(res => res.json())
            .then(taskStates => setTaskStates(taskStates));
    }, []);

    const editTaskState = (taskStateId) => { window.location.href='../create-edit-task-state/create-edit-task-state.html?id=' + taskStateId };

    const tableIntroduction = (
        React.createElement(
            Toolbar, {key: 'task-states-introduction', className: 'introduction-with-btn pl-0 pt-3'},
            [
                React.createElement('h3', {key: 'introduction-header-task-states', className: 'pl-2'}, "Status von Aufgaben"),
                React.createElement(Button, {key: 'btn-new-task-state', className: 'btn-new-task-state', color: 'primary', variant: 'contained', href: '../create-edit-task-state/create-edit-task-state.html'}, "Neuen Status anlegen")
            ]
        )
    );

    const table = (
        taskStates.length > 0 ? React.createElement(
            Table, {key: 'task-state-table-container', className: 'table-container task-state-table-container', size: 'small'},
            [
                React.createElement(
                    TableHead, {key: 'task-state-table-head', className: 'task-state-table-head pl-2'},
                    React.createElement(
                        TableRow, {key: 'task-state-table-columns'},
                        [
                            React.createElement(TableCell, {key: 'task-states-name'}, 'Status'),
                            React.createElement(TableCell, {key: 'task-states-color'}, 'Farbe'),
                            React.createElement(TableCell, {key: 'task-states-edit'}, "Status bearbeiten")
                        ]
                    )
                ),
                React.createElement(
                    TableBody, {key: 'task-state-table-body'},
                    taskStates.map(taskState =>
                        React.createElement(
                            TableRow, { key: taskState.id },
                            React.createElement(TableCell, {key: 'task-state-name'}, taskState.name),
                            React.createElement(TableCell, {key: 'task-state-color', style: {backgroundColor: taskState.color, color: taskState.fontColorBlack ? 'black' : 'white'}}, taskState.color),
                            React.createElement(
                                TableCell, { key: "task-state-edit" },
                                React.createElement(
                                    IconButton, { key: "edit-task-state-icon-btn", onClick: () => editTaskState(taskState.id) },
                                    React.createElement(EditIcon, { key: "edit-task-state-icon", fontSize: "small" })
                                )
                            )
                        )
                    )
                )
            ]
        ) : React.createElement("p", {key: 'hint-no-task-states', className: 'pl-2'}, "Aktuell sind keine Status für Aufgaben hinterlegt.")
    );
    return [tableIntroduction, table];
}