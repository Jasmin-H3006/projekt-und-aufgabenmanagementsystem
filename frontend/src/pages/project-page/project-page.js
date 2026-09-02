import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {
    Button,
    IconButton,
    Toolbar
} from "@mui/material";
import {requireLogin} from "../../js/session-handling.js";
import {BackButton} from "../../js/back-button.js";
import {pageBuilder} from "../../js/page-builder.js";
import EditIcon from '@mui/icons-material/Edit';

const urlParams = new URLSearchParams(window.location.search);
const projectIdInUrl = urlParams.get("projectId");

function Page() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");

    useEffect(() => {
        requireLogin(setUsername, false, false, false, false, false, true)
            .then(setUser);
    }, []);

    const backLink = '../home/home.html';

    return pageBuilder(user, [React.createElement(BackButton, {pageLink: backLink}), React.createElement(ProjectOverview), React.createElement(ProjectTasks)])
}

function ProjectOverview() {
    const [title, setTitle] = useState("");
    const [customer, setCustomer] = useState("");
    const [contactPersons, setContactPersons] = useState([]);
    const [projectManager, setProjectManager] = useState("");
    const [users, setUsers] = useState([]);
    const [deadline, setDeadline] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (!projectIdInUrl) return;
        fetch(`http://localhost:8080/api/projects/${projectIdInUrl}`)
            .then(r => r.json())
            .then(project => {
                setTitle(project.title)
                setCustomer(project.customer)
                setContactPersons(project.contactPersons)
                setProjectManager(project.projectManager)
                setUsers(project.users)
                setDeadline(project.deadline)
                setDescription(project.description)
            });
    }, [projectIdInUrl]);

    const introduction = React.createElement(
        Toolbar,
        {key: 'project-introduction', className: 'introduction pl-0 pt-3'},
        React.createElement('h3', {key: 'introduction-header', className: 'pl-2'}, "Projekt '" + title + "' ( ID: " + projectIdInUrl + " )")

    );

    const infos = React.createElement('div', {key: 'project-infos', className: 'pl-2'}, [
        React.createElement('div', {key: 'customer-container'}, [
            React.createElement('p', {key: 'customer-intro', className: 'project-info intro'}, "Kunde:"),
            React.createElement('p', {key: 'customer', className: 'project-info info'}, customer.name + " ( " + customer.website + " ) "),
        ]),
        React.createElement('div', {key: 'customer-contact-persons-container', className: 'customer-contact-persons-container'}, [
            React.createElement('p', {key: 'customer-contact-persons-intro', className: 'project-info intro'}, "Ansprechpartner: "),
            contactPersons.length > 0 ?
                React.createElement('div', {key: 'customer-contact-persons', className: 'project-info info'},
                    contactPersons.map(contactPerson =>
                        React.createElement(
                            'p',
                            { key: contactPerson.id },
                            `${contactPerson.name} (${contactPerson.email}${contactPerson.telefone ? ", " + contactPerson.telefone : ""})`
                        )
                    )
                ) : React.createElement('p', {key: 'no-customer-contact-persons', className: 'project-info info'}, "Dem Projekt wurden keine Ansprechpartner zugewiesen.")
        ]),
        React.createElement('div', {key: 'project-manager-container'}, [
            React.createElement('p', {key: 'project-manager-intro', className: 'project-info intro'}, "Projektleiter:"),
            React.createElement('p', {key: 'project-manager', className: 'project-info info'}, projectManager.username),
        ]),
        React.createElement('div', {key: 'users-container', className: 'users-container'}, [
            React.createElement('p', {key: 'users-intro', className: 'project-info intro'}, "Beteiligte Mitarbeiter: "),
            users.length > 0 ?
                React.createElement('div', {key: 'users', className: 'project-info info'},
                    users.map(user =>
                        React.createElement(
                            'p',
                            { key: user.id },
                            `${user.username}`
                        )
                    )
                ) : React.createElement('p', {key: 'no-users', className: 'project-info info'}, "Dem Projekt wurden keine Mitarbeiter zugewiesen.")
        ]),
        React.createElement('div', {key: 'deadline-container'}, [
            React.createElement('p', {key: 'deadline-intro', className: 'project-info intro'}, "Frist zur Fertigstellung:"),
            React.createElement('p', {key: 'deadline', className: 'project-info info'}, deadline ? deadline : "-"),
        ]),
        React.createElement('div', {key: 'description-container'}, [
            React.createElement('p', {key: 'description-intro', className: 'project-info intro'}, "Beschreibung:"),
            React.createElement('p', {key: 'description', className: 'project-info info'}, description),
        ])
    ])

    return [introduction, infos]
}

function ProjectTasks() {
    const [projectTasks, setProjectTasks] = useState([])

    useEffect(() => {
        fetch(`http://localhost:8080/api/tasks/projects/${projectIdInUrl}`)
            .then(res => res.json())
            .then(projectTasks => setProjectTasks(projectTasks));
    }, [projectIdInUrl]);

    const editProjectTask = (projectIdInUrl, projectTaskId) => {
        window.location.href='../create-edit-task/create-edit-task.html?projectId=' + projectIdInUrl + '&projectTaskId=' + projectTaskId
    };

    const introduction = React.createElement(
        Toolbar,
        {key: 'project-tasks-introduction', className: 'introduction-with-btn pl-0 pt-3'}, [
            React.createElement('h3', {key: 'tasks-introduction-header', className: 'pl-2'}, "Aufgaben"),
            React.createElement(Button, {key: 'btn-new-task', className: 'btn-new-task', color: 'primary', variant: 'contained', href: '../create-edit-task/create-edit-task.html?projectId=' + projectIdInUrl}, "Neue Aufgabe anlegen")
        ]
    );

    const tasks =
        // Aufgaben-Container
        React.createElement(
            'div', {key: 'tasks-container', className: 'tasks-container pl-5 pr-5 pt-2'},
            // Einzelnen Aufgaben-Container
            projectTasks.length > 0 ? projectTasks.map (projectTask =>
                React.createElement(
                    'div', {key: 'task-container-' + projectTask.id, className: 'task-container'},
                    React.createElement(
                        'div', {key: 'task-title-container', className: 'task-title-container'}, [
                        React.createElement('h3', {key: 'task-title'}, projectTask.title),
                        React.createElement(
                            'div',
                            { key: 'task-edit', className: 'task-edit'},
                            React.createElement(
                                IconButton,
                                { key: 'edit-task-icon-btn', className: 'edit-task-icon-btn', onClick: () => editProjectTask(projectIdInUrl, projectTask.id) },
                                React.createElement(EditIcon, { fontSize: "small" })
                            )
                        )]
                    ),
                    React.createElement(
                        'p', {key: 'task-description', className: 'task-description'}, projectTask.description
                    ),
                    React.createElement(
                        'div', {key: 'task-state', className: 'task-state', style: {backgroundColor: projectTask.taskState.color}}, 'Status: ' + projectTask.taskState.name
                    )
                )
            ) : React.createElement("p", {key: 'hint-no-tasks', className: 'pl-2'}, "Aktuell sind keine Aufgaben vorhanden.")
        );

    return [introduction, tasks]
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));