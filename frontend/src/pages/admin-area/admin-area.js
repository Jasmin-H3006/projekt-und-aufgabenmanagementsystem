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
            "div", {key: 'users-container', className: 'list-container users-list-container pl-1 pr-1 pl-md-up-5 pr-md-up-5'},
            users.map(user =>
                React.createElement(
                    "div", { key: user.id, className: "list-element mb-1-5"  }, [
                    React.createElement("p", {key: 'user-username', className: "pl-1"}, user.username),
                    React.createElement("p", {key: 'user-role', className: "pl-1 bl-light"}, user.role.name),
                    React.createElement("p", {key: 'user-state', className: 'pl-1 bl-light user-state' + ((user.status === "ACTIVE") ? ' active-user' : ' inactive-user')}, (user.status === "ACTIVE") ? "Aktiv" : "Inaktiv"),
                    React.createElement(
                        "div", { key: "user-edit", className: "edit-list-element pr-1" },
                        React.createElement(
                            IconButton, { key: "edit-user-icon-btn", className: "card-element-icon-btn", onClick: () => editUser(user.id) },
                            React.createElement(EditIcon, { key: "edit-user-icon", fontSize: "small" })
                        )
                    )
                ])
            )
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

    const taskStatesIntroduction = (
        React.createElement(
            Toolbar, {key: 'task-states-introduction', className: 'introduction-with-btn pl-0 pt-3'},
            [
                React.createElement('h3', {key: 'introduction-header-task-states', className: 'pl-2'}, "Status von Aufgaben"),
                React.createElement(Button, {key: 'btn-new-task-state', className: 'btn-new-task-state', color: 'primary', variant: 'contained', href: '../create-edit-task-state/create-edit-task-state.html'}, "Neuen Status anlegen")
            ]
        )
    );

    const taskStatesList = (
        taskStates.length > 0 ? React.createElement(
            "div", {key: 'task-states-container', className: 'list-container task-states-list-container pl-1 pr-1 pl-md-up-5 pr-md-up-5'},
            taskStates.map(taskState =>
                React.createElement(
                    "div", { key: taskState.id, className: "list-element mb-1-5" }, [
                    React.createElement("p", {key: 'task-state-name', className: "pl-1"}, taskState.name),
                    React.createElement("p", {key: 'task-state-color', className: 'task-state-color', style: {backgroundColor: taskState.color, color: taskState.fontColorBlack ? 'black' : 'white'}}, taskState.color),
                    React.createElement(
                        "div", { key: "task-state-edit", className: "edit-list-element pr-1" },
                        React.createElement(
                            IconButton, { key: "edit-task-state-icon-btn", className: "card-element-icon-btn", onClick: () => editTaskState(taskState.id) },
                            React.createElement(EditIcon, { key: "edit-task-state-icon", fontSize: "small" })
                        )
                    )]
                )
            )
        ) : React.createElement("p", {key: 'hint-no-task-states', className: 'pl-2'}, "Aktuell sind keine Status für Aufgaben hinterlegt.")
    );
    return [taskStatesIntroduction, taskStatesList];
}